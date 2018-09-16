import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  domain ="http://localhost:8080/";
  authToken;
  user;
  options;
  
  helper = new JwtHelperService();


  constructor(
    private http:Http
  ) { }

    regiseterUser(user){
      console.log(JSON.stringify(user));
      return this.http.post(this.domain + 'authentication/register', user).pipe(map(res => res.json()));
    }

    checkUsername(username){
      return this.http.get(this.domain+"authentication/checkUsername/"+username).pipe(map(res =>res.json()));
    }

    checkEmail(email){
      return this.http.get(this.domain+"authentication/checkEmail/" + email).pipe(map(res=>res.json()));
    }

    storeUserData(token,user){
      localStorage.setItem('token',token);
      localStorage.setItem('user',JSON.stringify(user));
      this.authToken=token;
      this.user=user;
    }

    login(user){
      return this.http.post(this.domain+'authentication/login',user).pipe(map(res =>res.json()));
    }

    createAuthenticationHeaders(){
      this.loadToken();
      this.options = new RequestOptions({
        headers:new Headers({
          'Content-Type':'aplication/json',
          'authorization':this.authToken
        })
      });
    }

    loadToken(){
      const token=localStorage.getItem('token');
      this.authToken=token;
    }

    getProfile() {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + 'authentication/profile', this.options).pipe(map(res => res.json()));
    }

    logout(){
      this.authToken=null;
      this.user=null;
      localStorage.clear();
    }
    
    getPublicProfile(username) {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      console.log(username);
      return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options).pipe(map(res => res.json()));
    }

/*
    loggin(){
      return this.helper.isTokenExpired(localStorage.getItem('token'));

    }
*/
/*
  onUpload(selectedFile){
    //console.log(selectedFile);
    this.createAuthenticationHeaders();
    const uploadData = new FormData();
    uploadData.append('myFile', selectedFile);
    return this.http.post(this.domain+'authentication/profileImage',uploadData,this.options).
    subscribe(res=>console.log(res.json()));
  }

  */


 postFile (fileToUpload: File) {
  this.createAuthenticationHeaders();
  const formData: FormData = new FormData();
  formData.append('Image', fileToUpload, fileToUpload.name);
  return this.http.post(this.domain+'authentication/profileImage',formData,this.options);
  }


  loggin() {
    return tokenNotExpired();
  }
}
