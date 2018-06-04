import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import _ from 'lodash';
import {AddNamePage} from "../add-name/add-name";
import {LocalStorageDirective} from "../../directives/local-storage/local-storage";

@Component({
  selector: 'page-names',
  templateUrl: 'names.html',
})
export class NamesPage {

  names: any[];

  constructor(private navCtrl: NavController,
              private localStorage: LocalStorageDirective) {
    this.localStorage.get('Names').then((result: any) => {
      this.names = (_.isArray(result) ? result : []);
    });
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  addName() {
    this.navCtrl.push(AddNamePage);
  }

  nameProfile(name) {
    console.log(name.first);
  }

}
