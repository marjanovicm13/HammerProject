import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticatedResponse } from '../Models/AuthenticatedResponse/AuthenticatedResponse';
import { facebookToken } from '../Models/Facebook/facebookToken';
import { Login } from '../Models/Login/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = "login"
  loggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  userName: BehaviorSubject<String> = new BehaviorSubject<String>("");

  constructor(private http: HttpClient) { }

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
}
