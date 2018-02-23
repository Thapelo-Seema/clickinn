import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
	user ={
		uid: 'uid',
		email: 'email',
		displayName: 'name',
		is_host: false,
		phoneNumber: 'number',
		occupation: 'occupation',
		photoUrl: '',
		fcm_token: ''
	}
	editMode: boolean = false;
	showSpinner = true;
	
	constructor(private route: ActivatedRoute, private user_svc: UserService, private dialog: MatDialog, 
		private router: Router){
	}

	ngOnInit(){
		this.route.params.subscribe(params =>{
			this.user_svc.getUserById(params['uid']).subscribe(user =>{
				this.user.uid = user.uid;
				this.user.email = user.email;
				this.user.displayName = user.displayName;
				this.user.is_host = user.is_host;
				this.user.phoneNumber = user.phoneNumber;
				this.user.fcm_token = user.fcm_token;
				this.user.photoUrl = user.photoUrl;
				if(this.user.photoUrl == null || this.user.photoUrl == undefined){
					this.user.photoUrl = 'https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?alt=media&token=d865595d-187a-49f9-b682-14a8faeffdd2';
				}
				this.user.occupation = user.occupation;
				this.showSpinner = false;
			})
		})
	}

	ngOnDestroy(){
		
	}

	saveProfile(){
		if(confirm("Are you sure you want to save these changes ?")){
			this.showSpinner = true;
			console.log(this.user)
			this.user_svc.updateUserRecord(this.user).then(() => {
				this.showSpinner = false;
				if(this.user.is_host == true){
					this.router.navigate(['host_dash/search_feed']);
				}else{
					this.router.navigate(['home/apart_list']);
				}
				let dialogRef = this.dialog.open(StatusComponent,{
					data:{
						title: 'Profile status',
	        			name: this.user.displayName,
	        			message: 'your profile has been updated'
					}
				})
			},
			(error) =>{
				this.showSpinner = false;
				let dialogRef = this.dialog.open(StatusComponent,{
					data:{
						title: 'Profile status',
	        			name: this.user.displayName,
	        			message: 'your profile could not be updated, please try again or report to admin if this issue persists'
					}
				}
			)})
		}
		
	}

	toggleEdit(){
		this.editMode = !this.editMode;
	}

}
