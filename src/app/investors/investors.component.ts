import { Component, OnInit } from '@angular/core';
import {SearchfeedService} from '../searchfeed.service';
import {StatusComponent} from '../status/status.component';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialog, MatDialogRef} from '@angular/material';
import {UserService} from '../user.service';
import {Enquiry} from '../enquiry';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.css']
})
export class InvestorsComponent implements OnInit {

  enquiry_type = ['Partnership', 'Investment'];

  enquiry: Enquiry = {
  	type: '',
  	description: '',
  	company_name: '',
  	person_name: '',
  	contact_number: '',
  	email: '',
  	timeStamp: 0
  }

  constructor(private searchfeed_svc: SearchfeedService, public dialog: MatDialog, private user_svc: UserService) { }

  ngOnInit() {
  	this.user_svc.anonymousSignin();
  }

  submitEnquiry(){
  	this.searchfeed_svc.businessQuery(this.enquiry).then(() =>{
  		let dialogRef = this.dialog.open(StatusComponent, {
  			data:{
  				title: 'Enquiry lodged!',
            	message: ' thank you, your enquiry has been lodged and we will get back to you once it has been reviewed',
            	name: this.enquiry.person_name
  			}
  		})
  	}).catch(error =>{
  		console.log(error)
  		let dialogRef = this.dialog.open(StatusComponent, {
  			data:{
  				title: 'Enquiry not lodged!',
            	message: ' the enquiry could not be lodged for some reason, please try submitting again or contact us directly on the number shown in the contact us section',
            	name: this.enquiry.person_name
  			}
  		})

  	})
  }

}
