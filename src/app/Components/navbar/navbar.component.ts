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
    // FB.getLoginStatus(function(response: any) {
    //   console.log(response)
    //  })
    console.log(localStorage.getItem("userLoggedIn") + " " + localStorage.getItem("jwt"))
    if(localStorage.getItem("userLoggedIn") == null){
      localStorage.removeItem("jwt")
      localStorage.removeItem("refreshToken");
    }
    else{ 
      if(localStorage.getItem("userLoggedIn") == "fbuser"){
        this.fbUserLoggedIn = true;
        this.fbUserName = localStorage.getItem("userName")!
      }
      else{
        this.userLoggedIn = true;
        this.userName = localStorage.getItem("userName")!
      }
    }
  }

  logout(){
    this.loginService.logout()
  }
}
