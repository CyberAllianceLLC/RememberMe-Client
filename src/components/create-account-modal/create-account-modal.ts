import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationServiceProvider} from "../../providers/notification-service/notification-service";
import {ViewController} from "ionic-angular";
import {EndpointServiceProvider} from "../../providers/endpoint-service/endpoint-service";
import {PasswordValidation} from "../../providers/validators/password-validation";

@Component({
  selector: 'create-account-modal',
  templateUrl: 'create-account-modal.html'
})
export class CreateAccountModalComponent {

  createAccountForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private viewCtrl: ViewController,
              private endpoints: EndpointServiceProvider,
              private notifications: NotificationServiceProvider) {
    this.createAccountForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  createAccount() {
    this.endpoints.newUser(this.createAccountForm.value['email'], this.createAccountForm.value['password'])
    .then((data: any) => {
      this.notifications.sendNotification({
        message: `Created account. Please verify email: ${this.createAccountForm.value['email']}.`
      });
      this.dismiss(data);
    }).catch(() => {
      this.notifications.sendNotification({
        message: 'Error: Unable to create account.'
      });
    });
  }

  dismiss(data: any = {}) {
    // dismiss create account form
    this.viewCtrl.dismiss(data);
  }

}
