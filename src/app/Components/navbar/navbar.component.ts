import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from 'src/app/Models/Login/login';
import { LoginService } from 'src/app/Services/login.service';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';

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

  constructor(private loginService: LoginService, private router: Router, private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    //Login
    this.loginService.loggedIn.subscribe()
    if(this.loginService.loggedIn.value == true){
      this.userLoggedIn = this.loginService.loggedIn.value;
      this.userName = this.loginService.userName.value;
    }
    
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

  logout(){
    if(this.socialUser != null){
      this.socialAuthService.signOut().then(() => {
        this.loginService.loggedIn.next(false);
        console.log("Signing out");
        this.router.navigate(['login']);
      });
    }
    else {
        this.loginService.loggedIn.next(false);
        this.router.navigate(['login']);
    } 
  }


  
  

}
