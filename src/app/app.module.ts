import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';

import { MyApp } from './app.component';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { EmojiProvider } from '../providers/emoji';
import { HttpClientModule } from "@angular/common/http";


import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {GooglePlus } from '@ionic-native/google-plus';

import { ChatService } from '../providers/chat-service';

import {IonicStorageModule} from '@ionic/storage'; 
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';

import { File } from '@ionic-native/file';


const config = {
  apiKey: "AIzaSyCxb4lfrpY3NnhZzzUakDMREUt5rBlGuyo",
  authDomain: "portifolio-rafa.firebaseapp.com",
  databaseURL: "https://portifolio-rafa.firebaseio.com",
  projectId: "portifolio-rafa",
  storageBucket: "portifolio-rafa.appspot.com",
  messagingSenderId: "54950511803"
};
 
 

   
@NgModule({ 
  declarations: [
    MyApp,  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:true,
      tabsLayout:'icon-left',
      preloadModules: true
    }),
    IonicStorageModule.forRoot({
      name:'concorde',
      storeName: 'usuario',
      driverOrder: ['indexeddb']

    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen, Camera, FileTransfer, File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    ChatService,
    EmojiProvider,
    NativeRingtones
  ]
})
export class AppModule {}
