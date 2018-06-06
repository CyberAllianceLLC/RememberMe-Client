import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NameProfilePage } from './name-profile';

@NgModule({
  declarations: [
    NameProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(NameProfilePage),
  ],
})
export class NameProfilePageModule {}
