import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(
    private authService: AuthorizationService,
    private router: Router
  ) { }

 
  canActivate() {
   
    if (this.authService.loggin()) {
      this.router.navigate(['/']); 
      return false;
    } else {
      return true;
    }
  }
}