import { Component } from '@angular/core';
import {AlertController, MenuController, ModalController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ToastController} from 'ionic-angular';
import _ from 'lodash';

import { HomePage } from '../pages/home/home';
import {LoginModalComponent} from "../components/login-modal/login-modal";
import {EndpointServiceProvider} from "../providers/endpoint-service/endpoint-service";
import {NotificationServiceProvider} from "../providers/notification-service/notification-service";
import {CreateAccountModalComponent} from "../components/create-account-modal/create-account-modal";
import {LocalStorageProvider} from "../providers/local-storage/local-storage";
import {Email} from "../providers/validators/email";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  notification: any;
  isLoading = false;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private toastCtrl: ToastController,
              private menuCtrl: MenuController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private notifications: NotificationServiceProvider,
              public endpoints: EndpointServiceProvider,
              private localStorage: LocalStorageProvider) {
    platform.ready().then(() => {
      // App is ready
      statusBar.styleDefault();
      splashScreen.hide();
      // Subscribe to notification service
      this.notification = this.notifications.getNotification().subscribe((body: any) => this.displayNotification(body));
      // Check if user is logged in and auth tokens are not expired
      this.endpoints.checkAuthExpire().then(() => {
        // user logged in
        this.endpoints.setLoginStatus(true);
      }).catch((error: any) => {
        // user not logged in
        this.endpoints.setLoginStatus(false);
      });
    });
  }

  ionViewWillUnload() {
    if (this.notification) {
      this.notification.unsubscribe();
    }
  }

  displayNotification(body: any) {
    this.toastCtrl.create({
      message: body.message,
      duration: body.duration || 3000,
      position: body.position || 'bottom'
    }).present();
  }

  loginUser() {
    // Open login component
    let loginModal = this.modalCtrl.create(LoginModalComponent);
    loginModal.onDidDismiss((data: any) => {
      //check if user logged in
      if ('user_id' in data) {
        this.localStorage.get('Content').then((content: any) => {
          // get only content that has not been added to user account
          return this.endpoints.newContent(_.filter(content, ['user_id', '']));
        }).then(() => {
          // remove all content when user is logged in
          return this.endpoints.removeAllLocalContent();
        });
      }
    });
    loginModal.present();
    this.menuCtrl.close();
  }

  createAccount() {
    // Open create account component
    let createAccountModal = this.modalCtrl.create(CreateAccountModalComponent);
    createAccountModal.onDidDismiss((data: any) => {
      // Modal dismissed. Do nothing
    });
    createAccountModal.present();
    this.menuCtrl.close();
  }

  updateEmail() {
    // update user email
    let alert = this.alertCtrl.create({
      title: 'Update Email',
      inputs: [
        {
          name: 'email',
          placeholder: 'Enter new email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: data => {
            // send verification email to new email
            this.isLoading = true;
            this.verifyNewEmail(data.email)
            .then(() => {
              // verification email sent
              this.isLoading = false;
              this.notifications.sendNotification({
                message: `Email verification sent to: ${data.email}`
              });
            }).catch((error: any) => {
              // unable to send verification email
              this.isLoading = false;
              this.notifications.sendNotification({
                message: `Error: ${error}`
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword() {
    // update user email
    let alert = this.alertCtrl.create({
      title: 'New Password',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Enter old password'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Enter new password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: data => {
            // check if new password meets min length requirements
            if (data.newPassword.length > 6) {
              // update user password
              this.isLoading = true;
              this.endpoints.newPassword(data.password, data.newPassword)
              .then(() => {
                // password has been updated successfully
                this.isLoading = false;
                this.notifications.sendNotification({
                  message: `Successfully updated password.`
                });
              }).catch((error: any) => {
                // unable to send verification email
                this.isLoading = false;
                this.notifications.sendNotification({
                  message: `Error: ${error}`
                });
              });
            } else {
              // new password is not long enough
              this.notifications.sendNotification({
                message: `Error: New password is not long enough.`
              });
            }
          }
        }
      ]
    });
    alert.present();
  }

  logoutUser() {
    //logout user
    this.endpoints.logoutUser().then(() => {
      this.displayNotification({
        message: 'Successfully logged out.'
      });
    }).catch((error: string) => {
      this.displayNotification({
        message: `Error: ${error}`
      });
    });
  }

  private verifyNewEmail(email: string) {
    // check if valid email address
    if (Email.isValid(email)) {
      // send recovery email to email address
      return this.endpoints.newEmail(email);
    } else {
      // Email is not valid
      return Promise.reject('Not a valid email address.');
    }
  }
}

