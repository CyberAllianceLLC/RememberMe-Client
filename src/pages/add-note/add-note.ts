import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import _ from 'lodash';
import shortid from 'shortid';
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";

@Component({
  selector: 'page-add-note',
  templateUrl: 'add-note.html',
})
export class AddNotePage {

  noteForm: FormGroup;
  picture = '';

  constructor(public navCtrl: NavController,
              private localStorage: LocalStorageProvider,
              private formBuilder: FormBuilder,
              private notifications: NotificationServiceProvider) {
    this.noteForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['']
    });
  }

  getPicture() {
    return (this.picture !== '' ? this.picture : '../assets/imgs/note_pic.png');
  }

  setPicture() {
    console.log('setting picture...');
  }

  saveNote() {
    this.localStorage.get('Notes').then((result: any) => {
      let notes = (_.isArray(result) ? result : []);
      notes.push({
        note_id: shortid.generate(),
        picture: this.picture,
        title: this.noteForm.value.title,
        description: this.noteForm.value.description
      });
      return this.localStorage.set('Notes', notes);
    }).then(() => {
      this.notifications.sendNotification({
        message: `${this.noteForm.value.title} saved!`
      });
      this.navCtrl.pop();
    }).catch(() => {
      this.notifications.sendNotification({
        message: 'Error: Unable to save note.'
      });
    });
  }

}
