import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AlertController, ViewController} from "ionic-angular";
import {Email} from "../../providers/validators/email";
import {EndpointServiceProvider} from "../../providers/endpoint-service/endpoint-service";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";

@Component({
  selector: 'login-modal',
  templateUrl: 'login-modal.html'
})
export class LoginModalComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private endpoints: EndpointServiceProvider,
              private notifications: NotificationServiceProvider) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loginUser() {
    // login user
    this.endpoints.loginUser(this.loginForm.value['email'], this.loginForm.value['password'])
    .then((data: any) => {
      // User Logged in
      this.notifications.sendNotification({
        message: 'Logged in successfully!'
      });
      this.dismiss(data);
    }).catch((error: any) => {
      // User login failed
      this.notifications.sendNotification({
        message: 'Error: Unable to log in.'
      });
    });
  }

  forgotPassword() {
    // user forgot password
    let alert = this.alertCtrl.create({
      title: 'Forgot Password',
      inputs: [
        {
          name: 'email',
          placeholder: 'Enter recovery email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: data => {
            // send recovery email
            this.sendRecoveryEmail(data.email);
          }
        }
      ]
    });
    alert.present();
  }

  sendRecoveryEmail(email: string) {
    // check if valid email address
    if (Email.isValid(email)) {
      // send recovery email to email address
      this.endpoints.sendRecoveryEmail(email).then((data: any) => {
        this.notifications.sendNotification({
          message: `Successfully sent recovery email to: ${email}`
        });
      }).catch((error: any) => {
        this.notifications.sendNotification({
          message: 'Error: Unable to send recovery email.'
        });
      });
    } else {
      this.notifications.sendNotification({
        message: 'Error: Not a valid email address.'
      });
    }
  }

  dismiss(data: any = {}) {
    // dismiss login form
    this.viewCtrl.dismiss(data);
  }
}
