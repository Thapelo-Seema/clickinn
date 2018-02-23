import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AccommService} from '../accomm.service';
import {Apartment} from '../apartment'
import {_apartment_types} from '../../environments/environment';
import {MatDialog, MatDialogRef} from '@angular/material';;
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';
import {UserService} from '../user.service';
import {Upload} from '../upload';
import * as _ from 'lodash';
import {Image} from '../image';

@Component({
  selector: 'app-edit-apartment',
  templateUrl: './edit-apartment.component.html',
  styleUrls: ['./edit-apartment.component.css']
})
export class EditApartmentComponent implements OnInit, OnDestroy {

	apartment: Apartment = {
		apart_id: '',
		prop_id: '',
		property: null,
		price: 0,
		deposit: 0,
		description: '',
		room_type: '',
    dP: {
          url: 'https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/clickinn_logo.jpg?alt=media&token=d865595d-187a-49f9-b682-14a8faeffdd2',
          name: 'clickinn logo',
          progress: 100,
          path: 'path'
         },
		images: [],
		timeStamp: 0,
		available: true,
		occupiedBy: ''
	}
	apartment_types = _apartment_types;
	editMode: boolean = false;
  showSpinner: boolean= true;
  apartmentImages: Array<any> = [];
  images: any;
  
  cuser: any;

  constructor(private route: ActivatedRoute, private accom_svc: AccommService, private dialog: MatDialog,
   private user_svc: UserService) { }

  ngOnInit() {
    this.cuser = this.user_svc.getLoggedUser();
  	this.route.params.subscribe(params =>{
  		this.accom_svc.getHostApartment(params['apart_id']).subscribe(apartment =>{
        this.accom_svc.getApartImages(apartment.apart_id).subscribe(images =>{
          this.images = images;
        })
  			this.apartment = apartment;
        this.showSpinner = false;
  		})
  	})
  }

  ngOnDestroy(){
    
  }

  removeImage(image: any){
    if (confirm('Are you sure you want to delete this image permanently ?')){
      this.accom_svc.deleteImage(`/Apartments/${this.apartment.apart_id}/images/${image.$key}`)
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

  updateStatus(event){
    this.apartment.available = event.checked;
  }

  goBack(){
  	this.accom_svc.goBack();
  }

  toggleEdit(){
  	this.editMode = !this.editMode;
  }

  reportBack(){
    let dialogRef = this.dialog.open(StatusComponent, {
      data:{
          name: this.cuser.displayName,
          message: `you have successfully updated apartment!`,
          title: 'Apartment edit status'
      }
    }) 
  }

  fileChange(event) {
    this.apartmentImages = event.target.files;
  } 

  upload(){
    if(confirm("Are you sure you want to save these changes ?")){
    this.showSpinner= true;
    var images: Array<Upload> = [];
    this.apartment.timeStamp = this.accom_svc.getTimeStamp();
     if(this.apartmentImages.length > 0){//refferencing the images file list
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
           path: `ApartmentsImages`
         }
         //pushing the upload objects into an array
         images.push(fupload);
       })
       //upload the extra images to the firebase storage
       this.accom_svc.uploadFiles(images).then(images =>{
         this.accom_svc.saveFilesData(images, 'Apartments', this.apartment.apart_id);
       }).then(() =>{
         this.updateApartment();
       })}
       else{
        this.updateApartment();
      }
    }
    
    } 
    //Function that pushes the changed apartment to the realtime database
    updateApartment(){
      this.showSpinner = true;
    	this.accom_svc.updateApartmentDetails(this.apartment.apart_id, this.apartment).then(val =>{
        this.showSpinner = false;
        this.reportBack();
      })
    }
}
