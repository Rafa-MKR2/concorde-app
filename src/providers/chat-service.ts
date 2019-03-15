import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireAction } from '@angular/fire/database';
import { GooglePlus } from '@ionic-native/google-plus';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';

import * as firebase from 'firebase';
import { DataSnapshot } from '@angular/fire/database/interfaces';


export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

 

export class Inbox{
  id:string;

}

export class Contatos {
  id: string;
  nome: string;
  email: string;
  status: string;
  photo: string;
  key: string;
}



export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}
 
@Injectable()
export class ChatService {



  constructor(private auth : AngularFireAuth, 
              public googlePlus: GooglePlus,
              public events : Events,
              private db : AngularFireDatabase) {

         
                }                                                                                                                                                                                                                                                                                                                 
  

  sendMsg(msg: ChatMessage):Promise<ChatMessage> {

    return new Promise(resolve => setTimeout(() => resolve(msg)))
  }


  getUserInfo(): Promise<UserInfo> {

    const userInfo: UserInfo = {
      id:this.auth.auth.currentUser.uid,
      name: this.auth.auth.currentUser.displayName,
      avatar: this.auth.auth.currentUser.photoURL
    };
    const error: UserInfo = {
      id:'',
      name: '',
      avatar: ''
    } 
    return new Promise((resolve, reject) => {
      resolve(userInfo)
      reject(error)
    });
  }


  login(email:string, pasword:string):Promise<AngularFireDatabase>{

    return this.auth.auth.signInWithEmailAndPassword(email,pasword)
    .then(()=> this.dbConnect())
  }


 dbConnect(): Promise<AngularFireDatabase>{
  
    return new Promise(resolve=> resolve(this.db.database.goOnline())) 
 }


 dbDisconnect(): Promise<AngularFireDatabase>{
  
  return new Promise(resolve=> resolve(this.db.database.goOffline())) 
}

  loginGoogle():Promise<void>{
   
    this.dbConnect()
  return  this.googlePlus.login({
      'webClient':'com.ionicframework.concorde12',
      'offline': true,
    }).then(res=>{
     return this.auth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res))
      .then((user:firebase.User)=>{
        return user.updateProfile({displayName:res.displayName,photoURL:res.photoURL})
      })
    })
  }

  singOutWithGoogle():Promise<void>{
    if(this.auth.auth.currentUser.providerData.length){
      for(let i =0; i<this.auth.auth.currentUser.providerData.length; i++){
        var provider = this.auth.auth.currentUser.providerData.length[i];

      if(!provider){
        return this.singOutWithFirebase()

      }else if(provider.providerId == firebase.auth.GoogleAuthProvider.PROVIDER_ID){
          return this.googlePlus.disconnect()
          .then(()=> this.singOutWithFirebase())
        }
      }
    }
  
  }

 
  singOutWithFirebase():Promise<void>{
    this.events.unsubscribe('chat-service:received');
   
   return this.dbDisconnect()
    .then(()=>firebase.auth().signOut())
      
  }


  cadastroUser(email:string, pasword:string):Promise<firebase.auth.UserCredential>{
   return this.dbDisconnect().then(()=>
    this.auth.auth.createUserWithEmailAndPassword(email,pasword))
  }
  

  // função de teste de desenvolvimento
  save(PATH: string ,objeto: any) {
    if (objeto.key) {
      this.db.list(PATH)
        .update(objeto.key, objeto)
        .then(date => console.log(date))
        .catch(err => console.log(err));
    } else {
      this.db.list(PATH)
        .push(objeto)
        .then(err => err);
    }  
  }

  getAll(PATH:string):Observable<AngularFireAction<DataSnapshot>[]> {
    return this.db.list(PATH).snapshotChanges().pipe()
  }
 
  update(PATH:string, objeto:any ):Promise<AngularFireDatabase>{
        return this.db.database.ref(PATH).update(objeto)
  }
 

  get(PATH:string, key: string):firebase.database.Reference {
    return this.db.database.ref(PATH+'/'+key)
     
  }
 
  contatos():Observable<AngularFireAction<DataSnapshot>[]>{

    return this.getAll('usuarios').map(changes => {
      return changes.map(c=> ({ key: c.payload.key, ...c.payload.val()})
      );
    })
  }

  databaseFire():firebase.storage.Storage{
   return firebase.storage()
  }

} 
