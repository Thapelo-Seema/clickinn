import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {Router, ActivatedRoute} from '@angular/router';
import {Image} from '../image';
import {Property} from '../property';
import {Apartment} from '../apartment';
import {AccommService} from '../accomm.service';
import {UserService} from '../user.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit, OnDestroy {
  prop: Property;
  cuser: any;
  prop_id: string = '';
  edit: boolean = false;
  showSpinner: boolean = true;
  images: any;
  


  constructor(private accom_svc: AccommService, private user_svc: UserService, 
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.cuser = this.user_svc.getLoggedUser();
    this.setUpPropertyComponent() ;
  }

  ngOnDestroy() {
    
  }


  addApartment(prop_id: string){
    this.router.navigate(['host_dash/apart_upload', prop_id]);
  }

  goBack(){
    this.accom_svc.goBack();
  }

  gotoPropEdit(prop_id: string){
      this.accom_svc.gotoPropEdit(prop_id);
  }

  gotoEditApartment(apart_id: string){
    this.accom_svc.gotoEditApartment(apart_id);
  }

  gotoPropertyApartments(prop_id: string){
    this.accom_svc.gotoPropertyApartments(prop_id);
  }


  toggleEdit(){
    this.edit = !this.edit;
  }

  setUpPropertyComponent(){
    this.route.params.subscribe(params => {
        this.prop_id = params['prop_id'];
        this.accom_svc.getHostProperty(this.prop_id).subscribe(val =>{
          this.accom_svc.getPropertyImages(val.prop_id).subscribe(images =>{
            this.images = images;
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

}
