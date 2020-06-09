import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit ,OnDestroy{

  isLoading = false;
  private authStatusSub:Subscription;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus=>{
        this.isLoading = false;
      });
  }

  onSignup(form:NgForm){
    this.isLoading = true;
    console.log(form.value);
    if(form.invalid){
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
