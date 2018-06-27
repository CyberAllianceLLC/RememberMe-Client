import { NgModule } from '@angular/core';
import { EditNameComponent } from './edit-name/edit-name';
import { EditNoteComponent } from './edit-note/edit-note';
import {LoginModalComponent} from './login-modal/login-modal';
import {CreateAccountModalComponent} from './create-account-modal/create-account-modal';
@NgModule({
	declarations: [EditNameComponent,
    EditNoteComponent,
    LoginModalComponent,
    CreateAccountModalComponent],
	imports: [],
	exports: [EditNameComponent,
    EditNoteComponent,
    LoginModalComponent,
    CreateAccountModalComponent]
})
export class ComponentsModule {}
