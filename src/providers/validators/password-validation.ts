import {AbstractControl} from '@angular/forms';

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    // get value of password tag
    let password = AC.get('password').value;
    // get value of confirm password tag
    let confirmPassword = AC.get('confirmPassword').value;
    if (password !== confirmPassword) {
      AC.get('confirmPassword').setErrors({MatchPassword: true})
    } else {
      return null
    }
  }
}
