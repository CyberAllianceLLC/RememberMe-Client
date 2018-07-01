import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ContentProfilePage} from './content-profile';

@NgModule({
  declarations: [
    ContentProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ContentProfilePage),
  ],
})
export class NameProfilePageModule {}
