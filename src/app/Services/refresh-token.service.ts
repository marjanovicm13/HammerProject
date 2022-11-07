import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatedResponse } from '../Models/AuthenticatedResponse/AuthenticatedResponse';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/Services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  url = "token"
  accessToken: string = ""

  public async tryRefreshingTokens(token: string): Promise<boolean>{
    console.log("Refreshing tokens...")

    const refreshToken: any = sessionStorage.getItem("refreshToken")
    if(!token || !refreshToken){
      console.log("No tokens...")
      return false;
    }
    
    var credentials = ({ accessToken: token, refreshToken: refreshToken});
    let isRefreshSuccess: boolean;

    const refreshRes = await new Promise<AuthenticatedResponse>((resolve, reject) => {
      this.http.post<AuthenticatedResponse>(`${environment.baseApiUrl}/${this.url}/refresh`, credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
    }).subscribe({
      next: (res: AuthenticatedResponse) => resolve(res),
      error: (_) => {reject; isRefreshSuccess = false; this.loginService.logout()}
    });
  });

  sessionStorage.setItem("jwt", refreshRes.accessToken)
  sessionStorage.setItem("refreshToken", refreshRes.refreshToken)
  
  isRefreshSuccess = true
  this.accessToken = refreshRes.accessToken
  return isRefreshSuccess
  }
}
