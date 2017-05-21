/**
 * Created by smith on 5/10/2017.
 */
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppStorage} from "../../providers/AppStorage";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-add-notes',
  templateUrl: 'AddNote.html'
})
export class AddNotePage {

  private note : FormGroup;

  constructor(public navCtrl: NavController, private storage: AppStorage, private formBuilder: FormBuilder) {
    this.note = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  addNote() {
    this.storage.get('notes').then((result: any) => {
      if(Array.isArray(result)) {
        let note = this.note.value;
        result.unshift(note);
        this.storage.set('notes', result).then(() => {
          this.goBack();
        });
      }
      else {
        let note = this.note.value;
        this.storage.set('notes', [note]).then(() => {
          this.goBack();
        });
      }
    });
  }
}
