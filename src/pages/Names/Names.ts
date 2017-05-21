import {Component} from '@angular/core';
import {NavController, reorderArray} from 'ionic-angular';
import _ from 'lodash';

import {AddNamePage} from "../AddName/AddName";
import {AppStorage} from "../../providers/AppStorage";
import {NameViewPage} from "../NameView/NameView";

@Component({
  selector: 'page-names',
  templateUrl: 'Names.html'
})
export class NamesPage {

  profiles = [];
  edit = false;

  constructor(public nav: NavController, private storage: AppStorage) {}

  ionViewWillEnter() {
    this.storage.get('names').then((result: any) => {
      if(Array.isArray(result) && !_.isEqual(this.profiles.sort(), result.sort())) {
        this.profiles = result;
      }
    });
  }

  addNamesPage() {
    this.nav.push(AddNamePage);
  }

  nameViewPage(profile) {
    this.nav.push(NameViewPage, {profile: profile})
  }

  editNames(bool) {
    this.edit = bool;
  }

  reorderNames(indexes) {
    this.profiles = reorderArray(this.profiles, indexes);
    this.storage.set('names', this.profiles);
  }

}
