import {Component} from '@angular/core';
import {NavController, reorderArray} from 'ionic-angular';
import _ from "lodash";

import {AddNotePage} from '../AddNote/AddNote';
import {AppStorage} from "../../providers/AppStorage";

@Component({
  selector: 'page-notes',
  templateUrl: 'Notes.html'
})
export class NotesPage {

  notes = [];
  edit = false;

  constructor(public nav: NavController, private storage: AppStorage) {}

  ionViewWillEnter() {
    this.storage.get('notes').then((result: any) => {
      if(Array.isArray(result) && !_.isEqual(this.notes, result)) {
        this.notes = result;
      }
    });
  }

  addNotesPage() {
    this.nav.push(AddNotePage);
  }

  editNotes(bool) {
    this.edit = bool;
  }

  reorderNotes(indexes) {
    this.notes = reorderArray(this.notes, indexes);
    this.storage.set('notes', this.notes);
  }
}
