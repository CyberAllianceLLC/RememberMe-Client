import { Component } from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import _ from 'lodash';
import {EditNoteComponent} from "../../components/edit-note/edit-note";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";

@Component({
  selector: 'page-note-profile',
  templateUrl: 'note-profile.html',
})
export class NoteProfilePage {

  note: any;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private localStorage: LocalStorageProvider,
              private notificatons: NotificationServiceProvider) {
    this.note = navParams.get('note');
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  editNote() {
    const modal = this.modalCtrl.create(EditNoteComponent, {
      note: this.note
    });
    modal.onDidDismiss(data => {
      if('note' in data) {
        this.note = data.note;
      }
    });
    modal.present();
  }

  deleteNote() {
    const alert = this.alertCtrl.create({
      title: 'Delete Note',
      subTitle: `Are you sure you want to delete this note?`,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: data => {
            this.localStorage.get('Notes').then((result: any) => {
              let notes = (_.isArray(result) ? result : []);
              if(_.findIndex(notes, ['note_id', this.note.note_id]) >= 0) {
                _.pullAt(notes, [_.findIndex(notes, ['note_id', this.note.note_id])]);
                return this.localStorage.set('Notes', notes);
              } else {
                throw Error('Unable to get id from note');
              }
            }).then(() => {
              this.notificatons.sendNotification({
                message: `Successfully deleted ${this.note.title}!`
              });
              this.navCtrl.pop();
            }).catch((error: any) => {
              this.notificatons.sendNotification({
                message: 'Error: Unable to delete note.'
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

}
