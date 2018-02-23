import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from './user.service';

@Injectable()
export class LandingGuard implements CanActivate {
	constructor(private user_svc: UserService, private router: Router){

	}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  	
  		//this.user_svc.proceed();
  	
    return true;
  }
}
