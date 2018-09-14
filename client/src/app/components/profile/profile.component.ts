import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  firstName;
  lastName;
  username;
  email;

  constructor(
    private authService:AuthorizationService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.firstName=profile.user.firstName;
      this.lastName=profile.user.lastName;
      this.username = profile.user.username;
      this.email = profile.user.email; 
    });
  }
}
