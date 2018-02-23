import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ChatService} from '../chat.service';
import {UserService} from '../user.service';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy{

	@ViewChild('scroller') private feedContainer: ElementRef;
  message: string;
  chatList: any;
  support: any;
  isOwn: boolean;
  showSpinner: boolean = true;

  show_chat: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private chat_svc: ChatService,
   private user_svc: UserService, private dialog: MatDialog){
   }

  ngOnInit(){
    //Get all contants in the users thread_list and store their info in the contacts array
    this.chat_svc.getSupport().subscribe(supp =>{
      if(supp.thread_id != undefined && supp.thread_id != null){
        this.support = supp.thread_id;
        this.chatList = this.chat_svc.getMessages(supp.thread_id);
        this.showSpinner = false;
      }else{
        this.showSpinner = false;
      }  
    }) 
  }

  ngOnDestroy(){
  }

  getUserNameById(id: string):any{
    var name: any;
     this.user_svc.getUserById('wsJmxmZtBjMdD1WwOZb3MOIIWSP2').subscribe(val =>{
       name = val
     })
     return name;
  }

  isOwnMsg(id: string): boolean{
    if(id == this.user_svc.getCurrentLogged().uid) return true;
    return false
  }

  scrollToBottom(): void{
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
  }

  send(){
    this.chat_svc.sendMessage(this.message, 'wsJmxmZtBjMdD1WwOZb3MOIIWSP2', ' ');
    this.message = '';
    this.scrollToBottom();
  }

  handleSubmit(event){
    if(event.keyCode === 13){
      this.send();
      this.scrollToBottom();
    }
  }

}
