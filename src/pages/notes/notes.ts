import {Component} from '@angular/core';
import {LocalStorageDirective} from "../../directives/local-storage/local-storage";
import {NavController} from "ionic-angular";
import _ from 'lodash';
import {AddNotePage} from "../add-note/add-note";

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {

  notes: any[];

  constructor(private navCtrl: NavController,
              private localStorage: LocalStorageDirective) {
  }

  ionViewDidEnter() {
    this.localStorage.get('Notes').then((result: any) => {
      this.notes = (_.isArray(result) ? result : []);
    });
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  noteProfile(note) {
    console.log(note.title);
  }

  addNote() {
    this.navCtrl.push(AddNotePage);
  }

}
