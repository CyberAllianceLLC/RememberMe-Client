import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoteProfilePage } from './note-profile';

@NgModule({
  declarations: [
    NoteProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(NoteProfilePage),
  ],
})
export class NoteProfilePageModule {}
