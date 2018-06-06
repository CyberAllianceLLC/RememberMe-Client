import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {NotificationDirective} from "../../directives/notification/notification";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalStorageDirective} from "../../directives/local-storage/local-storage";
import _ from 'lodash';
import shortid from 'shortid';

@Component({
  selector: 'page-add-note',
  templateUrl: 'add-note.html',
})
export class AddNotePage {

  noteForm: FormGroup;
  picture = '';

  constructor(public navCtrl: NavController,
              private localStorage: LocalStorageDirective,
              private formBuilder: FormBuilder,
              private notificationService: NotificationDirective) {
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
      this.notificationService.sendNotification({
        type: 'success',
        message: `${this.noteForm.value.title} saved!`
      });
      this.navCtrl.pop();
    }).catch(() => {
      this.notificationService.sendNotification({
        type: 'error',
        message: 'Unable to save note.'
      });
    });
  }

}
