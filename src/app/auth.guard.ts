import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from './user.service';
import {AngularFireAuth} from 'angularfire2/auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  rstate: any = null;
  rnext: any = null;

	constructor(private user_svc: UserService, private router: Router, private auth: AngularFireAuth){
	}
  	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
      this.rnext = next;
      this.rstate = state;
      //console.log('State: ', state);
      /*if(this.user_svc.getLoggedUser()) return true;
      //console.log('Access denied');
      this.router.navigate(['/signin']);
      return false*/
      return true;
    }
  	
    canActivateChild(){
      return this.canActivate(this.rnext, this.rstate);
    }

}

