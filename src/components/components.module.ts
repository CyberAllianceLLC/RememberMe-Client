import { NgModule } from '@angular/core';
import {EditContentComponent} from './edit-content/edit-content';
import {LoginModalComponent} from './login-modal/login-modal';
import {CreateAccountModalComponent} from './create-account-modal/create-account-modal';
@NgModule({
  declarations: [
    EditContentComponent,
    LoginModalComponent,
    CreateAccountModalComponent
  ],
	imports: [],
  exports: [
    EditContentComponent,
    LoginModalComponent,
    CreateAccountModalComponent
  ]
})
export class ComponentsModule {}
