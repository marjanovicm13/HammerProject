import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/Models/Login/login';
import { LoginService } from 'src/app/Services/login.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { RefreshTokenService } from 'src/app/Services/refresh-token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: boolean = false;
  socialUser!: SocialUser;
  userLoggedIn: string = ""

  constructor(private loginService: LoginService, private router: Router, private socialAuthService: SocialAuthService,
    private refreshTokenService: RefreshTokenService) { }

  ngOnInit(): void {
    sessionStorage.clear
  }

  login(user: Login){
    this.loginService.loginUser(user).subscribe(  {

      next: data => {
        sessionStorage.setItem("jwt", data.accessToken)
        sessionStorage.setItem("refreshToken", data.refreshToken)

        this.refreshTokenService.accessToken = data.accessToken;
        this.errorMessage = false;
        this.userLoggedIn = "user"

        sessionStorage.setItem("userLoggedIn", this.userLoggedIn)
        sessionStorage.setItem("userName", user.loginUserName)

        this.router.navigate(['home'])
      },
      error: response => {
        console.log(response)
        this.errorMessage = true;
      }
    });
  }

  loginWithFacebook(): void {
    
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {   
      this.socialUser = user;
      var fbToken = `{ "facebookToken": "${user.authToken}" }`

      this.loginService.loginFacebookUser(fbToken).subscribe(  {
        next: data => {
          sessionStorage.setItem("jwt", data.accessToken)
          sessionStorage.setItem("refreshToken", data.refreshToken)

          this.refreshTokenService.accessToken = data.accessToken;
          this.userLoggedIn = "fbuser"

          sessionStorage.setItem("userLoggedIn", this.userLoggedIn)
          sessionStorage.setItem("userName", user.firstName + " " + user.lastName)

          this.router.navigate(['home'])
        },
        error: response => {
          console.log(response)
        }
  
      });
    });
  }
}
