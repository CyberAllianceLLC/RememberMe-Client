import { Component } from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";
import {EndpointServiceProvider} from "../../providers/endpoint-service/endpoint-service";
import _ from 'lodash';

@Component({
  selector: 'edit-content',
  templateUrl: 'edit-content.html'
})
export class EditContentComponent {

  contentForm: FormGroup;
  content: any;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private endpoints: EndpointServiceProvider,
              private notifications: NotificationServiceProvider) {
    this.content = this.navParams.get('content');
    this.contentForm = this.formBuilder.group({
      title: [this.content.title, [Validators.required, Validators.maxLength(100)]],
      description: [this.content.description, [Validators.maxLength(1000)]]
    });
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }

  saveContent() {
    this.endpoints.updateContent(this.content.content_id, this.content.type, this.contentForm.value['title'],
      this.contentForm.value['description'], this.content.picture).then((data: any) => {
      this.notifications.sendNotification({
        message: data
      });
      this.viewCtrl.dismiss(true);
    }).catch((error: any) => {
      this.notifications.sendNotification({
        message: `Error: ${error}`
      });
    });
  }

  getPicture() {
    return (this.content.picture !== '' ? this.content.picture :
      (this.content.type === 'name' ? '../assets/imgs/profile_pic.png' : '../assets/imgs/note_pic.png'));
  }

  setPicture() {
    //TODO: set picture
  }
}
