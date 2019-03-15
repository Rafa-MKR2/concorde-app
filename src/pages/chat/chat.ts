import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo, Inbox } from "../../providers/chat-service";

import 'rxjs/add/operator/do';
import * as firebase from 'firebase';
import { FirebaseDatabase } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  msgList: ChatMessage[] =[];
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;

  inbox: Inbox;
  digitando: Boolean =false;

  private db:FirebaseDatabase =  firebase.database();

  constructor(public navParams: NavParams,
              private auth : AngularFireAuth,
              private chatService: ChatService,
              private events: Events) {


       
    
 
    // informação do contato
    this.toUser = {
      id: navParams.get('toUserId'),
      name: navParams.get('toUserName'),
    avatar: navParams.get('toUserAvatar')
 
    };
    // informações do usuario
  
  this.user = {
      id:this.auth.auth.currentUser.uid,
      name: this.auth.auth.currentUser.displayName,
      avatar: this.auth.auth.currentUser.photoURL
    }

    this.db.ref('inbox/'+this.toUser.id+'-'+this.user.id).on('child_changed',snap => {
      console.log(snap.val())
      this.digitando = snap.val();
      if(this.content._scroll) this.content.scrollToBottom(0);

    })
  }

  toUserDigitando(e){
    if(e){  
      this.chatService.update('inbox/'+this.user.id+'-'+this.toUser.id,{ digitando:true})

    }else{
      this.chatService.update('inbox/'+this.user.id+'-'+this.toUser.id,{ digitando:false})
    }
    if(this.content._scroll) this.content.scrollToBottom(0);


  }

  ionViewWillLeave() {
    // unsubscribe
    this.editorMsg = '';
    if(this.content._scroll) this.content.scrollToBottom(0);
    this.events.unsubscribe('chat:received');
    this.chatService.update('inbox/'+this.user.id+'-'+this.toUser.id,{ digitando:false})

 
  }

  ionViewDidEnter() {
    this.getMsgList()
    this.scrollToBottom();
    this.content.scrollToBottom(0);
    this.chatService.update('inbox/'+this.user.id+'-'+this.toUser.id,{
      digitando:false
    })
  
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

 

  getMsgList(){
    const userId = this.user.id,
    toUserId = this.toUser.id;
    
       this.chatService.getAll('mensagens/').subscribe(lista => 
       lista.forEach(item=>{
       let obj:any = item.payload.val(),
        msg:ChatMessage = obj,
        target = this.getMsgIndexById(obj.time)

       if(target !== -1) return
       else
         if(msg.messageId===userId+toUserId ||
            msg.messageId===toUserId+userId){
              this.msgList.push(obj)

            }
       }))
   }
 

 


  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mensagem
    let newMsg: ChatMessage = {
      messageId:this.user.id+this.toUser.id,
      userId: this.user.id,
      userName: this.user.name,
      userAvatar: this.user.avatar,
      toUserId: this.toUser.id,
      time: Date.now(),
      message: this.editorMsg,
      status: 'pending'
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if(!this.showEmojiPicker) {
      this.focus();
    }

    this.chatService.sendMsg(newMsg)
    .then(() => {
        newMsg.status = 'success';
        this.chatService.save('mensagens/',newMsg)
        this.toUserDigitando('')
        this.getMsgList()
        this.scrollToBottom()

    })
  }


  pushNewMsg(msg: ChatMessage) {

    const userId = this.user.id,
      toUserId = this.toUser.id;
    // verifica ordem das mensagens
    if(msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);

    } else if(msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom()

  }

 

  scrollToBottom() {
      if (this.content.scrollToBottom) {
       return this.content.scrollToBottom();

      }

  }


 
  private focus(): void {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }  
  }

  private getMsgIndexById(target: string): number {
    return this.msgList.findIndex(e => e.time === target)
  }

  private setTextareaScroll(): void {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  
  public dateConvert(time: number): string{
    let date = new Date(time),
        hours = date.getHours()<10? '0'+date.getHours(): date.getHours(),
        minutes = date.getMinutes()<10? '0'+date.getMinutes():date.getMinutes();

    return  hours+':'+minutes;
  }
}
