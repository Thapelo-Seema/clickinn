import { Component, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { UserService} from '../user.service';
import {AccommService} from '../accomm.service';
import * as _ from 'lodash';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {Apartment} from '../apartment';
import {Property} from '../property';
import {Upload} from '../upload';
import {_apartment_types} from '../../environments/environment';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';

@Component({
  selector: 'app-apart-upload',
  templateUrl: './apart-upload.component.html',
  styleUrls: ['./apart-upload.component.css']
})
export class ApartUploadComponent implements OnInit, OnDestroy{

  apartment: Apartment = {
    room_type: '',
    price: 0,
    deposit: 0,
    dP:{
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
  };
  displayPic: any;
  showForm: boolean = false;
  prop: Property;
  prop_id: string = '';
  apartments: Apartment[] = null;
  apartmentImages: Array<any> = [];
  cuser: any;
  apartment_types = _apartment_types;
  showSpinner: boolean= true;

  constructor(private user_svc: UserService, private accom_svc: AccommService, private route: ActivatedRoute,
   private dialog: MatDialog) {
  }

  ngOnInit() {
    this.cuser = this.user_svc.getLoggedUser();
    this.setUpPropertyComponent() ;  
  }

  ngOnDestroy(){
    //console.log('Destroying...');
  }
  
  goBack(){
    this.accom_svc.goBack();
  }

  reportBack(){
    let dialogRef = this.dialog.open(StatusComponent, {
      data:{
        name: this.cuser.displayName,
        message: `you have successfully uploaded this apartment!`,
        title: 'Apartment upload'
      }
    }) 
  }

  selectProperty(prop_id: string){
    this.apartment.prop_id = prop_id;
  }

  setUpPropertyComponent(){
   this.route.params.subscribe(params => {
        this.prop_id = params['prop_id']; 
        this.accom_svc.getHostApartments(this.prop_id).subscribe(apartments =>{
          this.apartments = apartments;
          this.showSpinner = false;
        });
        this.accom_svc.getHostProperty(this.prop_id).subscribe(property =>{
        this.prop = property;
        this.apartment.property = this.prop;
        this.apartment.prop_id = this.prop_id;
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

  gotoPropertyApartments(prop_id: string){
    this.accom_svc.gotoPropertyApartments(prop_id);
  }

  gotoEditApartment(apart_id: string){
    this.accom_svc.gotoEditApartment(apart_id);
  }

  toggleForm(){
    this.showForm = !this.showForm;
  }

  dpChange(event){
   this.displayPic = event.target.files[0];
   console.log('displayPic selected: ', this.displayPic)
  }

  fileChange(event) {
    this.apartmentImages = event.target.files;
  }

  upload(){
    if(confirm("Are you sure you want to upload this apartment ?")){
      if(this.apartment.price == 0 || this.apartment.room_type == '' || this.apartment.property == null){
      let dialogRef = this.dialog.open(StatusComponent, {
        data:{
          name: this.cuser['displayName'],
          title: 'Upload failed',
          message: 'please make sure you have entered all the required information for this apartment'
        }
      })
      this.showSpinner = false;
      return -1;
    }
    this.showSpinner= true;
    var images: Array<Upload> = [];
    this.apartment.timeStamp = this.accom_svc.getTimeStamp();
    var displayPicture: Upload;
    if(this.displayPic != null && this.displayPic != undefined){
      displayPicture = 
      {
        file: this.displayPic,
        url: '',
        name: this.displayPic.name,
        progress: 0,
        path: `ApartmentDisplayImages`
      }
    }
    //refferencing the images file list
    const filesToUpload = this.apartmentImages;
    //getting an array of indices of each element in the file list
    const filesIdx = _.range(filesToUpload.length);
    //pushing each image individually to the fb storage bucket
    _.each(filesIdx, (idx) => { 
        //creating the upload object
        let fupload: Upload = 
        {
          file: filesToUpload[idx],
          url: '',
          name: filesToUpload[idx].name,
          progress: 0,
          path: `ApartmentImages`
        }
        //pushing the upload objects into an array
        images.push(fupload);
      })

    if(displayPicture != null && displayPicture != undefined && images.length > 0){
      this.accom_svc.uploadFile(displayPicture).then(pic =>{
        this.apartment.dP = pic;
        //Uploading the images to the firebase storage
        this.accom_svc.uploadFiles(images).then(apartImages =>{
          //Add the property to the db
          this.accom_svc.addHostApartment(this.apartment).then(apartObject =>{
            //update the images of the property
            this.accom_svc.saveFilesData(apartImages,'Apartments', apartObject.key).catch(error =>{
              console.log(error);
              let dialogRef = this.dialog.open(StatusComponent, {
        data:{
          name: this.cuser['displayName'],
          title: 'Upload error',
          message: 'Apartment could not be uploaded, please try uploading again'
        }
      })
        this.showSpinner = false;
        return -1;
            })
            //Update the property id
            this.accom_svc.updateApartmentId(apartObject.key).then(() => {
              this.showSpinner = false;
              this.accom_svc.gotoPropertyApartments(this.apartment.prop_id);
              this.reportBack();
            });
          });
        }).catch(error =>{
          console.log(error);
        let dialogRef = this.dialog.open(StatusComponent, {
        data:{
          name: this.cuser['displayName'],
          title: 'Apartment images error',
          message: 'Apartment pictures could not be uploaded, please try uploading again'
        }
      })
        this.showSpinner = false;
        return -1;
        });
      }).catch(error => {
        console.log(error);
        let dialogRef = this.dialog.open(StatusComponent, {
        data:{
          name: this.cuser['displayName'],
          title: 'Display picture error',
          message: 'The display picture could not be uploaded, please try uploading again'
        }
      })
        this.showSpinner = false;
        return -1;
      })
    }else if((displayPicture == null || displayPicture == undefined) && images.length > 0){
      //Uploading the images to the firebase storage
      this.accom_svc.uploadFiles(images).then(val =>{
          //Add the property to the db
          this.accom_svc.addHostApartment(this.apartment).then(val2 =>{
          //update the images of the property
          this.accom_svc.saveFilesData(val,'Apartments', val2.key).catch(error =>{
              console.log(error);
              let dialogRef = this.dialog.open(StatusComponent, {
        data:{
          name: this.cuser['displayName'],
          title: 'Upload error',
          message: 'Apartment could not be uploaded, please try uploading again'
        }
      })
        this.showSpinner = false;
        return -1;
            })
          //Update the property id
          this.accom_svc.updateApartmentId(val2.key).then(result => {
            this.showSpinner = false;
            this.accom_svc.gotoPropertyApartments(this.apartment.prop_id);
            this.reportBack();
          });
        });
      }).catch(error =>{
          console.log(error);
        let dialogRef = this.dialog.open(StatusComponent, {
        data:{
          name: this.cuser['displayName'],
          title: 'Apartment images error',
          message: 'Apartment pictures could not be uploaded, please try uploading again'
        }
      })
        this.showSpinner = false;
        return -1;
        });
    }
    else{
      //Add the property to the db
      this.accom_svc.addHostApartment(this.apartment).then(val2 =>{
        //Update the property id
        this.accom_svc.updateApartmentId(val2.key).then(result => {
          this.showSpinner = false;
          this.accom_svc.gotoPropertyApartments(this.apartment.prop_id);
          this.reportBack();
        });
      });
    }
   }
  }
}
