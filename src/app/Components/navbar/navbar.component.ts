import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from 'src/app/Models/Login/login';
import { LoginService } from 'src/app/Services/login.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { RefreshTokenService } from 'src/app/Services/refresh-token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userLoggedIn: Boolean = false;
  fbUserLoggedIn: Boolean = false;
  fbUserName: String = "";
  userName: String = "";
  socialUser!: SocialUser;

  constructor(private loginService: LoginService, private router: Router, private socialAuthService: SocialAuthService, private jwtHelper: JwtHelperService,
    private refreshTokenService: RefreshTokenService) { }

  ngOnInit(): void {
    console.log(sessionStorage.getItem("jwt"))

    //const token = sessionStorage.getItem("jwt");
    if(sessionStorage.getItem("jwt") != null){
      //this.loginService.loggedIn.next(true)
      this.checkLogin()
      this.refreshTokenService.accessToken = sessionStorage.getItem("jwt")!;
      this.refreshTokenService.isAccessTokenExpired.next(this.jwtHelper.isTokenExpired(this.refreshTokenService.accessToken))
    }

    this.refreshTokenService.isAccessTokenExpired.subscribe(pos => {
      if(this.refreshTokenService.isAccessTokenExpired.value == true){
        console.log("Refreshing tokens with access token:..." + this.refreshTokenService.accessToken)
        this.refreshTokenService.tryRefreshingTokens(this.refreshTokenService.accessToken).then(()=>{
          this.checkLogin()
        })
      }
      else{
        console.log("Token is not yet expired " + this.refreshTokenService.isAccessTokenExpired.value)
        this.checkLogin();
      }
    })

    // if(sessionStorage.getItem("jwt") != null && !this.jwtHelper.isTokenExpired(this.refreshTokenService.accessToken)){
    //   const decodedToken = this.jwtHelper.decodeToken(this.refreshTokenService.accessToken)
    //   this.loginService.userName.next(decodedToken.name)
    //   this.loginService.loggedIn.next(true)

    //   //this.refreshTokenService.accessToken.next(token);
    //   console.log(decodedToken)
    // }

    //Login
    this.loginService.loggedIn.subscribe(res => {
      this.userLoggedIn = res;
      if(this.userLoggedIn == true){
        this.userName = this.loginService.userName.value;
      }
    })

    // if(this.loginService.loggedIn.value == true && this.refreshTokenService.accessToken && !this.jwtHelper.isTokenExpired(this.refreshTokenService.accessToken)){
    //   this.userLoggedIn = this.loginService.loggedIn.value;
    //   this.userName = this.loginService.userName.value;
    //   //console.log(this.jwtHelper.decodeToken(this.refreshTokenService.accessToken))
    // }
    
    //Facebook login
    this.socialAuthService.authState.subscribe((user) => {
      if(user != null){
        this.fbUserLoggedIn = true;
        console.log(user)
        this.socialUser = user;
        this.fbUserName = this.socialUser.firstName + " " + this.socialUser.lastName;
      }
      
    });
  }

  checkLogin(){
    if(sessionStorage.getItem("jwt") != null && !this.jwtHelper.isTokenExpired(this.refreshTokenService.accessToken)){
      console.log(this.fbUserLoggedIn)
      const decodedToken = this.jwtHelper.decodeToken(this.refreshTokenService.accessToken)
      this.loginService.userName.next(decodedToken.name)
      if(this.fbUserLoggedIn == false){
        this.loginService.loggedIn.next(true)
      }
    }
  }

  logout(){
    if(this.socialUser != null){
      this.socialAuthService.signOut().then(() => {
        this.loginService.loggedIn.next(false);
        //sessionStorage.removeItem("jwt")
        //sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("jwt")
        sessionStorage.removeItem("refreshToken");
        console.log("Signing out");
        this.router.navigate(['login']);
      });
    }
    else {
        //sessionStorage.removeItem("jwt")
        //sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("jwt")
        sessionStorage.removeItem("refreshToken");
        this.loginService.loggedIn.next(false);
        this.router.navigate(['login']);
    } 
  }

}
