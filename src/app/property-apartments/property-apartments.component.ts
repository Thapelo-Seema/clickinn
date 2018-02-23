import { Component, OnInit, OnDestroy } from '@angular/core';
import {AccommService} from '../accomm.service';
import {Apartment} from '../apartment';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';

@Component({
  selector: 'app-property-apartments',
  templateUrl: './property-apartments.component.html',
  styleUrls: ['./property-apartments.component.css']
})
export class PropertyApartmentsComponent implements OnInit, OnDestroy {

	apartments: Apartment[]
  showSpinner: boolean = true;
  property: any;
  apartSubs: any;
  propSubs: any;

  constructor(private accom_svc: AccommService, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit() {

  	this.route.params.subscribe(params =>{
      this.propSubs = this.accom_svc.getHostProperty(params['prop_id']).subscribe(prop =>{
        this.property = prop;
      })
  		this.apartSubs = this.accom_svc.getPropertyApartments(params['prop_id']).subscribe(val =>{
        this.apartments = val;
        if(val == null || val == undefined){
          let dialogRef = this.dialog.open(StatusComponent,{
            data:{
              title: 'No apartments',
              message: 'there are currently no apartments to show',
              name: ''
            }
          })
          this.showSpinner = false;
      }
        this.showSpinner = false;
      })
  	})
  	
  }

  ngOnDestroy(){
  }

  gotoEditApartment(apart_id: string){
    this.accom_svc.gotoEditApartment(apart_id);
  }


  goBack(){
  	this.accom_svc.goBack();
  }


}
