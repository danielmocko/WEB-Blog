import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username;
  email;

  constructor(
    private authService:AuthorizationService
  ) { }



  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.email = profile.user.email; 
    });
  }
}
