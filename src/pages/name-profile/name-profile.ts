import { Component } from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import _ from 'lodash';
import {EditNameComponent} from "../../components/edit-name/edit-name";
import {LocalStorageDirective} from "../../directives/local-storage/local-storage";
import {NotificationDirective} from "../../directives/notification/notification";

@Component({
  selector: 'page-name-profile',
  templateUrl: 'name-profile.html',
})
export class NameProfilePage {

  name: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private localStorage: LocalStorageDirective,
              private notificationService: NotificationDirective) {
    this.name = navParams.get('name');
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  editName() {
    const modal = this.modalCtrl.create(EditNameComponent, {
      name: this.name
    });
    modal.onDidDismiss(data => {
      if('name' in data) {
        this.name = data.name;
      }
    });
    modal.present();
  }

  deleteName() {
    const alert = this.alertCtrl.create({
      title: 'Delete Name',
      subTitle: `Are you sure you want to delete this name?`,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: data => {
            this.localStorage.get('Names').then((result: any) => {
              let names = (_.isArray(result) ? result : []);
              if(_.findIndex(names, ['name_id', this.name.name_id]) >= 0) {
                _.pullAt(names, [_.findIndex(names, ['name_id', this.name.name_id])]);
                return this.localStorage.set('Names', names);
              } else {
                throw Error('Unable to get id from name');
              }
            }).then(() => {
              this.notificationService.sendNotification({
                type: 'success',
                message: `Successfully deleted ${this.name.name}!`
              });
              this.navCtrl.pop();
            }).catch((error: any) => {
              this.notificationService.sendNotification({
                type: 'error',
                message: 'Unable to delete name.'
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

}
