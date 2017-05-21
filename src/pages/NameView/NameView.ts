/**
 * Created by smith on 5/14/2017.
 */
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ImageViewPage} from "../ImageView/ImageView";

@Component({
  selector: 'page-name-view',
  templateUrl: 'NameView.html'
})
export class NameViewPage {
  profile = {};

  constructor(public navCtrl: NavController, public params: NavParams) {
    this.profile = params.get('profile');
    console.log("Profile: ", this.profile);
  }

  imageViewPage() {
    this.navCtrl.push(ImageViewPage, {profile: this.profile});
  }

}
