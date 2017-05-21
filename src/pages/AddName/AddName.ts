/**
 * Created by smith on 5/14/2017.
 */
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppStorage} from "../../providers/AppStorage";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ImageViewPage} from "../ImageView/ImageView";

@Component({
  selector: 'page-add-names',
  templateUrl: 'AddName.html'
})
export class AddNamePage {

  private profile : FormGroup;
  image = "assets/misc/phone_maps.png";

  constructor(public navCtrl: NavController, private storage: AppStorage, private formBuilder: FormBuilder) {
    this.profile = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  imageViewPage() {
    let profile = this.profile.value;
    profile.src = this.image;
    this.navCtrl.push(ImageViewPage, {profile: profile});
  }

  addName() {
    this.storage.get('names').then((result: any) => {
    	if(Array.isArray(result)) {
    	  let profile = this.profile.value;
    	  profile.src = this.image;
    	  result.unshift(profile);
        this.storage.set('names', result).then(() => {
          this.goBack();
        });
      }
      else {
        let profile = this.profile.value;
        profile.src = this.image;
        this.storage.set('names', [profile]).then(() => {
          this.goBack();
        });
      }
    });
  }

}
