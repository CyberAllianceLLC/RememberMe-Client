/**
 * Created by smith on 5/15/2017.
 */
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-image-view',
  templateUrl: 'ImageView.html'
})
export class ImageViewPage {

  profile = {};
  constructor(public nav: NavController, private navParams: NavParams) {
    this.profile = navParams.get('profile');
  }

}
