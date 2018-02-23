import { Component, OnInit, OnChanges} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-host-dash',
  templateUrl: './host-dash.component.html',
  styleUrls: ['./host-dash.component.css']
})
export class HostDashComponent implements OnInit, OnChanges {
  
  activeLink = '';

  constructor(private router: Router, private user_svc: UserService) { 
    
  }

  ngOnInit() {   
     this.searchf();
  }

  ngOnChanges() {   
    //this.user_svc.currentUserObservable.subscribe(dat => dat ? this.goOn() : this.user_svc.proceed());
  }

  goOn(){

    switch (this.router.url) {
      case "/host_dash/search_feed":
        this.activeLink = 'search_feed'
        break;
      case "/host_dash/prop_upload":
        this.activeLink = 'prop_upload'
        break;
      case "/host_dash/bookings":
        this.activeLink = 'bookings'
        break;
      case "/host_dash/chat_list":
        this.activeLink = 'chat_list'
        break;
      default:
        this.activeLink = 'search_feed'
                break;
    }
   
  }

  searchf(){
      this.router.navigate(['host_dash/search_feed']);
  }

  addprop(){
      this.router.navigate(['host_dash/prop_upload']);
  }

  viewp(){
      this.router.navigate(['host_dash/property_list']);
  }

  chats(){
      this.router.navigate(['host_dash/chat_list']);
  }

  bookings(){
      this.router.navigate(['host_dash/bookings']);
  }

}
