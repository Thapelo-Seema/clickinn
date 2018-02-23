import { Component, OnInit, OnDestroy } from '@angular/core';
import {AccommService} from '../accomm.service';
import {UserService} from '../user.service';
import {Property} from '../property'
import {Apartment} from '../apartment';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';


@Component({
  selector: 'app-host-bookings',
  templateUrl: './host-bookings.component.html',
  styleUrls: ['./host-bookings.component.css']
})
export class HostBookingsComponent implements OnInit, OnDestroy {

viewings: any;
showSpinner: boolean = true;
cuser: any;

constructor(private accom_svc: AccommService, private user_svc: UserService, private dialog: MatDialog){

}

ngOnInit(){
  this.cuser = this.user_svc.getLoggedUser();
  this.accom_svc.getHostViewings(this.cuser.uid).subscribe(val =>{
    if(val == null || val == undefined){
        this.showSpinner = false;
        let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'No bookings',
            message: 'there are currently no bookings to show',
            name: this.cuser.displayName
          }
        })
      }
    this.viewings = val;
    this.showSpinner = false;
  });
}

ngOnDestroy(){
  
}

 getUserNameById(id: string):any{
  var name: any;
   this.user_svc.getUserById(id).subscribe(val =>{
     name = val
   })
   return name;
}

getProperty(prop_id: string): Property{
 var property: Property = null;
  this.accom_svc.getHostProperty(prop_id).subscribe(val =>{
   property = val;
 })
  return property;
}

getApartment(apart_id: string): Apartment{
 var apartment: Apartment = null;
  this.accom_svc.getHostApartment(apart_id).subscribe(val =>{
   apartment = val;
 })
  return apartment;
}

goBack(){
  this.accom_svc.goBack();
}

gotoBooking(booking_id: string){
  this.accom_svc.gotoBooking(booking_id);
}



}








