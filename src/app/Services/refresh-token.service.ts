import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatedResponse } from '../Models/AuthenticatedResponse/AuthenticatedResponse';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(private router:Router, private jwtHelper: JwtHelperService, private http: HttpClient) { }

  url = "token"
  accessToken: string = ""
  isAccessTokenExpired: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public async tryRefreshingTokens(token: string): Promise<boolean>{
    console.log("tryrefreshingtokens")
    const refreshToken: any = sessionStorage.getItem("refreshToken")
    if(!token || !refreshToken){
      return false;
    }
    var credentials = ({ accessToken: token, refreshToken: refreshToken});
    console.log("normal cred " + credentials)
    var jsoncredentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken});
    console.log("json creds " + jsoncredentials)
    let isRefreshSuccess: boolean;

    const refreshRes = await new Promise<AuthenticatedResponse>((resolve, reject) => {
      this.http.post<AuthenticatedResponse>(`${environment.baseApiUrl}/${this.url}/refresh`, credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
    }).subscribe({
      next: (res: AuthenticatedResponse) => resolve(res),
      error: (_) => {reject; isRefreshSuccess = false;}
    });
  });
  sessionStorage.setItem("jwt", refreshRes.accessToken)
  sessionStorage.setItem("refreshToken", refreshRes.refreshToken)
  isRefreshSuccess = true
  this.isAccessTokenExpired.next(false)
  this.accessToken = refreshRes.accessToken
  return isRefreshSuccess
  }
}
