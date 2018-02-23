import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import {AccommService} from '../accomm.service';
import {UserService} from '../user.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ShareComponent} from '../share/share.component';
import {FormControl} from '@angular/forms';
import {_apartment_types} from '../../environments/environment';
import {SearchfeedService} from '../searchfeed.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {Apartment} from '../apartment';
import {Search} from '../search';
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-apartlist',
  templateUrl: './apartlist.component.html',
  styleUrls: ['./apartlist.component.css']
})

export class ApartlistComponent implements OnInit, OnDestroy{
  search_obj: Search ={
    location: '',
    nearby: '',
    minPrice: 0,
    maxPrice: 0,
    nsfas: false,
    apartment_type: 'Single Room',
    searcher_id: '',
    searcher_name: '',
    timeStamp: 0
  };
  //
  placeCtrl: FormControl;
  locCtrl: FormControl;
  editMode: boolean = false;
  formErr: string;
  homeResults: Apartment[] = null; //recently loaded apartments
  searchResults: FirebaseListObservable<Apartment[]>; //apartments returned after search
  submitted: boolean = false;
  open_search: boolean = false;
  cuser: any;
  search: boolean = false;
  showNearby: boolean = false;
  showApartments: boolean = false;
  showSpinner: boolean= true;
  apartment_types = _apartment_types;
  locations: any;
  nearbys: any;
  resultsStatus: '';
  

  constructor(private accom_svc: AccommService, private user_svc: UserService, 
    private router: Router, private route: ActivatedRoute, public dialog: MatDialog, 
    private searchfeed_svc: SearchfeedService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone){
	  this.placeCtrl = new FormControl();
    this.locCtrl = new FormControl();
  }

  ngOnInit(){
    this.cuser = this.user_svc.getLoggedUser();
    this.accom_svc.getRecentApartments().subscribe(val =>{
      this.homeResults = val;
      if(this.homeResults.length == 0 || this.homeResults.length == undefined || this.homeResults.length == null){
        let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'No apartments',
            message: 'there are currently no apartments to show.',
            name: this.cuser.displayName
          }
        })
        this.showSpinner = false;
      }
      this.showSpinner = false;
    });
    this.search_obj.searcher_id = this.cuser.uid;
    this.search_obj.searcher_name = this.cuser.displayName;
    this.placeCtrl.valueChanges.subscribe(val =>{
      if(val.length >= 1){
        this.getResults(val, 'es').then(nbys =>{
        this.nearbys = nbys
      })
      } 
    })
    this.locCtrl.valueChanges.subscribe(val =>{
      if(val.length >= 1){
        this.getResults(val, 're').then(locs =>{
        this.locations = locs
        })
      }
    })
  }

  ngOnDestroy(){ 
  }

 goBack(){
    this.accom_svc.goBack();
  }

  saveProfile(){
    if(confirm('Are you sure you want to save these changes ?')){
      this.showSpinner = true;
      this.user_svc.updateUserRecord(this.cuser).then(() => {
        let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Profile updated !',
            name: this.cuser.displayName,
            message: 'your profile has been updated'
          }
        })
        this.showSpinner = false;
      },
      (error) =>{
          let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Update failed !',
            name: this.cuser.displayName,
            message: 'your profile could not be updated, please try again and if this continues please contact, support.'
          }
        })
        this.showSpinner = false;
      })
    } 
  }

  toggleEdit(){
    this.editMode = !this.editMode;
  }

  toggleNearby(){
    this.showNearby = !this.showNearby;
  } 

  toggleApartments(){
    this.showApartments = !this.showApartments;
  } 
  //Searching function
  onSearch(): boolean{
    this.showSpinner = true;
	  // notify landlords and return search results
        if(this.search_obj.location && this.search_obj.maxPrice){
          this.search_obj.timeStamp = this.accom_svc.getTimeStamp()
          this.searchfeed_svc.Search(this.search_obj);
          //console.log(this.search_obj)
          this.accom_svc.search(this.search_obj).subscribe(val =>{
            //console.log(val)
            this.homeResults = val;
            let dialogRef1 = this.dialog.open(SearchR, {
              data: {
                location: this.search_obj.location,
                nearby: this.search_obj.nearby,
                minPrice: this.search_obj.minPrice,
                maxPrice: this.search_obj.maxPrice,
                apartmentType: this.search_obj.apartment_type,
                nsfas: this.search_obj.nsfas,
                name: this.cuser.displayName
              }
            });
            if(this.homeResults.length == 0 || this.homeResults.length == undefined || this.homeResults.length == null){
             // console.log(val);
              this.showSpinner = false;
              let dialogRef = this.dialog.open(StatusComponent,{
                data:{
                  title: 'No apartments',
                  message: 'there are currently no apartments that match your search.',
                  name: this.cuser.displayName
                }
              })
            }
            this.showSpinner = false;
          });
            this.submitted = true;
            this.formErr = "";
            this.search = true;
            return true;
        }
        else{
            this.showSpinner = false;
            let dialogRef = this.dialog.open(StatusComponent,{
                data:{
                  title: 'Enter search fields!',
                  message: 'we need atleast a LOCATION and MAX-PRICE before we can search for you',
                  name: this.cuser.displayName
                }
              })
            return false;
        } 
    }

  gotoApartmentDetails(apart_id: string){
    this.accom_svc.gotoApartmentDetails(apart_id);
  }

  toggleSearch(){
    this.open_search = !this.open_search;
  }
  //function for toggling the search pane
  getResults(text: string, option: string): Promise<string[]>{

    var j = 0;
    switch(option){
      case 'ci':
      j = 0; 
      break;
      case 're':
      j = 1; 
      break;
      case 'es':
      j = 2; 
      break;
      case 'ad':
      j = 3; 
      break;
    }
    const options = [
      {
        types: ['(cities)'],
        componentRestrictions: {country: 'za'}
      },
      {
        types: ['(regions)'],
        componentRestrictions: {country: 'za'}
      },
      {
        types: ['establishment'],
        componentRestrictions: {country: 'za'}
      },
      {
        types: ['address'],
        componentRestrictions: {country: 'za'}
      },
    ]
    var places = new Promise<string[]>((resolve, reject) =>{
        this.mapsAPILoader.load().then(() =>{
         let service = new google.maps.places.AutocompleteService();
         service.getPlacePredictions({input: text, types: options[j].types, componentRestrictions: options[j].componentRestrictions}, 
           (predictions, status) =>{
          if (status != google.maps.places.PlacesServiceStatus.OK){
            return 'Error';
          }
          resolve(predictions.map(val => val.description));
        })
      })
    })
    return places;
  }

  //function for toggling the form submission state
  onSubmit(){
	  this.submitted = true;
  }

  launch(){
    let dialogRef = this.dialog.open(ShareComponent);
  }

  virtualTour(){
    let tourDialog = this.dialog.open(StatusComponent,{
      data:{
        title: "3D virtual tour",
        message: "There is no virtual tour for this property",
        name: this.cuser.displayName
      }
    })
  }
}

@Component({
  selector: 'searchR',
  template: `
            <div class="container"  style="text-align: center">
              <h2 mat-dialog-title>Someone to the rescue!<hr></h2>
              <mat-dialog-content>
                <p class="alert alert-info"> 
                    <i>{{data.name|TakeJustName:" ":0}}</i>, landlords/agents around <strong> {{data.location|TakeJustName:",":0}}</strong>
                    will see and respond to this search.
                </p>    
                <table style="width: 70%; text-align: left" align="center">
                  <tr>
                    <th>
                      <strong> Alert details </strong>
                    </th>
                  </tr>
                  <tr>
                    <td>location</td>
                    <td>{{data.location}}</td>
                  </tr>
                  <tr>
                    <td>nearby</td>
                    <td>{{data.nearby}}</td>
                  </tr>
                  <tr>
                    <td>min Price</td>
                    <td>R{{data.minPrice}}.00</td>
                  </tr>
                  <tr>
                    <td>max Price</td>
                    <td>R{{data.maxPrice}}.00</td>
                  </tr>
                  <tr>
                    <td>apartment type</td>
                    <td>{{data.apartmentType}}</td>
                  </tr>
                 <tr>
                    <td>nsfas accredited</td>
                    <td>{{data.nsfas}}</td>
                  </tr>
                </table>
                
              </mat-dialog-content>
              <mat-dialog-actions style="padding:20px">
                <button mat-raised-button color="primary" (click)="close()"> ok </button>
              </mat-dialog-actions>
            </div>
  `,
  styleUrls: ['./apartlist.component.css']
})

export class SearchR{
 constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SearchR>){}
  close(){
    this.dialogRef.close()
  }
}
