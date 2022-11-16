import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/Services/login.service';
import {
  SocialAuthService
} from 'angularx-social-login';

declare const FB: any;

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

  constructor(private socialAuthService: SocialAuthService,private loginService: LoginService) { }

  ngOnInit(): void {
    this.checkLogin()
  }

  checkLogin() {
    FB.getLoginStatus(function(response: any) {
      console.log(response)
     })
    if(sessionStorage.getItem("userLoggedIn") == null){
      sessionStorage.removeItem("jwt")
      sessionStorage.removeItem("refreshToken");
    }
    else{ 
      if(sessionStorage.getItem("userLoggedIn") == "fbuser"){
        this.fbUserLoggedIn = true;
        this.fbUserName = sessionStorage.getItem("userName")!
      }
      else{
        this.userLoggedIn = true;
        this.userName = sessionStorage.getItem("userName")!
      }
    }
  }

  logout(){
    this.loginService.logout()
  }
}
