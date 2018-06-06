import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {NotificationDirective} from "../directives/notification/notification";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  notification: any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              notificationService: NotificationDirective) {
    platform.ready().then(() => {
      // App is ready
      statusBar.styleDefault();
      splashScreen.hide();
      // Subscribe to notification service
      this.notification = notificationService.getNotification().subscribe((body: any) => this.displayNotification(body));
    });
  }

  ionViewWillUnload() {
    if(this.notification) {
      this.notification.unsubscribe();
    }
  }

  displayNotification(body: any) {
    console.log(body);
  }
}

