import { Component, OnInit, OnDestroy } from '@angular/core';
import {AccommService} from '../accomm.service';
import { UserService} from '../user.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {Property} from '../property';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';

@Component({
  selector: 'app-propertylist',
  templateUrl: './propertylist.component.html',
  styleUrls: ['./propertylist.component.css']
})
export class PropertylistComponent implements OnInit, OnDestroy {

	properties: Property[];
	cuser : any;
  showSpinner: boolean = true;
  

  constructor(private accom_svc: AccommService, private user_svc: UserService, private dialog: MatDialog) { }

  ngOnInit() {
  	this.cuser = this.user_svc.getLoggedUser();
    this.accom_svc.getHostProperties(this.cuser.uid).subscribe(val =>{
      if(val == null || val == undefined){
        this.showSpinner = false;
        let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'No properties',
            message: 'there are currently no properties to show',
            name: this.cuser.displayName
          }
        })
      }
      this.properties = val;
      this.showSpinner = false;
    })
  }

  ngOnDestroy() {
  }

  addApartment(id: string){
    this.accom_svc.addApartment(id);
  }

  goBack(){
    this.accom_svc.goBack();
  }

  gotoPropertyApartments(prop_id: string){
    this.accom_svc.gotoPropertyApartments(prop_id);
  }

  gotoProperty(prop_id: string){
    this.accom_svc.gotoProperty(prop_id);
  }

}
