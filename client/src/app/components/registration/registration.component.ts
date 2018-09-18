import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import {  AuthorizationService} from '../../services/authorization.service';
import { Router} from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  imageProfile;

  
  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthorizationService,
    private router: Router
  ) {
    this.createForm(); 
  }


  createForm() {
    this.form = this.formBuilder.group({
      firstName:['',Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        this.validateName
      ])],
      lastName:['',Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        this.validateName
      ])],
     
      email: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
   
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername 
      ])],

      password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(35),
        this.validatePassword 
      ])],
      gender:['',Validators.required],
      
      confirm: ['', Validators.required] 
    }, { validator: this.matchingPasswords('password', 'confirm') });
  }


  disableForm() {
    this.form.controls['firstName'].disable();
    this.form.controls['lastName'].disable();
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
    this.form.controls['gender'].disable();
  }


  enableForm() {
    this.form.controls['firstName'].enable();
    this.form.controls['lastName'].enable();
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
    this.form.controls['gender'].enable();
  }


  validateName(controls){
    const regExp = new RegExp(/^[A-Z][a-z]{2,30}$/);
    if(regExp.test(controls.value)){
      return null;
    }
    else  
      return {'validateName':true};
  }


  validateEmail(controls) {

    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validateEmail': true }
    }
  }


  validateUsername(controls) {
 
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true }
    }
  }


  validatePassword(controls) {

    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true } 
    }
  }


  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; 
      } else {
        return { 'matchingPasswords': true } 
      }
    }
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm(); 
    this.gender();
    
    const user = {
      firstName:this.form.get('firstName').value,
      lastName:this.form.get('lastName').value,
      email: this.form.get('email').value, 
      username: this.form.get('username').value, 
      password: this.form.get('password').value,
      gender:this.form.get('gender').value, 
      imageProfile:this.imageProfile
    }
   
    this.authService.regiseterUser(user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });

  }

  checkEmail() {
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if (!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername() {
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if (!data.success) {
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }

  gender(){
    if(this.form.controls['gender'].value=="male"){
      this.imageProfile='assets/img/male.jpg';
    }
    else if (this.form.controls['gender'].value=="female"){
      this.imageProfile='assets/img/female.jpg'
    }
  }


  ngOnInit() {
  }



}
