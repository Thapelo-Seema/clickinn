import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AngularFireModule} from 'angularfire2';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {Apartment} from './apartment';
import {Property} from './property';
import {Image} from './image';
import {Upload} from './upload';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Search} from './search';



@Injectable()
export class AccommService {

  private headers = new HttpHeaders({ 'Accept': 'application/json'});

 constructor(private http: HttpClient, private db: AngularFireDatabase, private afAuth: AngularFireAuth, 
    private ngfire: AngularFireModule, private router: Router, private location: Location) { }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addHostProperty(uid: string, prop: Property){
    return this.db.list(`/Properties`).push(prop);
  }

  acceptViewing(id: string){
    return this.db.object(`/Viewings/${id}/confirmed`).set(true)
  }

  addHostApartment(apartment: Apartment){
    return this.db.list(`/Apartments`).push(apartment);
  }

  bookViewing(booking: any){
    return this.db.list(`/Viewings`).push(booking);
  }

  declineViewing(id: string){
    return this.db.object(`/Viewings/${id}/confirmed`).set(false)
  }

  getPropertyApartments(prop_id: string): FirebaseListObservable<Apartment[]>{
    return this.db.list(`/Apartments`, {
      query:{
        orderByChild: 'prop_id',
        equalTo: prop_id
      }
    })
  }

  getHostViewings(host_id: string){
    return this.db.list(`/Viewings`, {
      query:{
        orderByChild: 'host_id',
        equalTo: host_id
      }
    })
  }

  getViewing(book_id: string){
    return this.db.object(`/Viewings/${book_id}`);
  }

  getTimeStamp(): number{
    const rightNow: number = Date.now();
    return rightNow;
   }

  getHostApartments(prop_id: string): FirebaseListObservable<Apartment[]>{
     return this.db.list('/Apartments', {
      query:{
        orderByChild: 'prop_id',
        equalTo: prop_id
      }
    })
  }

  getHostProperties(uid: string): FirebaseListObservable<Property[]>{
    return this.db.list('Properties', {
      query:{
        orderByChild: 'user_id',
        equalTo: uid
      }
    })
  }

  getHostProperty(prop_id: string): FirebaseObjectObservable<Property>{
    return this.db.object(`/Properties/${prop_id}`);
  }

  getHostApartment(apart_id: string): FirebaseObjectObservable<Apartment>{
    return this.db.object(`/Apartments/${apart_id}`);
  }

  getAllProperties(): FirebaseListObservable<Property[]>{
    return this.db.list('/Properties');
  }

  getAllPropertiesIn(location: string): FirebaseListObservable<Property[]>{
    return this.db.list(`/Properties`,{
      query:{
        orderByChild: 'location',
        equalTo: location
      }
    })
  }

  getAllApartments(): Observable<Apartment[]>{
    return this.db.list('/Apartments').map(apartments =>{
      console.log('Apartments: ', apartments)
      return apartments.filter(apartment => (apartment.available == true));
    });
  }

  getAllApartmentsIn(location:string): FirebaseListObservable<Apartment[]>{
    return this.db.list(`/Apartments`, {
      query: {
        orderByChild: 'location',
        equalTo: location
      }
    })
  }

  getHostLocations(host_id: string): Observable<any>{
    return this.db.object(`/users/${host_id}/locations`);
  }

  getRecentApartments(): Observable<Apartment[]>{
    return this.db.list('/Apartments',{
      query:{
        limitTolast: 30
      }
    }).map(apartments =>{
     return apartments.filter(apartment => (apartment.available == true));
    });
  }

  getRecentApartmentsIn(location: string): FirebaseListObservable<Apartment[]>{
    return this.db.list('/Apartments',{
      query:{
        orderByChild: 'location',
        equalTo: location,
        limitTolast: 30
      }
    })
  }

  getRecentProperties(): FirebaseListObservable<Property[]>{
    return this.db.list('/Properties',{
      query:{
        limitTolast: 30
      }
    })
  }

  getRecentPropertiesIn(location: string): FirebaseListObservable<Property[]>{
    return this.db.list('/Properties',{
      query:{
        orderByChild: 'location',
        equalTo: location,
        limitTolast: 30
      }
    })
  }

  placeAutoComplete(text: string): Observable<any>{
    var query = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=cities&components=country:za&key=AIzaSyDDlerLZUic8oouF8ndwSPIK0wPigTwtf0`;
    return this.http.get(query);
  }

  //pushing the upload metadata to the realtime database
  saveFilesData(images: Array<Image>, node: string, node_id: string){
   var imagesDone = 0;
   var imgPromise = new Promise<any>((resolve, reject) =>{
     images.forEach(image =>{
       ++imagesDone;
       this.db.list(`/${node}/${node_id}/images`).push(image)
     })
     if(imagesDone == images.length){
       resolve();
     }
   })
   return imgPromise;
  }

  saveFileData(image: Image){
    return this.db.object(`${image.path}`).set(image);
  }

  search(searchObj: Search): Observable<Apartment[]>{
    return this.getAllApartments()
    .map(apartments => apartments.filter(apartment => 
      ( (apartment.property.location == searchObj.location) && (apartment.price <= searchObj.maxPrice) &&
        (apartment.room_type == searchObj.apartment_type) && apartment.available && (searchObj.nsfas == apartment.property.nsfas)) 
    ))
  }

  updatePropertyId(prop_id: string){
    return this.db.object(`Properties/${prop_id}/prop_id`).set(prop_id);
  }

  updateApartmentId(apart_id: string){
    return this.db.object(`Apartments/${apart_id}/apart_id`).set(apart_id);
  }

  updatePropertyDetails(prop_id: string, property: Property){
    return this.db.object(`Properties/${prop_id}`).update(property);
  }

  updateApartmentDetails(apart_id: string, apartment: Apartment){
    return this.db.object(`Apartments/${apart_id}`).update(apartment);
  }

  updateHostLocations(host_id: string, locations: string[]){
    return this.db.object(`users/${host_id}/locations`).set(locations);
  }
  //Upload function that pushes binary data to firebase and updates the upload metadata
  uploadFiles(uploads: Array<Upload>): Promise<Image[]>{//creating an upload task to a specific directory hierarchy in the fb storage
    var files: Array<Image> = [];
    const numFiles = uploads.length;
    var filesPushed = 0;
    const storageRef = firebase.storage().ref();
    //creating an upload task to a specific directory hierarchy in the fb storage
    var ImageArrayPromise = new Promise<Image[]>((resolve, reject) => {
        uploads.forEach(upload => {
          const uploadTask = storageRef.child(`${upload.path}/${upload.name}`).put(upload.file);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
             //update the progress property of the upload object
             upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
          },
          (error) => {
           console.log(error);
          },
          () =>{
           //on success of the upload, update the url property of the upload object
           let image: Image = {
              url: uploadTask.snapshot.downloadURL,
              name: upload.name,
              progress: upload.progress,
              path: upload.path
           } 
           files.push(image);
           ++filesPushed;
           if(filesPushed == numFiles){
             resolve(files);
           }
         })
      })
    })
    return ImageArrayPromise;
  }
  //The function that deletes files from storage
  deleteItemFromStorage(fileUrl: string){
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${fileUrl}`).delete()
  }

  deleteApartmentFromDB(apart_id: string){
     return this.db.object(`/Apartments/${apart_id}`).remove();
  }

  deleteImage(path: string){
    return this.db.object(`${path}`).remove();
  }

  deletePropertyFromDB(prop_id: string){
      return this.db.object(`/Properties/${prop_id}`).remove();
  }
  //Upload function that pushes binary data to firebase and updates the upload metadata
  uploadFile(upload: Upload): Promise<Image>{
   //establishing a reference to the storage bucket
  const storageRef = firebase.storage().ref();
  //creating an upload task to a specific directory hierarchy in the fb storage
  const uploadTask = storageRef.child(`${upload.path}/${upload.name}`).put(upload.file);
  var ImagePromise = new Promise<Image>((resolve, reject) => {
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
     (snapshot) => {
       //update the progress property of the upload object
     upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
     },
     (error) => {
       //if there's an error log it in the console
       console.log(error);
     },
     () =>{
       //on success of the upload, update the url property of the upload object
       let image: Image = {
          url: uploadTask.snapshot.downloadURL,
          name: upload.name,
          progress: upload.progress,
          path: upload.path
       }
       resolve(image)
     }
     )
  })
    //Monitoring the state of the upload task
    return ImagePromise;
  }

  addApartment(id: string){
    this.router.navigate(['host_dash/apart_upload', id]);
  }

  gotoProperties(){
    this.router.navigate(['host_dash/property_list']);
  }

  gotoBookings(){
    this.router.navigate(['host_dash/bookings']);
  }

  gotoBooking(booking_id: string){
    this.router.navigate(['host_dash/booking', booking_id]);
  }

  gotoProperty(prop_id: string){
    this.router.navigate(['host_dash/property', prop_id]);
  }

  gotoPropEdit(prop_id: string){
    this.router.navigate(['host_dash/editProperty', prop_id]);
  }

  gotoPropertyApartments(prop_id: string){
    this.router.navigate(['host_dash/propertyApartments', prop_id]);
  }

  gotoApartmentDetails(apart_id: string){
    this.router.navigate(['home/apartment', apart_id]);
  }

  goBack(){
    this.location.back();
  }

  gotoEditApartment(apart_id: string){
    this.router.navigate(['host_dash/editApartment', apart_id]);
  }

  getApartImages(apart_id: string):FirebaseListObservable<Image[]>{
    return this.db.list(`/Apartments/${apart_id}/images`)
  }

  getPropertyImages(prop_id: string):FirebaseListObservable<Image[]>{
    return this.db.list(`/Properties/${prop_id}/images`)
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* handleError(error:any){
    console.log("An error occoured: ", error);
    return Promise.reject(error.message || error);
  } */
}

