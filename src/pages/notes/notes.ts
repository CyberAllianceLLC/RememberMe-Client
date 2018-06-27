import {Component} from '@angular/core';
import { NavController } from "ionic-angular";
import _ from 'lodash';
import {AddNotePage} from "../add-note/add-note";
import {NoteProfilePage} from "../note-profile/note-profile";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {

  notes: any[];

  constructor(private navCtrl: NavController,
              private localStorage: LocalStorageProvider) {
  }

  ionViewDidEnter() {
    this.localStorage.get('Notes').then((result: any) => {
      this.notes = (_.isArray(result) ? result : []);
    });
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  addNote() {
    this.navCtrl.push(AddNotePage);
  }

  noteProfile(note) {
    this.navCtrl.push(NoteProfilePage, {
      note: note
    });
  }

}
