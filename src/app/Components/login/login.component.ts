import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/Models/Login/login';
import { LoginService } from 'src/app/Services/login.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';

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

  constructor(private loginService: LoginService, private router: Router, private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
}

  login(user: Login){
    this.loginService.loginUser(user).subscribe({

      complete: () => {
        console.log('Request complete');
        this.errorMessage = false;
        this.loginService.loggedIn.next(true);
        this.loginService.userName.next(user.loginUserName);
        this.router.navigate(['home'])
      },
      error: () => {
        this.loginService.loggedIn.next(false);
        this.errorMessage = true;
      }

    });
  }

  loginWithFacebook(): void {
    
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {   
      this.socialUser = user;
      this.router.navigate(['home'])
    });
  }

}
