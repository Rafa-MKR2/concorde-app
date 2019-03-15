import { Component } from '@angular/core';
import { IonicPage, NavParams, App, Events } from 'ionic-angular';
import { ChatService,Contatos } from '../../providers/chat-service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database/database';
import { Chat } from '../chat/chat';
 

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  public  usuarios: Observable<any>;
  public  user = this.auth.auth.currentUser;
  userId: string; // current user uid

  constructor(public navParams: NavParams,
              public auth : AngularFireAuth,
              public db : AngularFireDatabase,
              public app : App,
              public events: Events,
              private service: ChatService) {

   this.listaContatos()
    this.usuarios.forEach(e=> e.map(indice=>{
      if(indice.id === this.user.uid) this.statusUpdate(indice.key);
    })) 

  } 

  ionViewWillLeave(){
  }


  listaContatos(){
  return  this.usuarios = this.service.getAll('usuarios').map(changes => {
    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  })
 }
 

 statusUpdate(id: string){
  this.userId =id;
  /// Subscribe to auth state in firebase
 return this.auth.authState
  .do(user => {
    if (user) {
      
       this.updateOnConnect()     
    }

  })
.pipe()
.subscribe();
 }

chat(contats: Contatos){
  this.app.getRootNav().push(Chat.name,
    {
      toUserId:contats.id, 
      toUserName:contats.nome,
      toUserAvatar: contats.photo
    
    })  
}


/// Helper to perform the update in Firebase
private updateStatus(status: string) {
if (!this.userId) return

this.db.object('usuarios/' + this.userId).update({ status: status })
this.updateOnDisconnect()

}
  

/// Updates status when connection to Firebase starts
 updateOnConnect() {
return this.db.object('.info/connected').valueChanges()
         .do(connected => {
             let status = connected ? 'online' : 'offline'
             this.updateStatus(status)
         })
         .subscribe()
} 


 /// Updates status when connection to Firebase ends
 private updateOnDisconnect() {
  firebase.database().ref().child('usuarios/'+this.userId)
          .onDisconnect()
          .update({status: 'offline'})
} 

}
