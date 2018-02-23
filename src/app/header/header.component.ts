import { Component, OnInit, OnChanges } from '@angular/core';
import { UserService } from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  unlogged: boolean ;
  logged_t: boolean ;
  logged_l: boolean ;
  currentUser: any;

  constructor(private user_svc: UserService, private router: Router) {
    
   }

  ngOnInit(){
    this.user_svc.currentUserObservable.subscribe(dat =>{
      this.setUpHeader(dat);
    });
   // console.log("This is the user seen in the header: ", this.user_svc.getLoggedUser())
  }

  gotoHostUser(uid: string){
    this.router.navigate(['host_dash/user', uid]);
  }

  gotoUser(uid: string){
    this.router.navigate(['home/user', uid]);
  }

  setUpHeader(user: any){
    this.currentUser = this.user_svc.getLoggedUser();
    if(user == null || user == undefined){
      //console.log("No user logged in");
      this.logged_l = false;
      this.logged_t = false;
      this.unlogged = true;
    }
    else if(this.currentUser != null && this.currentUser.uid ){
      if(this.currentUser.is_host == true){
        //console.log("host user logged in");
        this.logged_l = true;
        this.logged_t = false;
        this.unlogged = false;
      }
      else{
        //console.log("Normal user logged in");
        this.logged_l = false;
        this.logged_t = true;
        this.unlogged = false;
      }
    }
  }

  login(){
    this.router.navigate(['/signin']);
  }

  gotoInvestors(){
    this.router.navigate(['/investors']);
  }

  gotoAbout(){
    this.router.navigate(['/about']);
  }

  gotoHelp(){
    this.router.navigate(['/help']);
  }

  signup(){
    this.router.navigate(['/signup']);
  }

  logout(){
    this.user_svc.logout();
  }

  searchf(){
      this.router.navigate(['host_dash/search_feed']);
  }

  supportHost(){
      this.router.navigate(['host_dash/support']);
  }

  supportUser(){
      this.router.navigate(['home/support']);
  }

  addprop(){
      this.router.navigate(['host_dash/prop_upload']);
  }

  viewp(){
      this.router.navigate(['host_dash/property_list']);
  }

  hostChats(){
      this.router.navigate(['host_dash/chat_list']);
  }

  bookings(){
      this.router.navigate(['host_dash/bookings']);
  }
  accom(){
    this.router.navigate(['home/apart_list']);
  }

  userChats(){
    this.router.navigate(['home/chat_list']);
  }
}
