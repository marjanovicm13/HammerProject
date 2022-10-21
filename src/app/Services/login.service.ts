import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../Models/Login/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = "login"
  loggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  userName: BehaviorSubject<String> = new BehaviorSubject<String>("");

  constructor(private http: HttpClient) { }

  public loginUser(user: Login): Observable<Login[]>{
    return this.http.post<Login[]>(`${environment.baseApiUrl}/${this.url}`, user)
  }

  public getUsers(): Observable<Login[]>{
    return this.http.get<Login[]>(`${environment.baseApiUrl}/${this.url}`)
  }
}
