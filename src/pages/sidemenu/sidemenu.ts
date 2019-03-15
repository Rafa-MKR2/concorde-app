import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, App, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ChatService, UserInfo } from '../../providers/chat-service';
import { LoginPage } from '../login/login';
import { AboutPage } from '../about/about';
import { AngularFireAuth } from '@angular/fire/auth';
import { SugestoesPage } from '../sugestoes/sugestoes';
import { ConfiPage } from '../confi/confi';

/**
 * Generated class for the SidemenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sidemenu',
  templateUrl: 'sidemenu.html',
})



export class SidemenuPage {

  rootPage = HomePage;

   public user:UserInfo;
  

  constructor(public navCtrl: NavController,
              public service : ChatService,
              public loading : LoadingController,
              public modalCtrl: ModalController,
              public auth : AngularFireAuth,
              public app: App,
             ) {
             this.service.getUserInfo().then(user=> this.user = user)
  }

 
  presentProfileModal():void {
    let profileModal = this.modalCtrl.create(AboutPage.name);
    profileModal.present();
  }

  sugestoes():void{
     this.modalCtrl.create(SugestoesPage.name).present();
  }

  config():void{
     this.modalCtrl.create(ConfiPage.name).present();
  }

  singOut():void{
   let load = this.loading.create({spinner: 'crescent' })
       load.present()

      this.service.singOutWithGoogle().then(()=>{
      this.app.getRootNavs()[0].setRoot(LoginPage.name)
      load.dismiss()
    }).catch(()=> load.dismiss())
 
    
  }
}
