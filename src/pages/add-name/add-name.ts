import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalStorageDirective } from "../../directives/local-storage/local-storage";
import _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationDirective} from "../../directives/notification/notification";

@Component({
  selector: 'page-add-name',
  templateUrl: 'add-name.html',
})
export class AddNamePage {

  nameForm: FormGroup;
  picture = '';

  constructor(public navCtrl: NavController,
              private localStorage: LocalStorageDirective,
              private formBuilder: FormBuilder,
              private notificationService: NotificationDirective) {
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
        picture: this.picture,
        name: this.nameForm.value.name,
        description: this.nameForm.value.description
      });
      return this.localStorage.set('Names', names);
    }).then(() => {
      this.notificationService.sendNotification({
        type: 'success',
        message: `${this.nameForm.value.name} saved!`
      });
      this.navCtrl.pop();
    }).catch(() => {
      this.notificationService.sendNotification({
        type: 'error',
        message: 'Unable to save name.'
      });
    });
  }

}
