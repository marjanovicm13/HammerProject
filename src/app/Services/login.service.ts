import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticatedResponse } from '../Models/AuthenticatedResponse/AuthenticatedResponse';
import { Login } from '../Models/Login/login';
import {
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = "login"

  constructor(private http: HttpClient, private router: Router, private socialAuthService: SocialAuthService) { }

  public loginUser(user: Login): Observable<AuthenticatedResponse>{
    return this.http.post<AuthenticatedResponse>(`${environment.baseApiUrl}/${this.url}`, user)
  }

  public getUsers(): Observable<Login[]>{
    return this.http.get<Login[]>(`${environment.baseApiUrl}/${this.url}`)
  }

  public loginFacebookUser(facebookToken: string): Observable<AuthenticatedResponse>{
    return this.http.post<AuthenticatedResponse>(`${environment.baseApiUrl}/account`,facebookToken, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })})
  }

  public logout(){
    if(sessionStorage.getItem("userLoggedIn") == "fbuser"){
      this.socialAuthService.signOut().then(() => {
        sessionStorage.removeItem("jwt")
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userLoggedIn")
        sessionStorage.removeItem("userName");
        console.log("Signing out...");
        this.router.navigate(['login']);
      });
    }
    else {
        sessionStorage.removeItem("jwt")
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userLoggedIn")
        sessionStorage.removeItem("userName");
        console.log("Signing out...");
        this.router.navigate(['login']);
    } 
  }
}
