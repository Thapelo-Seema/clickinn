import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import {UserService} from '../user.service';
import {AccommService} from '../accomm.service';
import {StatusComponent} from '../status/status.component';

@Component({
  selector: 'app-user-booking',
  templateUrl: './user-booking.component.html',
  styleUrls: ['./user-booking.component.css']
})
export class UserBookingComponent implements OnInit {
  booking = {
    date: '',
    time: '',
    timeStamp: 0,
    booker_id: 'none',
    prop_id: '',
    apart_id: '',
    host_id: ''
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UserBookingComponent>,
   private  user_svc: UserService, private accom_svc: AccommService, private dialog: MatDialog){
  }

  ngOnInit() {
    this.booking.booker_id = this.user_svc.getLoggedUser().uid;
    this.booking.prop_id = this.data.prop_id;
    this.booking.apart_id = this.data.apart_id;
    this.booking.host_id = this.data.host_id;
  }

  placeBooking(){
    if(confirm("Are you sure you want to place a booking(viewing) for this place ?")){
      this.booking.timeStamp = this.accom_svc.getTimeStamp();
      this.accom_svc.bookViewing(this.booking).then(viewing =>{
        let statusDialog = this.dialog.open(StatusComponent,{
          data:{
            title: 'Booking success',
            message: 'you have successfully booked to see this place, you will be notified if the landlord confirms the viewing',
            name: this.user_svc.getLoggedUser().displayName
          }
        })
      },
      (error) =>{
          let statusDialog = this.dialog.open(StatusComponent,{
          data:{
            title: 'Booking failed',
            message: 'for some reason your booking could not go through, please resubmitting or contact support if this issue persists' ,
            name: this.user_svc.getLoggedUser().displayName
          }
        })
      });
    } 
  }

  onChange(event){
    //console.log(event);
    this.booking.date = event.target.value.toDateString();
  }

  close(){
    this.dialogRef.close();
  }

}
