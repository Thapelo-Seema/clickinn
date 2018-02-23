import { Component, OnInit, OnChanges, NgZone, OnDestroy } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {Router, ActivatedRoute} from '@angular/router';
import {Image} from '../image';
import {Property} from '../property';
import {Apartment} from '../apartment';
import {AccommService} from '../accomm.service';
import {UserService} from '../user.service';
import * as _ from 'lodash';
import {_locations, _nearbys} from '../../environments/environment';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MatChipInputEvent} from '@angular/material';
import {ENTER} from '@angular/cdk/keycodes';
import {Upload} from '../upload';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

const COMMA = 188;


@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit, OnDestroy {
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
    dP: null,
    images: [],
    wifi: false,
    prop_id: '',
    timeStamp: 0
  };
  
  cuser: any;
  prop_id: string = '';
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  separatorKeyCodes = [ENTER, COMMA];
  nearby: string = '';
  created: any;
  filteredPlaces: any;
  filteredLocs: any;
  nearbys = _nearbys;
  locations = _locations;
  propertyImages: Array<any> = [];
  showSpinner: boolean= false;
  placeCtrl: FormControl;
  images: any;
  
 /* constructor(private accom_svc: AccommService, private user_svc: UserService, 
  	private route: ActivatedRoute, private router: Router) { }
*/
  constructor(private user_svc: UserService, private accom_svc: AccommService,private route: ActivatedRoute,
   private router: Router, private dialog: MatDialog,  private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.placeCtrl = new FormControl();
   }

  ngOnInit() {
    this.cuser = this.user_svc.getLoggedUser();
    //this.user_svc.currentUserObservable ? 
    this.setUpPropertyComponent() ;
    this.placeCtrl.valueChanges.subscribe(val =>{
      if(val.length > 2){
        this.getResults(val).then(places => this.filteredPlaces = places);
      }
    })
  }

  ngOnDestroy() {
    
  }

  addApartment(prop_id: string){
    this.router.navigate(['host_dash/apart_upload', prop_id]);
  }

  removeImage(image: any){
    if (confirm('Are you sure you want to delete this image permanently ?')){
      this.accom_svc.deleteImage(`/Properties/${this.prop.prop_id}/images/${image.$key}`).then(() =>{

      })
      this.accom_svc.deleteItemFromStorage(`${image.path}/${image.name}`).then(a =>{
        let dialogRef = this.dialog.open(StatusComponent, {
          data:{
            title: 'Delete success',
            name: this.cuser.displayName,
            message: 'the picture has been deleted successfully!'
          }
        })
      },
      error =>{
        let dialogRef = this.dialog.open(StatusComponent, {
          data:{
            title: 'Delete failed',
            name: this.cuser.displayName,
            message: 'the picture could not be deleted, this may be because of network issues'
          }
        })
      })
    } else {
    // Do nothing!
    }
  }

  goBack(){
    this.accom_svc.goBack();
  }

  gotoPropertyApartments(prop_id: string){
    this.accom_svc.gotoPropertyApartments(prop_id);
  }

  reportBack(){
    let dialogRef = this.dialog.open(StatusComponent, {
      data:{
          name: this.cuser.displayName,
          message: `you have successfully updated this property!`,
          title: 'Property edit status'
      }
    }) 
  }

  getResults(text: string): Promise<string[]>{
    const options = 
      {
        types: ['establishment'],
        componentRestrictions: {country: 'za'}
      }
     
    var places = new Promise<string[]>((resolve, reject) =>{
        this.mapsAPILoader.load().then(() =>{
         let service = new google.maps.places.AutocompleteService();
         service.getPlacePredictions({input: text, types: options.types, componentRestrictions: options.componentRestrictions}, 
           (predictions, status) =>{
          if (status != google.maps.places.PlacesServiceStatus.OK){
            return 'Error';
          }
          resolve(predictions.map(val => val.description));
        })
      })
    })
    return places
  }

  setUpPropertyComponent(){
    this.route.params.subscribe(params => {
        this.prop_id = params['prop_id'];
        this.accom_svc.getHostProperty(this.prop_id).subscribe(val =>{
          this.accom_svc.getPropertyImages(val.prop_id).subscribe(images =>{
            this.images = images;
            console.log(this.images);
          })
        this.prop = val;
        this.showSpinner = false;
        });
      },
      (error) =>{
        console.log(error)
      },
      () => {
         console.log("done!") 
      }
    )
  }

   remove(nearTo: string){
    let index = this.prop.near_to.indexOf(nearTo);
    if(index >= 0){
      this.prop.near_to.splice(index, 1);
    }
  }

  addNearby(){
    this.prop['near_to'].push(this.nearby);
    this.nearby = "";
  }

  gotoProperties(){
    this.router.navigate(['host_dash/property_list']);
  }

  gotoProperty(prop_id: string){
    this.router.navigate(['host_dash/property', prop_id]);
  }

	fileChange(event) {
	  this.propertyImages = event.target.files;
	}
  //uploading the property details and images
  upload(){
    if(confirm("Are you sure you want to save these changes ?")){
          this.showSpinner = true;
    //Get the current timeStamp for the upload
    this.prop.timeStamp = this.accom_svc.getTimeStamp();
    //declaring an empty array that carries upload objects
    if(this.propertyImages.length > 0){
      var images: Upload[] = [];
      //refferencing the images file list
      const filesToUpload = this.propertyImages;
      //getting an array of indices of each element in the file list
      const filesIdx = _.range(filesToUpload.length);
      //creating an upload object for each file in the array and pushing each upload into the images array
      _.each(filesIdx, (idx) => { 
        //creating the upload object
        let fupload: Upload ={
          file: filesToUpload[idx],
          url: '',
          name: filesToUpload[idx].name,
          progress: 0,
          path: `PropertieImages`
        }
        //pushing the upload object to the fb storage
        images.push(fupload);
      })
      //upload the extra images to the firebase storage
      this.accom_svc.uploadFiles(images)
      .then(images =>{
        this.accom_svc.saveFilesData(images, 'Properties', this.prop.prop_id);
      })
      .then(() =>{
        this.updateProperty();
      })
    }
    else{
        this.updateProperty();
    }

    }
    
  }
  //Update
  updateProperty(){
    this.showSpinner = true;
    this.accom_svc.updatePropertyDetails(this.prop.prop_id, this.prop).then(val =>{
      this.showSpinner = false;
      this.reportBack();
    })
  }
}

