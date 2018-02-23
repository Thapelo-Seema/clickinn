import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material';
import {StatusComponent} from '../status/status.component';
import {AngularFireAuth} from 'angularfire2/auth';
import {FirebaseUISignInSuccess} from 'firebaseui-angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  cred = {
    email: '',
    password: ''
  }

  
  signinErr = '';
  user: any ;
  showSpinner: boolean= false;
  cachedUser: any;
  
  constructor(public dialog: MatDialog, private user_svc: UserService, private router: Router, 
    private afAuth: AngularFireAuth){
    if(this.user_svc.getLoggedUser()) this.user_svc.proceed(this.user_svc.getLoggedUser())
    else console.log('User not authenticated...')
  }

  ngOnInit(){
    this.cachedUser = JSON.parse(localStorage.getItem('clickinn_user'));
  }

  forgotPassword(){
    console.log('Forgot password running...')
    let dialogRef = this.dialog.open(ResetPassword);
  }

  signin(){
    this.showSpinner = true;
    this.user_svc.signInWithEandP(this.cred.email, this.cred.password).then(() =>{
      this.showSpinner = false;
    });
  }

  googleSI(){
  }

  fbSI(){
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}

@Component({
  selector: 'reset-password',
  template: `
    <mat-card>
      <h1> Reset Password </h1>
      <p>Hi please enter your email address and click 'reset' in order to have your clickinn password reset.</p>
      <input type="text" class="form-control" placeholder="email address..." [(ngModel)]="forgotEmail" name="emailAddress">
      <button mat-raised-button color="primary" (click)="resetPassword()">reset</button>
      <button mat-raised-button color="warn" (click)="close()">cancel</button>
    </mat-card>
  `,
  styleUrls: ['./signin.component.css']
})

export class ResetPassword{

  forgotEmail: string = '';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<ResetPassword>, private afAuth: AngularFireAuth, public dialog: MatDialog){}

  close(){
    console.log('closing dialog...');
    this.dialogRef.close()
  }

  resetPassword(){
    console.log('reseting password...');
    if(this.forgotEmail != ''){
      this.afAuth.auth.sendPasswordResetEmail(this.forgotEmail).then(()=>{
        this.close();
        let dialog1 = this.dialog.open(StatusComponent, {
          data: {
            message: `A reset email has been sent to ${this.forgotEmail}`,
            title: 'Reset email sent !'
          }
        })

        console.log('email sent!')
      })
    }else{
      let dialog2 = this.dialog.open(StatusComponent, {
          data: {
            message: `Please enter a valid email address`,
            title: 'invalid email address'
          }
        })
    }
    
  }
}
