import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {AddContentPage} from './add-content';

@NgModule({
  declarations: [
    AddContentPage,
  ],
  imports: [
    IonicPageModule.forChild(AddContentPage),
  ],
})
export class AddNamePageModule {}
