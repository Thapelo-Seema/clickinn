import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  activeLink = 'apart_list';
  cuser: any;
  currentUrl: any;
  
  constructor(private router: Router, private user_svc: UserService) { 
    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    this.accom();
    this.cuser = this.user_svc.getLoggedUser();
  }

  goOn(){
    switch (this.router.url) {
      case "/home/apart_list":
        this.activeLink = 'apart_list'
        break;
      case "/home/chats":
        this.activeLink = 'chat_list'
        break;
      default:
        this.activeLink = 'chat_list'
        break;
    }
  }

  saveProfile(){
    this.user_svc.currentUser.updateEmail(this.cuser.email);
    this.user_svc.currentUser.updateProfile({
      displayName: this.cuser.displayName,
      photoURL: this.cuser.photoURL
    });
    this.user_svc.createUserRecord(this.cuser.uid, this.cuser);
  }

  accom(){
    this.router.navigate(['home/apart_list']);
  }

  chats(){
    this.router.navigate(['home/chat_list']);
  }

  noti(){
    this.router.navigate(['home/noti_list']);
  }

  supportUser(){
      this.router.navigate(['home/support']);
  }

  gotoUser(uid: string){
    this.router.navigate(['home/user', uid]);
  }
  
}
