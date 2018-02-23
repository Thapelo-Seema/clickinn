import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

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
  constructor() { }

  ngOnInit() {
  }

}
