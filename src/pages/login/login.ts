import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { ChatService } from '../../providers/chat-service';
import { TabsPage } from '../tabs/tabs';
import { CadastroPage } from '../cadastro/cadastro';
import { validation } from '../../providers/valiadation';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

 private email : string = "rafaeldocarmo2010@gmail.com";
 private password: string = "123456";


  constructor(public navCtrl: NavController,
              public service : ChatService,
              public auth : AngularFireAuth,
              public db :AngularFireDatabase,
              public tost : ToastController,
              ) { }
  

 

  login():void{
    this.service.login(this.email,this.password).then(()=>{
     this.service.dbConnect().then(()=>
     this.navCtrl.setRoot(TabsPage.name)
     )
    })
    .catch(err=>{
      this.tost.create(validation.login(err)).present()
    })
  }
   
  singWithGoogle():void{
    this.service.loginGoogle()
    .then(()=>{
      this.service.dbConnect().then(()=>{
      this.db.object('usuarios/' + this.auth.auth.currentUser.uid).update({ 
        id:this.auth.auth.currentUser.uid,
        nome:this.auth.auth.currentUser.displayName,
        email: this.auth.auth.currentUser.email,
        photo: this.auth.auth.currentUser.photoURL,
        status: 'online'
 
      })}).then(()=> this.navCtrl.setRoot(TabsPage.name))
    })
    .catch(()=>
      this.tost.create({message: 'Error ao tentar efetuar login!',duration: 4000,position:'bottom'}).present())
  }

  cadastro(): void{
    this.navCtrl.push(CadastroPage.name)
  }

}
