import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {SearchfeedService} from '../searchfeed.service';
import {ChatService} from '../chat.service';
import {UserService} from '../user.service';
import {FirebaseListObservable} from 'angularfire2/database';
import {Search} from '../search';
import {AccommService} from '../accomm.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import {_locations} from '../../environments/environment';
import {FormControl} from '@angular/forms';
import {StatusComponent} from '../status/status.component';

@Component({
  selector: 'app-search-feed',
  templateUrl: './search-feed.component.html',
  styleUrls: ['./search-feed.component.css']
})
export class SearchFeedComponent implements OnInit, OnDestroy {

  feed : Search[];
  response = '';
  cuser: any;
  respond: boolean = false;
  editMode: boolean = false;
  showSpinner: boolean = true;
  locs = [];
  noLocations: boolean = true;
  feedMessage = '';
  noSearches: boolean = true;
 
  constructor(private search_svc: SearchfeedService, private chat_svc: ChatService, 
    private user_svc: UserService, private accom_svc: AccommService, public dialog: MatDialog){
  }

  ngOnInit(){
    this.cuser = this.user_svc.getLoggedUser();
    if(this.cuser != null && this.cuser != undefined){
      this.accom_svc.getHostLocations(this.cuser.uid).subscribe(locations =>{
      this.noLocations = false;
      if(locations.length != undefined && locations.length != null && locations.length > 0){
        //console.log('Locations: ', locations)
        this.search_svc.getSearches(locations).subscribe(val =>{
          this.noSearches = false;
          //console.log('Searches: ', val)

            this.feed = val.sort((a, b) =>{
              return b.timeStamp - a.timeStamp
            });
            this.showSpinner = false;
        });
      }
    })
    }else{
       let dialogRef = this.dialog.open(StatusComponent,{
       data:{
         message: "Internet connection lost, please reload once you've established a connection.",
         title: "Connection error"
       }
     });
    } 
  }

  ngOnDestroy(){
  }

  goBack(){
    this.accom_svc.goBack();
  }

  launchDialog(search_obj: Search){
     let dialogRef = this.dialog.open(ResponseComponent,{
       data:{
         uid: search_obj.searcher_id,
         apartment: search_obj.apartment_type,
         location: search_obj.location,
         maxPrice: search_obj.maxPrice
       }
     });
  }

  updateMessage(event){
    this.response = event.target.value;
  }

  toggleEdit(){
    this.editMode = !this.editMode;
  }

  saveProfile(){
    if(confirm('Are you sure you want to save these changes ?')){
      this.showSpinner = true;
      this.user_svc.updateUserRecord(this.cuser).then(() => {
        this.showSpinner = false;
        let dialogRef = this.dialog.open(StatusComponent,{
          data:{
            title: 'Profile status',
            name: this.cuser.displayName,
            message: 'your profile has been updated'
          }
        })
      })
    } 
  }
}

@Component({
  selector: 'response',
  template: `
            <div class="container-fluid" style="text-align: center; padding: 0px">
              <h2 mat-dialog-title>Send a chat message<hr></h2>
              <mat-dialog-content>
                <div class="input-group" style="width: 100%">
                  <textarea  class="form-control" style="z-index:0; width: 100%" 
                  placeholder="Type message here..."  [(ngModel)]="response" name="response">
                  </textarea>
                </div>
                <a mat-raised-button color="primary" (click)="sendTo(data.uid); close()" style="margin-top: 10px">
                  <i class="material-icons">send</i>
                </a> 
              </mat-dialog-content>
            </div>
  `,
  styleUrls: ['./search-feed.component.css']
})

export class ResponseComponent{

  response = '';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<ResponseComponent>, private chat_svc: ChatService){}

  close(){
    this.dialogRef.close()
  }

  updateMessage(event){
    this.response = event.target.value;
  }

  getTopic(): string{
    console.log(this.data.apartment);
    return `Response to your search of a ${this.data.apartment} around ${this.data.location} with maximum price
    of R${this.data.maxPrice}.00`
  }

  sendTo(uid: string){
    this.chat_svc.sendMessage(this.response, uid, this.getTopic());
  }
}
