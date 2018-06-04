import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NamesPage } from './names';

@NgModule({
  declarations: [
    NamesPage,
  ],
  imports: [
    IonicPageModule.forChild(NamesPage),
  ],
})
export class NamesPageModule {}
