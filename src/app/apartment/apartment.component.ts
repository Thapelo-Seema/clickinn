import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {PropertyComponent} from '../property/property.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ShareComponent} from '../share/share.component';
import {Image} from '../image';
import {Property} from '../property';
import {Apartment} from '../apartment';
import {AccommService} from '../accomm.service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserBookingComponent} from '../user-booking/user-booking.component';
import {ChatService} from '../chat.service';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})
export class ApartmentComponent  implements OnInit, OnDestroy {
  apartment: Apartment = {
    room_type: '',
    price:  0,
    deposit: 0,
    dP: {
          url: 'https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?alt=media&token=d865595d-187a-49f9-b682-14a8faeffdd2',
          name: 'clickinn logo',
          progress: 100,
          path: 'path'
         },
    images: [],
    description: '',
    prop_id: '',
    apart_id: '',
    timeStamp:  0,
    available: true,
    occupiedBy: 'none',
    property: null
  }
  showSpinner: boolean = true;
  images: any;
  propertyImages: any;
  apartSubs: any;
  routeSubs: any;
  imageSubs: any;
  pimageSubs: any;

  constructor(public dialog: MatDialog, private accom_svc: AccommService, private route: ActivatedRoute){
                
  }

  ngOnInit() {
    this.routeSubs = this.route.params.subscribe(params => {
      this.apartSubs = this.accom_svc.getHostApartment(params['apart_id']).subscribe(apt => {
        this.imageSubs = this.accom_svc.getApartImages(apt.apart_id).subscribe(images =>{
          this.pimageSubs = this.accom_svc.getPropertyImages(apt.prop_id).subscribe(pimages =>{
          this.images = images.concat(pimages);
        })
        })
        
        this.apartment = apt;
        this.showSpinner = false;
      })
    })
  }

  ngOnDestroy(){
  }

  goBack(){
    this.accom_svc.goBack();
  }

  booking(){
    let dialogRef = this.dialog.open(UserBookingComponent, {
      data:{
        apart_id: this.apartment.apart_id,
        prop_id: this.apartment.prop_id,
        host_id: this.apartment.property.user_id
      }
    });
  }

  launch(){
    let dialogRef = this.dialog.open(ShareComponent);
  }

  chat(){
    let dialogRef2 = this.dialog.open(EnquireComponent, {
      data: {
        apartment: this.apartment.room_type,
        address: this.apartment.property.street_address,
        price: this.apartment.price,
        uid: this.apartment.property.user_id
      }
    });
  }
}

@Component({
  selector: 'enquire',
  template: `
    <div class="container-fluid"  style="text-align: center; padding: 0px">
      <h2 mat-dialog-title>Start chat with this landlord<hr></h2>
      <mat-dialog-content>
        <div class="input-group" style="width:100%">
          <textarea rows="8" class="form-control" style="z-index:0; width: 100%" 
          placeholder="Type here..." [(ngModel)]="response" name="response">
          </textarea>
        </div>
        <a mat-raised-button color="primary" (click)="sendTo(data.uid); close()" style="margin-top: 10px">
          <i class="material-icons">send</i>
        </a> 
      </mat-dialog-content>
    </div>
  `,
  styleUrls: ['./apartment.component.css']
})

export class EnquireComponent{

  response = '';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef2: MatDialogRef<EnquireComponent>, 
    private chat_svc: ChatService){}

  close(){
    this.dialogRef2.close()
  }

  updateMessage(event){
    this.response = event.target.value;
  }

  getTopic(): string{
    return `Relating to the ${this.data.apartment} (for R${this.data.price}.00) , at ${this.data.address}`
  }

  sendTo(uid: string){
    this.chat_svc.sendMessage(this.response, uid, this.getTopic());
  }
}



