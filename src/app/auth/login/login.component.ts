import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub:Subscription;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus=>{
        this.isLoading = false;
      });
  }
  onLogin(form:NgForm){
    this.isLoading = true;
    console.log(form.value);
    this.authService.login(form.value.email, form.value.password);
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
