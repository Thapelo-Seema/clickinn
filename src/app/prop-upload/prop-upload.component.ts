import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { UserService} from '../user.service';
import {AccommService} from '../accomm.service';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import {MatChipInputEvent} from '@angular/material';
import {ENTER} from '@angular/cdk/keycodes';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {Property} from '../property';
import {Upload} from '../upload';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import {StatusComponent} from '../status/status.component';
const COMMA = 188;
@Component({
  selector: 'app-prop-upload',
  templateUrl: './prop-upload.component.html',
  styleUrls: ['./prop-upload.component.css']
})
export class PropUploadComponent implements OnInit, OnDestroy{

  prop: Property ={
    user_id: '',
    location: '',
    common: '',
    street_address: '',
    near_to: [],
    nsfas: false,
    prepaid_elec: false,
    laundry: false,
    parking: false,
    dP: {
          url: 'https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?alt=media&token=d865595d-187a-49f9-b682-14a8faeffdd2',
          name: 'clickinn logo',
          progress: 100,
          path: 'path'
         },
    images: null,
    wifi: false,
    prop_id: '',
    timeStamp: 0
  };

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  separatorKeyCodes = [ENTER, COMMA];
  nearby: string = '';
  created: any;
  placeCtrl: FormControl;
  adrControl: FormControl;
  searchControl: FormControl;
  textCtrl: FormControl;
  cuser : any;
  properties: Property[];
  showForm: boolean = false;
  propertyImages: Array<any> = [];
  displayPic: any;
  showSpinner: boolean= true;
  hostLocations: string[] = [];
  showUploadForm: boolean = false;
  places: any;
  locations: any;
  addresses: any;
  placeSubs: any;
  addrSubs: any;
  searchSubs: any;
  propSubs: any;
  hostLocsSubs: any;
  
  constructor(private user_svc: UserService, private accom_svc: AccommService, private router: Router, 
    private dialog: MatDialog, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.placeCtrl = new FormControl();
    this.adrControl = new FormControl();
    this.searchControl = new FormControl();
   }

  ngOnInit() {
    this.cuser = this.user_svc.getLoggedUser();
    this.prop.user_id = this.cuser['uid'];
    this.propSubs = this.accom_svc.getHostProperties(this.cuser['uid']).subscribe(hostProps =>{
        //console.log(hostProps);
        this.properties = hostProps;
        this.hostLocsSubs = this.accom_svc.getHostLocations(this.cuser['uid']).subscribe(locations =>{
          if(locations.$value != null) this.hostLocations = locations
        })
        this.showSpinner = false;
    });
    this.placeSubs = this.placeCtrl.valueChanges.subscribe(val =>{
      if(val.length > 2){
        this.getResults(val, 'es').then(places => this.places = places);
      } 
    })
    this.addrSubs = this.adrControl.valueChanges.subscribe(val =>{
      if(val.length > 2){
        this.getResults(val, 'ad').then(places => this.addresses = places);
      }
    })
    this.searchSubs = this.searchControl.valueChanges.subscribe(val =>{
      if(val.length > 2){
        this.getResults(val, 're').then(places => this.locations = places);
      }
    })
  }

  ngOnDestroy(){
    
  }

  remove(nearTo: string){
    let index = this.prop.near_to.indexOf(nearTo);
    if(index >= 0){
      this.prop.near_to.splice(index, 1);
    }
  }

  clearPlaces(){
    this.places = [];
  }

  toggleForm(){
    this.showUploadForm = !this.showUploadForm;
  }

  addNearby(){
    this.prop['near_to'].push(this.nearby);
    this.nearby = "";
  }

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
         service.getPlacePredictions({input: text, types: options[j].types, 
           componentRestrictions: options[j].componentRestrictions}, 
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

  addApartment(id: string){
    this.router.navigate(['host_dash/apart_upload', id]);
  }

  gotoProperties(){
    this.router.navigate(['host_dash/property_list']);
  }

  gotoPropertyApartments(prop_id: string){
    this.accom_svc.gotoPropertyApartments(prop_id);
  }

  gotoBookings(){
    this.accom_svc.gotoBookings();
  }

  gotoProperty(prop_id: string){
    this.router.navigate(['host_dash/property', prop_id]);
  }

  reportBack(){
    let dialogRef = this.dialog.open(ReportComponent, {
      data:{
          name: this.cuser.displayName,
          address: this.prop.street_address
      }
    }) 
  }

  goBack(){
    this.accom_svc.goBack();
  }

  dpChange(event){
   this.displayPic = event.target.files[0];
   console.log('displayPic selected: ', this.displayPic)
  }

  fileChange(event) {
    this.propertyImages = event.target.files;
    console.log('Property Images selected: ', this.propertyImages)
  }
  //uploading the property details and images
  upload(){
    if(this.prop.location == '' || this.prop.street_address == ''){
      let dialogRef = this.dialog.open(StatusComponent, {
        data:{
          name: this.cuser['displayName'],
          title: 'Upload failed',
          message: 'please make sure you have entered an address and location for your property'
        }
      })
      this.showSpinner = false;
      return -1;
    }
    var displayPicture: Upload
    this.showSpinner = true;
    if(this.displayPic != null && this.displayPic != undefined){
      console.log('display pic not null', this.displayPic)
      displayPicture = 
      {
        file: this.displayPic,
        url: '',
        name: this.displayPic.name,
        progress: 0,
        path: `PropertyDisplayImages`
      }
    }
    //Get the current timeStamp for the upload
    this.prop.timeStamp = this.accom_svc.getTimeStamp();
    //declaring an empty array that carries upload objects
    var images: Upload[] = [];
    //refferencing the images file list
    const filesToUpload = this.propertyImages;
    //getting an array of indices of each element in the file list
    const filesIdx = _.range(filesToUpload.length);
    //creating an upload object for each file in the array and pushing each upload into the images array
    _.each(filesIdx, (idx) => { 
        //creating the upload object
        let fupload: Upload = 
        {
          file: filesToUpload[idx],
          url: '',
          name: filesToUpload[idx].name,
          progress: 0,
          path: `PropertyImages`
        }
        //pushing the upload object to the fb storage
        images.push(fupload);
    })
    if(displayPicture != null && displayPicture != undefined && images.length > 0){
      this.accom_svc.uploadFile(displayPicture).then(pic =>{
        this.prop.dP = pic;
        //Uploading the images to the firebase storage
        this.accom_svc.uploadFiles(images).then(propImages =>{
          //Add the property to the db
          this.accom_svc.addHostProperty(this.cuser['uid'], this.prop).then(propObject =>{
            //update the images of the property
            this.accom_svc.saveFilesData(propImages,'Properties', propObject.key)
            //Update the property id
            this.accom_svc.updatePropertyId(propObject.key).then(() => {
              if(this.hostLocations.length > 0){
                if(this.hostLocations.indexOf(this.prop.location) == -1){
                  this.hostLocations.push(this.prop.location);
                  this.accom_svc.updateHostLocations(this.cuser['uid'], this.hostLocations);
                }
              }else{
                this.hostLocations.push(this.prop.location);
                this.accom_svc.updateHostLocations(this.cuser['uid'], this.hostLocations);
              }
              this.showSpinner = false;
              this.accom_svc.gotoProperties();
              this.reportBack();
            });
          });
        });
      })
    }else if(images.length > 0){
      //Uploading the images to the firebase storage
      this.accom_svc.uploadFiles(images).then(val =>{
        console.log('Property images just uploaded: ', val);
        //Add the property to the db
        this.accom_svc.addHostProperty(this.cuser['uid'], this.prop).then(val2 =>{
          //update the images of the property
          this.accom_svc.saveFilesData(val,'Properties', val2.key)
          //Update the property id
          this.accom_svc.updatePropertyId(val2.key).then(result => {
            if(this.hostLocations.indexOf(this.prop.location) == -1){
              this.hostLocations.push(this.prop.location);
              this.accom_svc.updateHostLocations(this.cuser['uid'], this.hostLocations);
            }
            this.showSpinner = false;
            this.accom_svc.gotoProperties();
            this.reportBack();
          });
        });
      });
    }
    else{
        //Add the property to the db
        this.accom_svc.addHostProperty(this.cuser['uid'], this.prop).then(val2 =>{
          //Update the property id
          this.accom_svc.updatePropertyId(val2.key).then(result => {
            if(this.hostLocations.indexOf(this.prop.location) == -1){
              this.hostLocations.push(this.prop.location);
              this.accom_svc.updateHostLocations(this.cuser['uid'], this.hostLocations);
            }
            this.showSpinner = false;
            this.accom_svc.gotoProperties();
            this.reportBack();
          });
        });
    }
  }
}

@Component({
  selector: 'property-report',
  template: `

            <div class="container-fluid"  style="text-align: center">
              <h2 mat-dialog-title>Upload Report<hr></h2>
              <mat-dialog-content>
                <p class="alert alert-info"> 
                    Hi <i>{{data.name|TakeJustName:" ":0}}</i>, your property at {{data.address}}, has
                    successfully been uploaded. You can now start adding apartments to this property.
                </p>   
              </mat-dialog-content>
              <mat-dialog-actions style="padding:20px">
                <button mat-raised-button color="primary" (click)="close(); refresh()"> ok </button>
              </mat-dialog-actions>
            </div>
  `,
  styleUrls: ['./prop-upload.component.css']
})
export class ReportComponent  {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ReportComponent>, private router: Router){}

  close(){
    this.dialogRef.close()
  }

  refresh(){
    this.router.navigate(['host_dash/prop_upload'])
  }
}