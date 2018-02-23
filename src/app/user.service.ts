import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireDatabaseModule, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import * as firebase from 'firebase';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from './status/status.component';
import {MatDialog, MatDialogRef} from '@angular/material';

@Injectable()
export class UserService{
  proceedStat: boolean = false;
  private messaging = firebase.messaging();
  private authState: any = null;
  private currentLogged: any = null;
 
  constructor(private  http: HttpClient, private router: Router, public afAuth: AngularFireAuth,
    private db: AngularFireDatabase, private dialog: MatDialog){
    //If firebase.onAuthStateChanged does not fire, put firebase.auth().currentUser into authState
      this.currentUserObservable.subscribe(cuser =>{
        this.authState = cuser;
      })
      //**************************asynchronous process********************************************
      firebase.auth().onAuthStateChanged(user =>{
        //If onAuthStateChanged fires put the authState into the authState variable
        //console.log('the authstate ', this.authState)
        if(user != null){
          //**************************asynchronous process********************************************
          this.updateOnConnect();
          this.updateOnDisconnect();
          this.getUserById(user.uid).subscribe(user_obj =>{
            this.currentLogged = user_obj;
            this.cacheUser(user_obj);
            //console.log('User service ln36: user logged in ', this.currentLogged);
          })
          //*******************************************************************************************
        }else{
          //console.log('User service ln41: user logged out');
        } 
     })
     //******************************************************************************************************* 
  }

  private updateStatus(status: boolean){

    if(this.authState == null) return;
    //console.log('Updating user status: ', status);
     this.db.object(`/users/${this.authState.uid}`).update({status: status}).then(val =>{
       //console.log('user: ', val)
     })
  }

  updateOnConnect(){
    return this.db.object('.info/connected').subscribe(connected =>{
      let status = connected.$value ? true: false;
      this.updateStatus(status)
    })
  }

  updateOnDisconnect(){
    firebase.database().ref().child(`users/${this.getLoggedUser().uid}`).onDisconnect().update({status: false})
  }

  //Returns an object of the currently logged user
  getCurrentLogged():any{
    return this.currentLogged;
  }

  getAuthState(){
    return this.authState;
  }
  //Returns a firebase observable of the requested user                                         
  getUserById(user_id: string): FirebaseObjectObservable<any>{
    return this.db.object(`/users/${user_id}`)
  }
  //creates a record for the user in the firebase database
  //Todo: Migrate this method to the firebase cloud functions if possible
  createUserRecord(user_id: string, user: any){
    //console.log('user_id from createUserRecord: ', user_id);
    //console.log('User from createUserRecord', user);
		const newUser = {
        fcm_token: '',
        is_host: user['is_host'],
        displayName: user['displayName'],
        phoneNumber: user['phoneNumber'],
        uid: user_id,
        photoURL: '',
        email: user['email'],
        status: true
			}
	  return	this.db.object(`/users/${user_id}`).set(newUser);
  }
  //Updates a user record
  updateUserRecord(user: any){
    return  this.db.object(`/users/${user.uid}`).update(user);
  }
  //logs the user in with their google account and returns their profile kept by google  
 /* loginWithGoogle(){
     return this.afAuth.auth.signInWithPopup(
       new firebase.auth.GoogleAuthProvider()
     ).then(dat => {
       console.log(dat);
       this.getPermission();
       this.proceed(dat);
     }).catch(err => console.log(err));
  }
  //Logs user in via facebook auth
  loginWithFb(){
     return this.afAuth.auth.signInWithPopup(
       new firebase.auth.FacebookAuthProvider()
     ).then(dat => {
       console.log(dat);
       this.getPermission();
       this.proceed(dat);
     }).catch(err => console.log(err));
  }*/
  //signs up a new user with email and password credentials    
  createNewUser(user:any){
     //query firebase new user creation function, which returns the new user object
     return firebase.auth().createUserWithEmailAndPassword(user['email'], user['password'])
      .then(user_obj =>{
          this.createUserRecord(user_obj.uid, user)
          .then(dat =>{
            this.getUserById(user_obj.uid).subscribe(user_fetched =>{
              this.proceed(user_fetched);
              this.cacheUser(user_fetched); 
            })  
          }).then(() =>{
            this.getPermission();
          })
          .catch(err => console.log("Clickinn error: "+ err))
        },
        (error) =>{
          let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Sign up error !',
            message: 'Please check your credentials and try again, if this persists please contact support',
            name: ''
          }
        })
        }
      )
  }
  //Sign in with email and password and the proceed status is set to true or false based on the success
  signInWithEandP(email: string, password: string){
    if(this.authState != null) firebase.auth().signOut();
    var locs: string[] = [];
    return firebase.auth().signInWithEmailAndPassword(email, password).then(firebaseUserObject => {  
      //console.log(firebaseUserObject);
        this.getUserById(firebaseUserObject.uid).subscribe(userRecord =>{
          this.cacheUser(userRecord).then(cahceUserResponse =>{
            //console.log('cache user response ', cahceUserResponse)
            this.proceed(userRecord);
            if(userRecord.is_host){
            this.getHostLocations(this.getLoggedUser().uid)
            .subscribe(locations =>{
              locations.forEach(loc =>{
                if(locs.indexOf(loc) == -1) locs.push(loc)
              });
              this.updateHostLocations(firebaseUserObject.uid, locs)
            })
          } 
          this.getPermission();
          })
        })
    },
    (error) =>{
      console.log('This is the error ', error);
      //give error based on code
      let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Sign in error !',
            message: 'If your sign in details are correct please check your internet connection and try again, if this issue persists please contact support',
            name: ''
          }
        })
    })

   /* .then(() =>{
      console.log('UserRecord.uid: ', this.getLoggedUser().uid);
        console.log('UserRecord: ', this.getLoggedUser());
        this.createUserRecord(this.getLoggedUser().uid, this.getLoggedUser()).then(() =>{
          this.getPermission();
        })
    })*/
  }

  anonymousSignin(){
    return firebase.auth().signInAnonymously()
  }

  get authenticated(): boolean{
    return this.authState != null;
  }

  get currentUser(): any{
    return this.authenticated ? this.authState : null
  }

  get currentUserObservable(): any{
    return this.afAuth.authState;
  }

  get currentUserId(): string{
    return this.authenticated ? this.authState.uid : '';
  }

  get currentUserEmail(): string{
    return this.authenticated ? this.authState.email : 'no email provided';
  }

  get currentUserPhone(): string{
    return this.authenticated ? this.authState.phoneNumber : 'no phone number provided';
  }

  get currentUserName(): string{
    return this.authenticated ? this.authState.displayName : 'no name provided';
  }

  logout(){
    this.db.object(`/users/${this.authState.uid}`).update({status: false})
    firebase.auth().signOut().then(()=>{
      this.router.navigate(['/signin']).then(()=>{
        localStorage.removeItem('clickinn_user')
      });
    }).catch(error => {
      console.log(error);
    })
    
  }

  proceed(user_object: any){
    //console.log('Proceed running...');
    //if the user exists and has a token, figure out what class of user they are and take them to their home panel, else populate and show an error message
    if(this.authenticated){
      //console.log("user authenticated")
      this.proceedStat = true;
      if(user_object.is_host){
        //console.log("user is host");
        this.router.navigate(['host_dash/search_feed']);
        //return 1;
      }
      else{
        //console.log("user not host")
        this.router.navigate(['home/apart_list']);
        //return 2;
      }
    }else{
      //console.log('Not authenticated')
      this.router.navigate(['/signin']);
    } 
  }

  getLoggedUser(){
    //console.log('getLoggedUser running...');
    return JSON.parse(localStorage.getItem('clickinn_user'));
  }

  cacheUser(user: any): Promise<any>{
    //console.log('cacheUser running...');
    var userPromise = new Promise<any>((resolve, reject) =>{
    localStorage.setItem('clickinn_user', JSON.stringify(user));
    resolve();
    })
    return userPromise;
  }

  getPermission(){
    //console.log('getPermission running...');
    this.messaging.requestPermission()
    .then(dat => {
    //console.log("Notification permission granted.")
    return this.messaging.getToken()
    })
    .then(token => {
      //console.log('fcm token: ', token)
    this.updateToken(token)
    })
    .catch((err) => {
     console.log('Unable to get permission to notify. ' , err);
    });  
  }
  
  updateToken(token){
    //console.log('updateTokens running...');
  this.afAuth.authState.take(1).subscribe( user => {
    if(!user) return;
    const fcm_token = token
    this.db.object(`users/${user.uid}`).update({'fcm_token': fcm_token});
  })   
  }

  getHostLocations(uid: string): Observable<string[]>{
    //console.log('getHostLocations running...');
    return this.db.list('Properties', {
      query:{
        orderByChild: 'user_id',
        equalTo: uid
      }
    }).map(properties => properties.map(property =>{
      return property.location;
    }) )
  }

  updateHostLocations(host_id: string, locations: string[]){
    //console.log('updateHostLocations running...');
    return this.db.object(`users/${host_id}/locations`).set(locations);
  }

  resetPassword(){
    
  }

}
