import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.onbeforeunload = function() {
      sessionStorage.setItem("origin", window.location.href);
    }

  window.onload = function() {
    if (window.location.href == sessionStorage.getItem("origin")) {
        sessionStorage.clear();
     } 
    }
  }

}
