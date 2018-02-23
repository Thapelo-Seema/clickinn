import { Component, OnInit } from '@angular/core';
import {AccommService} from '../accomm.service';
import {UserService} from '../user.service';
import {SearchfeedService} from '../searchfeed.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {Apartment} from '../apartment';
import {Search} from '../search';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  search_obj: Search ={
    location: '',
    nearby: '',
    minPrice: 0,
    maxPrice: 0,
    nsfas: false,
    apartment_type: '',
    searcher_id: '',
    searcher_name: '',
    timeStamp: 0
  };

  formErr: string;

  apartment_types = [
    "2 Bedroom flat",
    "1 Bedroom flat", 
    "Bachelor flat", 
    "Cottage", 
    "Single Room", 
    "2 Sharing Room", 
    "3 Sharing Room"];

    submitted: boolean = false;

    searchResults: FirebaseListObservable<Apartment[]>;
    
  constructor(private accom_svc: AccommService, private user_svc: UserService, private search_svc: SearchfeedService) { }


  ngOnInit() {
    this.search_obj.searcher_id = this.user_svc.getLoggedUser().uid;
  }

    //Searching function
  /*onSearch(): boolean{
	  // notify landlords and return search results
        if(this.search_obj.location && this.search_obj.maxPrice){
          this.accom_svc.search(this.search_obj).then(dat => this.searchResults = dat);
          this.search_svc.Search(this.search_obj);
            this.submitted = true;
            this.formErr = "";
            return true;
        }
        else{
            this.formErr = "Required search fields not filled in";
            return false;
        } 
    }*/

  //function for toggling the form submission state
  onSubmit(){
	  this.submitted = !this.submitted;
  }

}
