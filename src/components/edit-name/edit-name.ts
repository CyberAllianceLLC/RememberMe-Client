import { Component } from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {LocalStorageDirective} from "../../directives/local-storage/local-storage";
import {NotificationDirective} from "../../directives/notification/notification";
import _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'edit-name',
  templateUrl: 'edit-name.html'
})
export class EditNameComponent {

  nameForm: FormGroup;
  name: any;
  picture: string;

  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private localStorage: LocalStorageDirective,
              private notificationService: NotificationDirective) {
    this.name = params.get('name');
    this.picture = this.name.picture;
    this.nameForm = this.formBuilder.group({
      name: [this.name.name, [Validators.required]],
      description: [this.name.description]
    });
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  saveName() {
    const name = {
      name_id: this.name.name_id,
      picture: this.picture,
      name: this.nameForm.value.name,
      description: this.nameForm.value.description
    };
    this.localStorage.get('Names').then((result: any) => {
      let names = (_.isArray(result) ? result : []);
      if(_.findIndex(names, ['name_id', name.name_id]) >= 0) {
        names[_.findIndex(names, ['name_id', name.name_id])] = name;
        return this.localStorage.set('Names', names);
      } else {
        throw Error('Unable to get id from name');
      }
    }).then(() => {
      this.notificationService.sendNotification({
        type: 'success',
        message: `${this.nameForm.value.name} saved!`
      });
      this.viewCtrl.dismiss({
        name: name
      });
    }).catch(() => {
      this.notificationService.sendNotification({
        type: 'error',
        message: 'Unable to save name.'
      });
    });
  }

  getPicture() {
    return (this.name.picture !== '' ? this.name.picture : '../assets/imgs/profile_pic.png');
  }

  setPicture() {
    console.log('setting picture...');
  }
}