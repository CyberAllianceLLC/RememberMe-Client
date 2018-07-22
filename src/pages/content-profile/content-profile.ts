import { Component } from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import _ from 'lodash';
import {EditContentComponent} from "../../components/edit-content/edit-content";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";
import {EndpointServiceProvider} from "../../providers/endpoint-service/endpoint-service";

@Component({
  selector: 'page-content-profile',
  templateUrl: 'content-profile.html',
})
export class ContentProfilePage {

  content: any;
  isLoading: boolean = false;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private endpoints: EndpointServiceProvider,
              private notifications: NotificationServiceProvider) {
    this.content = this.navParams.get('content');
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  editContent() {
    const modal = this.modalCtrl.create(EditContentComponent, {
      content: this.content
    });
    modal.onDidDismiss((updated: boolean) => {
      if (updated) {
        // update content
        this.isLoading = true;
        this.endpoints.getContent([this.navParams.get('content').content_id]).then((data: any) => {
          this.isLoading = false;
          this.content = data[0];
        }).catch((error: any) => {
          this.isLoading = false;
        });
      }
    });
    modal.present();
  }

  deleteContent() {
    const alert = this.alertCtrl.create({
      title: `Delete ${_.capitalize(this.content.type)}`,
      subTitle: `Are you sure you want to delete this ${this.content.type}?`,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            // delete content
            this.isLoading = true;
            this.endpoints.removeContent([this.content.content_id]).then((data: any) => {
              this.isLoading = false;
              this.notifications.sendNotification({
                message: 'Successfully deleted content.'
              });
              this.navCtrl.pop();
            }).catch((error: any) => {
              this.isLoading = false;
              this.notifications.sendNotification({
                message: `Error: ${error}`
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

}
