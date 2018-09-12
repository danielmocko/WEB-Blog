import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl} from '@angular/forms';
import { AuthorizationService} from '../../services/authorization.service';
import { Router } from '@angular/router';
import { AuthGuard} from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;
  
  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthorizationService,
    private router:Router,
    private authGuard:AuthGuard
  ) { 
    this.createForm();
  }

    createForm(){
      this.form=this.formBuilder.group({
        username: ['',Validators.required],
        password: ['',Validators.required]
      });
    }

    enableForm(){
      this.form.controls['username'].enable();
      this.form.controls['password'].enable();
    }

    disableForm(){
      this.form.controls['username'].disable();
      this.form.controls['password'].disable();
    }

    onLoginSubmit(){
      this.processing = true;
      this.disableForm();
      const user={
        username:this.form.get('username').value,
        password:this.form.get('password').value
      }

      this.authService.login(user).subscribe(data => {
        // Check if response was a success or error
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Set bootstrap error class
          this.message = data.message; // Set error message
          this.processing = false; // Enable submit button
          this.enableForm(); // Enable form for editting
        } else {
          this.messageClass = 'alert alert-success'; // Set bootstrap success class
          this.message = data.message; // Set success message
          // Function to store user's token in client local storage
          this.authService.storeUserData(data.token, data.user);
          // After 2 seconds, redirect to dashboard page
          setTimeout(() => {
            // Check if user was redirected or logging in for first time
            if (this.previousUrl) {
              this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
            } else {
              this.router.navigate(['/dashboard']); // Navigate to dashboard view
            }
          }, 2000);
        }
      });
    }

  ngOnInit() {
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger'; // Set error message: need to login
      this.message = 'You must be logged in to view that page.'; // Set message
      this.previousUrl = this.authGuard.redirectUrl; // Set the previous URL user was redirected from
      this.authGuard.redirectUrl = undefined; // Erase previous URL
    }
  }

}
