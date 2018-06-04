import {Component, ViewChild} from '@angular/core';
import _ from 'lodash';
import {LocalStorageDirective} from "../../directives/local-storage/local-storage";

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {

  @ViewChild('nav') nav;
  notes: any[];

  constructor(private localStorage: LocalStorageDirective) {
    this.localStorage.get('Names').then((result: any) => {
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
    console.log('Add note');
  }

}
