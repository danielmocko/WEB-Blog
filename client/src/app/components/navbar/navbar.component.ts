import { Component, OnInit } from '@angular/core';
import { AuthorizationService} from '../../services/authorization.service';
import { Router}from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
//import { JwtHelperService } from '@auth0/angular-jwt';
// ...

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


 // helper = new JwtHelperService();
  //isExpired = this.helper.isTokenExpired(localStorage.getItem('token'));

  constructor(
    private authService:AuthorizationService,
    private router:Router,
    private flashMessagesService: FlashMessagesService,
    
  ) { }

  onLogoutClick() {
    this.authService.logout(); // Logout user
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert-info' }); // Set custom flash message
    this.router.navigate(['/']); // Navigate back to home page
  }

 

  ngOnInit() {
  }

}
