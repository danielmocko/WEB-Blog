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

  constructor(
    public authService:AuthorizationService,
    private router:Router,
    private flashMessagesService: FlashMessagesService,
    
  ) { }

  onLogoutClick() {
    this.authService.logout(); 
    this.flashMessagesService.show('Uspešno ste se odjavili', { cssClass: 'alert-info' });
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}
