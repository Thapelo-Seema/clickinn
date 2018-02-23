import { Injectable } from '@angular/core';
import {UserService} from './user.service';
import {Search} from './search';
import { Observable } from 'rxjs';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';

@Injectable()
export class SearchfeedService {

  constructor(private db: AngularFireDatabase) { }

  Search(search_object: Search){
    let search_obj = {
      location: search_object['location'],
      nearby: search_object['nearby'],
      minPrice: search_object['minPrice'],
      maxPrice: search_object['maxPrice'],
      nsfas: search_object['nsfas'],
      apartment_type: search_object['apartment_type'],
      searcher_id: search_object['searcher_id'],
      searcher_name: search_object['searcher_name'],
      timeStamp: search_object['timeStamp']
    }
    return this.db.list(`/Searches`).push(search_obj);
  }

  businessQuery(query: any){
    return this.db.list('/BusinessQueries').push(query);
  }

  getSearches(locations: string[]): Observable<any>{
    return this.db.list(`/Searches`, {
        query: {
          orderByChild: 'timeStamp',
          limitToLast: 100
        }
      })
     .map(searches => searches.filter(search => {
         return locations.indexOf(search.location) !== -1
       })
     )  
  }

}
