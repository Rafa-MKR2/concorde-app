import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, Avatar } from 'ionic-angular';
import { ChatService } from '../../providers/chat-service';

import { ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database/database';


import { Camera, CameraOptions } from '@ionic-native/camera';



@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  public user = this.auth.auth;
  public avatar:string;
  public typeFormateImage = this.user.currentUser.photoURL;

  nome:string = this.user.currentUser.displayName;
  email: string = this.user.currentUser.email;
  tel: string = this.user.currentUser.phoneNumber;
  dataLastLogin: Date = new Date();

  constructor(public service : ChatService,
              public auth : AngularFireAuth,
              public db :AngularFireDatabase,
              private camera: Camera, 
              private loadingCtrl: LoadingController,
              private tost: ToastController,
              public actionSheetCtrl: ActionSheetController,
              public navCtrl: NavController){
                
  }
 

  
  presentActionSheet(){
   return  this.actionSheetCtrl.create({
      title: 'Selecione sua foto',
      buttons: [
        {
          text: 'Tirar Foto',
          icon:'camera',
          handler: () => this.takePhoto()
        
        },{
          text: 'Carregar Foto',
          icon:'folder-open',
          handler: () =>  this.getImage()          
          
        },{
          text: 'Remover Foto',
          icon:'close',
          handler: () => this.changePhoto('https://firebasestorage.googleapis.com/v0/b/portifolio-rafa.appspot.com/o/perfil-Photos%2Fuser.jpeg?alt=media&token=6b12ca28-0c26-4427-b61e-6c372cd73f36')

        }
      ]
    }).present();
  }


  

 
changePhoto(foto:string){
  
  this.db.object('usuarios/' + this.user.currentUser.uid).update({ photo: foto})

  return this.auth.auth.currentUser.updateProfile({
    displayName: this.auth.auth.currentUser.displayName,
    photoURL:foto
    })
}

  takePhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit:true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.avatar =  imageData;
      this.typeFormateImage = 'data:image/jpeg;base64,'+this.avatar;

    }, (err) => {
      // Handle error
    });
  }

  getImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.avatar =  imageData;
      this.typeFormateImage = 'data:image/jpeg;base64,'+this.avatar;

    }, (err) => {
      // Handle error
    });
  }

  cropImage() { 
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit:true,
      targetWidth:300,
      targetHeight:300
    }

    this.camera.getPicture(options).then((imageData) => {
      this.avatar =  imageData;
      this.typeFormateImage = 'data:image/jpeg;base64,'+this.avatar;
    },() => {
      this.tost.create({message:'Não foi possível capturar imagem',duration:2300,position:'middle'})

    });
  }

  uploadImage(){

    if(!this.avatar) return;

    let byteCharacters =  atob(this.avatar)
    
    let  sliceSize =  512;
    let byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
  
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      let byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    let blob = new Blob(byteArrays, {type: 'image/jpeg'});
    let update = this.service.databaseFire().ref('perfil-Photos/'+this.user.currentUser.uid);

    update.put(blob).then(()=> { 
      this.tost.create({message:'Foto atualizada com sucesso!', duration:2300,position:'middle'}).present()
      update.getDownloadURL().then(image=>  this.changePhoto(image))

    })
   .catch(()=> this.tost.create({message:'Falha ao tenta atualizar foto!',duration:2300,position:'middle'}).present())
   }



}
