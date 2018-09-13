import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validator, Validators} from '@angular/forms';
import { AuthorizationService} from '../../services/authorization.service';
import { BlogService} from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost=false;
  loadingBlogs = false;
  form;
  processing=false;
  username;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthorizationService,
    private blogService:BlogService
  ) {
    this.createNewBlogForm();
   }

  createNewBlogForm(){
    this.form=this.formBuilder.group({
      title:['',Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body:['',Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    });
  }

  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value))
      return null;
    else  
      return {'alphaNumericValidation':true};
  }

  newBlogForm(){
    this.newPost=true;
  }
  reloadBlogs(){
    this.loadingBlogs=true;

    setTimeout(()=>{
      this.loadingBlogs=false;
    },4000)
  }

  onBlogSubmit() {
    this.processing = true; // Disable submit button
    this.disableFormNewBlogForm(); // Lock form
    // Create blog object from form fields
    const blog = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      createdBy: this.username // CreatedBy field
    }

    // Function to save blog into database
    this.blogService.newBlog(blog).subscribe(data => {

      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message;
        this.processing = false; // Enable submit button
        this.enableFormNewBlogForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        // Clear form data after two seconds
        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewBlogForm(); // Enable the form fields
        }, 2000);
      }
    });
  }


  goBack(){
    window.location.reload();
  }
  
  enableFormNewBlogForm(){
    this.form.get('title').enable();
    this.form.get('body').enable();
  }
  
  disableFormNewBlogForm(){
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{
      this.username = profile.user.username;
    });
  }

}
