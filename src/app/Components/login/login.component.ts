import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/Models/Login/login';
import { LoginService } from 'src/app/Services/login.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { RefreshTokenService } from 'src/app/Services/refresh-token.service';
import { facebookToken } from 'src/app/Models/Facebook/facebookToken';

declare var FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoggedIn: Boolean = false
  result: any;
  errorMessage: boolean = false;
  socialUser!: SocialUser;

  constructor(private loginService: LoginService, private router: Router, private socialAuthService: SocialAuthService,
    private refreshTokenService: RefreshTokenService) { }

  ngOnInit(): void {
    sessionStorage.clear
}

  login(user: Login){
    this.loginService.loginUser(user).subscribe(  {

      next: data => {
        console.log(data)
        //const token = data.accessToken
        //const refreshToken = data.refreshToken
        sessionStorage.setItem("jwt", data.accessToken)
        sessionStorage.setItem("refreshToken", data.refreshToken)
        this.refreshTokenService.accessToken = data.accessToken;

        this.errorMessage = false;
        this.loginService.loggedIn.next(true);
        this.loginService.userName.next(user.loginUserName);
        this.router.navigate(['home'])
      },
      error: response => {
        console.log(response)
        this.loginService.loggedIn.next(false);
        this.errorMessage = true;
      }

    });
  }

  loginWithFacebook(): void {
    
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {   
      this.socialUser = user;
      //this.fbToken.facebookToken = user.authToken
      var fbToken = `{ "facebookToken": "${user.authToken}" }`
      console.log(fbToken)
      this.loginService.loginFacebookUser(fbToken).subscribe(  {
        next: data => {
          console.log(data)
          //const token = data.accessToken
          //const refreshToken = data.refreshToken
          sessionStorage.setItem("jwt", data.accessToken)
          sessionStorage.setItem("refreshToken", data.refreshToken)
          this.refreshTokenService.accessToken = data.accessToken;
          //this.loginService.userName.next(user.loginUserName);
          this.router.navigate(['home'])
        },
        error: response => {
          console.log(response)
          this.loginService.loggedIn.next(false);
        }
  
      });
    });
  }

}
