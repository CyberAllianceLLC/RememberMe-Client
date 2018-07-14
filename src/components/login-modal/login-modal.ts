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
  isLoading: boolean = false;

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
    this.isLoading = true;
    this.endpoints.loginUser(this.loginForm.value['email'], this.loginForm.value['password'])
    .then((data: any) => {
      // User Logged in
      this.isLoading = false;
      this.notifications.sendNotification({
        message: 'Logged in successfully!'
      });
      this.dismiss(data);
    }).catch((error: any) => {
      // User login failed
      this.isLoading = false;
      this.notifications.sendNotification({
        message: `Error: ${error}`
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
            this.isLoading = true;
            this.sendRecoveryEmail(data.email)
            .then(() => {
              // recovery email sent
              this.isLoading = false;
              this.notifications.sendNotification({
                message: `Successfully sent recovery email to: ${data.email}`
              });
            }).catch((error: any) => {
              // unable to send recovery email
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

  private sendRecoveryEmail(email: string): Promise<any> {
    // check if valid email address
    if (Email.isValid(email)) {
      // send recovery email to email address
      return this.endpoints.sendRecoveryEmail(email);
    } else {
      // Email is not valid
      return Promise.reject('Not a valid email address.');
    }
  }

  dismiss(data: any = {}) {
    // dismiss login form
    this.viewCtrl.dismiss(data);
  }
}
