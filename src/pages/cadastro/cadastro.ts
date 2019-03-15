import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatService } from '../../providers/chat-service';
import { TabsPage } from '../tabs/tabs';
import { validation } from '../../providers/valiadation';
import { AngularFireDatabase } from '@angular/fire/database';


/**
 * Generated class for the CadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
  
  private nome: string;
  private email: string;
  private password: string;

  constructor(private navCtrl: NavController, 
              private service : ChatService,
              public db :AngularFireDatabase,
              public alert: AlertController,
              private auth : AngularFireAuth) {

              }



cadastrar(){
  if(!this.nome || !this.email || !this.password) {
   this.alert.create(validation.cadastro(undefined)).present()
   return;
  }
    this.service.cadastroUser(this.email,this.password).then(()=>{
      this.auth.auth.currentUser.updateProfile({
        displayName:this.nome, 
        photoURL:'https://firebasestorage.googleapis.com/v0/b/portifolio-rafa.appspot.com/o/user.jpg?alt=media&token=38768c44-cacd-490c-8456-23aa81009f65'
      }).then(()=>{

        this.db.object('usuarios/' + this.auth.auth.currentUser.uid).update({ 
          id:this.auth.auth.currentUser.uid,
          nome: this.nome,
          email: this.auth.auth.currentUser.email,
          photo: 'https://firebasestorage.googleapis.com/v0/b/portifolio-rafa.appspot.com/o/user.jpg?alt=media&token=38768c44-cacd-490c-8456-23aa81009f65',
          status: 'online'
  
        })
        this.navCtrl.setRoot(TabsPage.name)
      })
  
    }).catch(error=>{
      this.alert.create(validation.cadastro(error)).present()

    })
  }

}
  