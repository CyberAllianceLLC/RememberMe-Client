/*Ionic & Angular Dependencies*/
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AutosizeModule } from 'ngx-autosize';

/*Pages*/
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {NamesPage} from "../pages/names/names";
import {NotesPage} from "../pages/notes/notes";
import {AddNamePage} from "../pages/add-name/add-name";
import {AddNotePage} from "../pages/add-note/add-note";

/*Pipes*/
import {PipesModule} from "../pipes/pipes.module";

/*Directives*/
import {NotificationDirective} from "../directives/notification/notification";
import {LocalStorageDirective} from "../directives/local-storage/local-storage";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NamesPage,
    NotesPage,
    AddNamePage,
    AddNotePage
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
    AddNotePage
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
