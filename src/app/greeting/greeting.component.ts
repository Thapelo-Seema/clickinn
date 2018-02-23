import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {StatusComponent} from '../status/status.component';
import {MatDialog} from '@angular/material'
import {MAT_DIALOG_DATA} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserService} from '../user.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {
  normal_user: boolean = false;
  is_host: boolean = false;
  name: string = '';
  constructor(private router: Router, private dialog: MatDialog, private afAuth: AngularFireAuth,
    private db: AngularFireDatabase, private user_svc: UserService) { }

  ngOnInit() {
  }

  isNormalUser(){
  	this.normal_user = true;
  	this.is_host = false;
  	if(this.name ==''){
  		let dialogRef = this.dialog.open(StatusComponent,{
  			data:{
  				name: '',
  				title: 'Name empty',
  				message: 'Please provide us with your name'
  			}
  		})
  		return 0;
  	}else{
      this.afAuth.auth.signInAnonymously().then(user =>{
        console.log('This is the new user: ', user);
        this.cacheUser(user.uid);
        this.router.navigate(['/home/apart_list'])})
      .catch(error =>{
        console.log(error);
      })
  	}
  }

  isHost(){
  	this.normal_user = false;
  	this.is_host = true;
  	if(this.name ==''){
  		let dialogRef = this.dialog.open(StatusComponent,{
  			data:{
  				name: '',
  				title: 'Name empty',
  				message: 'Please provide us with your name'
  			}
  		})
  		return 0;
  	}else{
  		this.cacheUser('');
  		this.router.navigate(['/signin']);
  	}
  }

  cacheUser(uid: string){
  	let user = {
  		normal_user: this.normal_user,
  		is_host: this.is_host,
  		displayName: this.name,
      uid: uid
  	}
  	localStorage.removeItem('clickinn_user');
  	localStorage.setItem('clickinn_user', JSON.stringify(user));
  }

}
