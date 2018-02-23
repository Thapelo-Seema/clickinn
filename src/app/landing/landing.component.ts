import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private user_svc: UserService, private router: Router) { 
  	//basically I dont want this page to load if the visitor is not a first time visitor...but I should provide the option for getting here
  	/*if(this.user_svc.authenticated) this.user_svc.proceed(this.user_svc.getLoggedUser()) 
  	else if(this.user_svc.getLoggedUser()) this.router.navigate(['/signin']);*/
  }

  ngOnInit(){ 
  }

}
