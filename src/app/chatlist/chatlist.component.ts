import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewChecked} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ChatService} from '../chat.service';
import {UserService} from '../user.service';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit, OnDestroy, AfterViewChecked{
  
  @ViewChild('scroller') private feedContainer: ElementRef;
  @ViewChild('scroller2') private feedContainer2: ElementRef;
  message: string;
  chatList: any;
  contacts: any;
  currentContact: string = '';
  isOwn: boolean;
  showSpinner: boolean = true;
  show = false;
  noContacts: boolean = true;
  currentThread: string = '';
  

  show_chat: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private chat_svc: ChatService,
   private user_svc: UserService, private dialog: MatDialog, private db: AngularFireDatabase){
   }

  getUserNameById(id: string):any{
    var name: any;
     this.user_svc.getUserById(id).subscribe(val =>{
       name = val
     })
     return name;
  }

  isOwnMsg(id: string): boolean{
    if(id == this.user_svc.getCurrentLogged().uid) return true;
    return false
  }

  ngOnInit() {
    this.chat_svc.getContacts().then(ids =>{
      if(ids.length >= 0){
        this.noContacts = false;
      }else{
        this.noContacts = true;
        this.showSpinner = false;
        return;
      }
      //console.log('Contacts: ', ids)
      this.db.list('/users').subscribe(peeps =>{
        this.contacts =
        peeps.filter(peep => ids.indexOf(peep.uid) != -1);
        this.showSpinner = false;
        //console.log('The filtered contacts are: ', this.contacts);
      })
    }).catch(error =>{
      console.log(error);
    })
  }

  ngOnDestroy(){
  }

  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  scrollToBottom(){
    if(this.feedContainer != undefined) this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
    if(this.feedContainer2 != undefined) this.feedContainer2.nativeElement.scrollTop = this.feedContainer2.nativeElement.scrollHeight;   
  }

  getMessages(user_id: string){
    this.chat_svc.getThreadID(user_id).then(thread_id =>{
        this.currentThread = thread_id;
        this.chatList = this.chat_svc.getMessages(thread_id);
    }).then(() =>{
      this.updateSeen(this.currentThread)
    })
  }

  send(){
    this.chat_svc.sendMessage(this.message, this.currentContact, ' ');
    this.message = '';
  }

  updateCurrentContact(uid: string){
    this.currentContact = uid;
  }

  handleSubmit(event){
    if(event.keyCode === 13){
      this.send();
    }
  }

  updateSeen(thread_id: string){
    this.chat_svc.getUnseenMessages(thread_id).subscribe(msg_objects =>{
      if(msg_objects.length != undefined && msg_objects.length > 0){
        msg_objects.forEach(msg =>{
          if(!this.isOwnMsg(msg.by.id)) this.chat_svc.setMessageToSeen(thread_id, msg.$key);
        })
      }
   
    })
  }

}
