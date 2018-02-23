import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
//import {FirebaseUISignInSuccess} from 'firebaseui-angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signup_obj = {
    email: '' ,
    displayName: '',
    phoneNumber: '' ,
    password: '' ,
    is_host: false,
  }
  cachedUser: any;

  emailErr = '';
  pwErr = '';
  phoneErr = '';
  confirmation: string = '';
  showSpinner: boolean= false;
  constructor(private user_svc: UserService, private router: Router, private dialog: MatDialog, private afAuth: AngularFireAuth) {
    if(this.user_svc.authenticated) this.user_svc.proceed(this.user_svc.getLoggedUser())
   }

  ngOnInit() {
    /*this.cachedUser = JSON.parse(localStorage.getItem('clickinn_user'));
    this.signup_obj.name = this.cachedUser.displayName;
    this.signup_obj.is_host = this.cachedUser.is_host;*/
  }

  safetyCheck(event){
    var c = event.target.value;
    if(c == '<' || c == '>' || c == '*' || c == '/' || c == '(' || c == ')' ) event.target.value = '';
  }

 ValidateEmail()   
{  
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.signup_obj.email))  
  {  
    return (true)  
  }   
    return (false)  
}

gotoSignUp(){
  this.router.navigate(['/signin']);
}

  phoneChanged(event){
   var currentVal = event.target.value.toString();
    if(currentVal.length <= 10){
      this.signup_obj.phoneNumber = currentVal;
      if(this.signup_obj.phoneNumber[0] != '0'){
        this.phoneErr = "Your phone number must start with a '0'";
        this.signup_obj.phoneNumber = '';
        event.target.value = 0;
      }else{
        this.phoneErr = '';
      }
    }else{
      this.phoneErr = "max phone number length reached";
      event.target.value = parseInt(this.signup_obj.phoneNumber);
    }
  }


  logout(){
    this.afAuth.auth.signOut();
  }

  successCallback() {
    
  }

  onSubmit(){
    this.showSpinner = true;
    if(this.signup_obj.email != '' && this.signup_obj.displayName != '' && this.signup_obj.password != ''){
        if(this.ValidateEmail() == false){
      this.showSpinner = false;
      let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Email error !',
            message: 'You entered an incorrect email',
            name: ''
          }
        })
      return -1;
    }
    if(this.confirmation === this.signup_obj.password){
      this.user_svc.createNewUser(this.signup_obj).then(user =>{
        console.log(user);
        this.showSpinner = false;
      },
      (error) =>{
        this.showSpinner = false;
        let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Sign up error !',
            message: 'If this error persists please contact support',
            name: ''
          }
        })
      }).catch(error =>{
                this.showSpinner = false;
              let dialogRef = this.dialog.open(StatusComponent,{
                data:{
                  title: 'Sign up error !',
                  message: 'If this error persists please contact support',
                  name: ''
                }
              })
            }); 
    }else{
      this.showSpinner = false;
      let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Password error !',
            message: 'Your passwords do not match, please re-type carefully',
            name: ''
          }
        })
    }
    }else{
      this.showSpinner = false;
        let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Sign up error !',
            message: 'Please enter all required fields',
            name: ''
          }
        })
    }
    
  }

}
