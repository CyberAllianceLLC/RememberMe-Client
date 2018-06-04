import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NamesPage } from "../names/names";
import { NotesPage } from "../notes/notes";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  namesPage: any;
  notesPage: any;
  constructor(public navCtrl: NavController) {
    this.namesPage = NamesPage;
    this.notesPage = NotesPage;
  }

}
