import { Component } from '@angular/core';
import {MenuController, ModalController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ToastController} from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import {LoginModalComponent} from "../components/login-modal/login-modal";
import {EndpointServiceProvider} from "../providers/endpoint-service/endpoint-service";
import {NotificationServiceProvider} from "../providers/notification-service/notification-service";
import {CreateAccountModalComponent} from "../components/create-account-modal/create-account-modal";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  notification: any;
  loggedInStatus: any;
  loggedIn: boolean;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private toastCtrl: ToastController,
              private menuCtrl: MenuController,
              private modalCtrl: ModalController,
              private notifications: NotificationServiceProvider,
              private endpoints: EndpointServiceProvider) {
    platform.ready().then(() => {
      // App is ready
      statusBar.styleDefault();
      splashScreen.hide();
      // Subscribe to notification service
      this.notification = this.notifications.getNotification().subscribe((body: any) => this.displayNotification(body));
      // Check if user is logged in
      this.loggedInStatus = this.endpoints.getLoginStatus().subscribe((status: boolean) => this.updateLoginStatus(status));
    });
  }

  ionViewWillUnload() {
    if (this.notification) {
      this.notification.unsubscribe();
    }
    if (this.loggedInStatus) {
      this.loggedInStatus.unsubscribe();
    }
  }

  displayNotification(body: any) {
    this.toastCtrl.create({
      message: body.message,
      duration: body.duration || 3000,
      position: body.position || 'bottom'
    }).present();
  }

  updateLoginStatus(status: boolean) {
    this.loggedIn = status;
  }

  loginUser() {
    // Open login component
    let loginModal = this.modalCtrl.create(LoginModalComponent);
    loginModal.onDidDismiss(() => {
      // Modal dismissed
    });
    loginModal.present();
    this.menuCtrl.close();
  }

  createAccount() {
    // Open create account component
    let createAccountModal = this.modalCtrl.create(CreateAccountModalComponent);
    createAccountModal.onDidDismiss((data: any) => {
      // Modal dismissed
      console.log(data);
    });
    createAccountModal.present();
    this.menuCtrl.close();
  }

  logoutUser() {
    //logout user
    this.endpoints.logoutUser().then(() => {
      this.displayNotification({
        message: 'Successfully logged out.'
      });
    });
  }
}

