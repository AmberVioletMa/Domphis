import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AddDevicePage } from '../pages/add-device/add-device'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {MQTTService} from '../services/MQTT.service';
import {SQLiteService} from '../services/SQLite.service';
import {SubjectService} from '../services/Subjects.service';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from "@ionic-native/camera";
import { File } from '@ionic-native/file';

import { PopoverComponent } from '../components/popover/popover'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AddDevicePage,
    PopoverComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AddDevicePage,
    PopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MQTTService,
    SQLiteService,
    ImagePicker,
    Camera,
    File,
    SubjectService
  ]
})
export class AppModule {}
