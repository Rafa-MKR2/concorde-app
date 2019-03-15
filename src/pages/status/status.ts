import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatService, UserInfo } from '../../providers/chat-service';

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  public userInfor:UserInfo;

  constructor(
    public navCtrl: NavController,
    private service : ChatService,
    public navParams: NavParams) {
      this.getUser()
  }

  

  getUser():  Promise<UserInfo> {
  
    return this.service.getUserInfo()
    .then(user => { return this.userInfor = user})
    .catch(()=>{
      const user: UserInfo={
        avatar: '',
        name: '',
        id: ''
        
      };
    return user  
    })     
  }


}
