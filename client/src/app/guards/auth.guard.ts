import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService:AuthorizationService,
    private router: Router
  ) { }

  // Function to check if user is authorized to view route
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (this.authService.loggin()) {
      return true; 
    } else {
      this.redirectUrl = state.url; 
      this.router.navigate(['/login']); 
      return false; 
    }
  }
}