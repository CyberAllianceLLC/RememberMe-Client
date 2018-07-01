import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";
import {EndpointServiceProvider} from "../../providers/endpoint-service/endpoint-service";

@Component({
  selector: 'page-add-content',
  templateUrl: 'add-content.html',
})
export class AddContentPage {

  contentForm: FormGroup;
  type: string;
  picture = '';
  isLoading: boolean = false;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private localStorage: LocalStorageProvider,
              private formBuilder: FormBuilder,
              private notifications: NotificationServiceProvider,
              private endpoints: EndpointServiceProvider) {
    this.type = this.navParams.get('type');
    this.contentForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]]
    });
  }

  getPicture() {
    return (this.picture !== '' ? this.picture :
      (this.type === 'name' ? '../assets/imgs/profile_pic.png' : '../assets/imgs/note_pic.png'));
  }

  setPicture() {
    console.log('setting picture...');
  }

  saveContent() {
    this.isLoading = true;
    this.endpoints.newContent([{
      type: this.type,
      title: this.contentForm.value['title'],
      description: this.contentForm.value['description'],
      picture: this.picture
    }]).then((data: any) => {
      // successfully added content
      this.isLoading = false;
      this.notifications.sendNotification({
        message: `Successfully added ${this.type}.`
      });
      this.navCtrl.pop();
    }).catch((error: any) => {
      // unable to add content
      this.isLoading = false;
      this.notifications.sendNotification({
        message: `Error: ${error}`
      });
    });
  }
}
