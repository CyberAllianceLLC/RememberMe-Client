import {Component} from '@angular/core';
import { NavController } from "ionic-angular";
import _ from 'lodash';
import {ContentProfilePage} from "../content-profile/content-profile";
import {AddContentPage} from "../add-content/add-content";
import {EndpointServiceProvider} from "../../providers/endpoint-service/endpoint-service";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {

  notes: any[];
  isLoading: boolean = false;

  constructor(private navCtrl: NavController,
              private endpoints: EndpointServiceProvider,
              private notifications: NotificationServiceProvider) {
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.getContent().then((data: any) => {
      this.isLoading = false;
      this.notes = data;
    }).catch((error: any) => {
      this.isLoading = false;
      this.notifications.sendNotification({
        message: `Error: ${error}`
      });
    })
  }

  getContent() {
    return this.endpoints.getContentByType('note');
  }

  refreshContent(refresher: any) {
    this.getContent().then((data: any) => {
      this.notes = data;
      refresher.complete();
    }).catch((error: any) => {
      refresher.complete();
    });
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  addContent() {
    this.navCtrl.push(AddContentPage, {type: 'note'});
  }

  contentProfile(content: any) {
    this.navCtrl.push(ContentProfilePage, {
      content: content
    });
  }

}
