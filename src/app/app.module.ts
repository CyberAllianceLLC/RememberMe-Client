import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import {NotesPage} from '../pages/Notes/Notes';
import {NamesPage} from '../pages/Names/Names';
import {TabsPage} from '../pages/tabs/tabs';
import {AddNotePage} from '../pages/AddNote/AddNote';
import {AddNamePage} from '../pages/AddName/AddName';

import {AutoResize} from '../directives/AutoResize';
import {AppStorage} from '../providers/AppStorage'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ImageViewPage} from "../pages/ImageView/ImageView";
import {NameViewPage} from "../pages/NameView/NameView";

@NgModule({
  declarations: [
    AutoResize,
    MyApp,
    NotesPage,
    AddNotePage,
    NamesPage,
    AddNamePage,
    TabsPage,
    ImageViewPage,
    NameViewPage
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      tabsHideOnSubPages: true,
      platforms: {
        ios: {
          tabsPlacement: 'bottom',
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NotesPage,
    AddNotePage,
    NamesPage,
    AddNamePage,
    TabsPage,
    ImageViewPage,
    NameViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
