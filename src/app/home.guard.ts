import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from './user.service';

@Injectable()
export class HomeGuard implements CanActivate {
  constructor(private user_svc: UserService, private router: Router){
	}
  	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  	if(this.user_svc.getLoggedUser().uid == null || this.user_svc.getLoggedUser().uid == undefined || this.user_svc.getLoggedUser().is_host){
  		this.router.navigate(['/signin']);
  		return false;
  	}else{
  		return true;
  	}
    
  }
}
