import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
  this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
    this.userIsAuthenticated = isAuthenticated;
    console.log("authenticated status is" + this.userIsAuthenticated);
  });
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
  }
}
