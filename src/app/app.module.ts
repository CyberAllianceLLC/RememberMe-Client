/*Ionic & Angular Dependencies*/
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AutosizeModule } from 'ngx-autosize';

/*Pipes*/
import {PipesModule} from "../pipes/pipes.module";

/*Directives*/
import {NotificationDirective} from "../directives/notification/notification";
import {LocalStorageDirective} from "../directives/local-storage/local-storage";

/*Pages*/
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {NamesPage} from "../pages/names/names";
import {NotesPage} from "../pages/notes/notes";
import {AddNamePage} from "../pages/add-name/add-name";
import {AddNotePage} from "../pages/add-note/add-note";
import {NameProfilePage} from "../pages/name-profile/name-profile";
import {NoteProfilePage} from "../pages/note-profile/note-profile";
import {EditNameComponent} from "../components/edit-name/edit-name";
import {EditNoteComponent} from "../components/edit-note/edit-note";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NamesPage,
    NotesPage,
    AddNamePage,
    AddNotePage,
    NameProfilePage,
    NoteProfilePage,
    EditNameComponent,
    EditNoteComponent
  ],
  imports: [
    BrowserModule,
    PipesModule,
    AutosizeModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NamesPage,
    NotesPage,
    AddNamePage,
    AddNotePage,
    NameProfilePage,
    NoteProfilePage,
    EditNameComponent,
    EditNoteComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NotificationDirective,
    LocalStorageDirective,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
