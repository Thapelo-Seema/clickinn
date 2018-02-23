import { Component, OnInit, OnDestroy } from '@angular/core';
import {AccommService} from '../accomm.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';
import {Property} from '../property';
import {Apartment} from '../apartment';
import {MatDialog, MatDialogRef} from '@angular/material';
import {StatusComponent} from '../status/status.component';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, OnDestroy {

	booking: any;	
	showSpinner: boolean = true;
  topic = '';
  apartment: any;
  property: any;
  booker: any;
  routeSubs: any;
  viewingSubs: any;
  apartSubs: any;
  userSubs: any;
  declined: boolean = false;
  constructor(private accom_svc: AccommService, private route: ActivatedRoute, private user_svc: UserService,
   private dialog: MatDialog, private chat_svc: ChatService) { }

  ngOnInit(){
  	this.routeSubs = this.route.params.subscribe(params =>{
  		this.viewingSubs = this.accom_svc.getViewing(params['booking_id']).subscribe(val =>{
  			this.booking = val;
        this.apartSubs = this.accom_svc.getHostApartment(val.apart_id).subscribe(apartment =>{
          this.apartment = apartment;
          this.property = apartment.property;
          this.userSubs = this.user_svc.getUserById(val.booker_id).subscribe(person =>{
            this.booker = person;
            this.topic = `Relating to your viewing request of the ${this.apartment.room_type} at ${this.property.location}, for R${this.apartment.price}.00`;
          })
        })
  			this.showSpinner = false;
  		})
  	})
  }

  ngOnDestroy(){
  }

 /* getUserNameById(id: string):any{
  var name: any;
   this.user_svc.getUserById(id).subscribe(val =>{
     name = val
   })
   return name;
}
*/

/*getProperty(prop_id: string): Property{
 var property: Property = null;
  this.accom_svc.getHostProperty(prop_id).subscribe(val =>{
   property = val;
 })
  return property;
}*/

/*getApartment(apart_id: string): Apartment{
 var apartment: Apartment = null;
  this.accom_svc.getHostApartment(apart_id).subscribe(val =>{
   apartment = val;
 })
  return apartment;
}*/

accept(){
  this.declined = false;
  this.showSpinner = true;
  this.accom_svc.acceptViewing(this.booking.$key).then(val =>{
    this.showSpinner = false;
    let dialogRef = this.dialog.open(StatusComponent, {
      data:{
        title: 'Viewing status',
        name: this.user_svc.getLoggedUser().displayName,
        message: 'you have accepted this viewing'
      }
    })
    this.chat_svc.sendMessage('Hi, I accept your booking, you can chat with me for more info', this.booking.booker_id, this.topic)
  })
}

decline(){
  this.declined = true;
  this.showSpinner = true;
  this.accom_svc.declineViewing(this.booking.$key).then(val =>{
    this.showSpinner = false;
    let dialogRef = this.dialog.open(StatusComponent, {
      data:{
        name: this.user_svc.getLoggedUser().displayName,
        message: 'you have declined this viewing'
      }
    })
    this.chat_svc.sendMessage('Hi, I cannot accept your booking, you can chat with me for more info', this.booking.booker_id, this.topic)
  })
}

}
