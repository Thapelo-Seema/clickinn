import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  searches = [
    { 
      searchby: 'name',
      searchtime: '2 mins ago',
      searchDetails: '2 bedroom flat, nsfas accredited, between R3000 and R6000, near UJ Apk, in Melville'
    },
    { 
      searchby: 'name',
      searchtime: '2 mins ago',
      searchDetails: '2 bedroom flat, nsfas accredited, between R3000 and R6000, near UJ Apk, in Melville'
    },
    { 
      searchby: 'name',
      searchtime: '2 mins ago',
      searchDetails: '2 bedroom flat, nsfas accredited, between R3000 and R6000, near UJ Apk, in Melville'
    },
    { 
      searchby: 'name',
      searchtime: '2 mins ago',
      searchDetails: '2 bedroom flat, nsfas accredited, between R3000 and R6000, near UJ Apk, in Melville'
    },
    { 
      searchby: 'name',
      searchtime: '2 mins ago',
      searchDetails: '2 bedroom flat, nsfas accredited, between R3000 and R6000, near UJ Apk, in Melville'
    },
    { 
      searchby: 'name',
      searchtime: '2 mins ago',
      searchDetails: '2 bedroom flat, nsfas accredited, between R3000 and R6000, near UJ Apk, in Melville'
    }
    ];

    show_chat: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  showChat(){
    this.show_chat = !this.show_chat;
  }


}
