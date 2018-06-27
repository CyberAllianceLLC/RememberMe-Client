import { Component } from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";

@Component({
  selector: 'edit-note',
  templateUrl: 'edit-note.html'
})
export class EditNoteComponent {

  noteForm: FormGroup;
  note: any;
  picture: string;

  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private localStorage: LocalStorageProvider,
              private notifications: NotificationServiceProvider) {
    this.note = params.get('note');
    this.picture = this.note.picture;
    this.noteForm = this.formBuilder.group({
      title: [this.note.title, [Validators.required]],
      description: [this.note.description]
    });
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  saveNote() {
    const note = {
      note_id: this.note.note_id,
      picture: this.picture,
      title: this.noteForm.value.title,
      description: this.noteForm.value.description
    };
    this.localStorage.get('Notes').then((result: any) => {
      let notes = (_.isArray(result) ? result : []);
      if(_.findIndex(notes, ['note_id', note.note_id]) >= 0) {
        notes[_.findIndex(notes, ['note_id', note.note_id])] = note;
        return this.localStorage.set('Notes', notes);
      } else {
        throw Error('Unable to get id from note');
      }
    }).then(() => {
      this.notifications.sendNotification({
        message: `${this.noteForm.value.title} saved!`
      });
      this.viewCtrl.dismiss({
        note: note
      });
    }).catch(() => {
      this.notifications.sendNotification({
        message: 'Error: Unable to save note.'
      });
    });
  }

  getPicture() {
    return (this.note.picture !== '' ? this.note.picture : '../assets/imgs/note_pic.png');
  }

  setPicture() {
    console.log('setting picture...');
  }
}
