import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { FileUploader} from 'ng2-file-upload';


const uri ='http://localhost:8080/authentication/profileImage';
const token =localStorage.getItem('token');

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
  gender;
  imageToShow: any;
  isImageLoading=false;
  imageUrl;

  uploader:FileUploader = new FileUploader({ url:uri, authToken: token });
  attachmentList:any = [];

  constructor(
    private authService:AuthorizationService,
  ) 
  { 
    this.uploader.onCompleteItem = (item:any, response:any , status:any, headers:any) => {
      this.attachmentList.push(JSON.parse(response));
      console.log(response);
      }
  }
  
ngOnInit() {
 
    this.authService.getProfile().subscribe(profile => {
      this.firstName=profile.user.firstName;
      this.lastName=profile.user.lastName;
      this.username = profile.user.username;
      this.email = profile.user.email; 
      this.imageUrl=profile.user.imageProfile;
    });
    console.log(JSON.stringify(this.imageUrl));
   
  }
}
