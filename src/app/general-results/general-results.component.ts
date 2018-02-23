import { Component, OnInit } from '@angular/core';
import {AccommService} from '../accomm.service';
import {UserService} from '../user.service';

@Component({
  selector: 'app-general-results',
  templateUrl: './general-results.component.html',
  styleUrls: ['./general-results.component.css']
})
export class GeneralResultsComponent implements OnInit {
  homeResults: any; //recently loaded apartments
  constructor(private accom_svc: AccommService, private user_svc: UserService) { }

  ngOnInit() {
   // this.accom_svc.getAccoms().then(dat => this.homeResults = this.accom_svc.getAccommodations());
  }

}
