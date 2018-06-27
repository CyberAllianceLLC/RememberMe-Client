import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import _ from 'lodash';
import shortid from 'shortid';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";

@Component({
  selector: 'page-add-name',
  templateUrl: 'add-name.html',
})
export class AddNamePage {

  nameForm: FormGroup;
  picture = '';

  constructor(public navCtrl: NavController,
              private localStorage: LocalStorageProvider,
              private formBuilder: FormBuilder,
              private notifications: NotificationServiceProvider) {
    this.nameForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  getPicture() {
    return (this.picture !== '' ? this.picture : '../assets/imgs/profile_pic.png');
  }

  setPicture() {
    console.log('setting picture...');
  }

  saveName() {
    this.localStorage.get('Names').then((result: any) => {
      let names = (_.isArray(result) ? result : []);
      names.push({
        name_id: shortid.generate(),
        picture: this.picture,
        name: this.nameForm.value.name,
        description: this.nameForm.value.description
      });
      return this.localStorage.set('Names', names);
    }).then(() => {
      this.notifications.sendNotification({
        message: `${this.nameForm.value.name} saved!`
      });
      this.navCtrl.pop();
    }).catch(() => {
      this.notifications.sendNotification({
        message: 'Error: Unable to save name.'
      });
    });
  }

}
