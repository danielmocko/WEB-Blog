import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/Rx';
import { HttpClient} from '@angular/common/http';


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
    private http:Http,
    private httpClient:HttpClient
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
      this.createAuthenticationHeaders();
      return this.http.get(this.domain + 'authentication/profile', this.options).pipe(map(res => res.json()));
    }

    logout(){
      this.authToken=null;
      this.user=null;
      localStorage.clear();
    }
    
    getPublicProfile(username) {
      this.createAuthenticationHeaders();
      console.log(username);
      return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options).pipe(map(res => res.json()));
    }

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
