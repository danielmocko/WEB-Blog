import { Component, OnInit } from '@angular/core';
import { AuthorizationService}from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl;
  username;
  email;
  foundProfile = false;
  messageClass;
  message;
  firstName;
  lastName;

  imageUrl;


  constructor(
    private authService:AuthorizationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.authService.getPublicProfile(this.currentUrl.username).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message; 
        this.foundProfile = false;
      } else {
        this.foundProfile=true;
        this.firstName = data.user.firstName;
        this.lastName= data.user.lastName;
        this.username = data.user.username;
        this.email = data.user.email;
        this.imageUrl=data.user.imageProfile;
      }
    });
  }

}
