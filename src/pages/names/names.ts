import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import _ from 'lodash';
import {AddContentPage} from "../add-content/add-content";
import {ContentProfilePage} from "../content-profile/content-profile";
import {EndpointServiceProvider} from "../../providers/endpoint-service/endpoint-service";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";

@Component({
  selector: 'page-names',
  templateUrl: 'names.html',
})
export class NamesPage {

  names: any[];
  isLoading: boolean = false;

  constructor(private navCtrl: NavController,
              private endpoints: EndpointServiceProvider,
              private notifications: NotificationServiceProvider) {
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.getContent().then((data: any) => {
      this.isLoading = false;
      this.names = data;
    }).catch((error: any) => {
      this.isLoading = false;
      this.notifications.sendNotification({
        message: `Error: ${error}`
      });
    });
  }

  getContent() {
    return this.endpoints.getContentByType('name');
  }

  refreshContent(refresher: any) {
    this.getContent().then((data: any) => {
      this.names = data;
      refresher.complete();
    }).catch((error: any) => {
      refresher.complete();
    });
  }

  getFirstLetter(value) {
    return _.toLower(_.head(value));
  }

  addName() {
    this.navCtrl.push(AddContentPage, {type: 'name'});
  }

  contentProfile(content: any) {
    this.navCtrl.push(ContentProfilePage, {
      content: content
    });
  }

}
