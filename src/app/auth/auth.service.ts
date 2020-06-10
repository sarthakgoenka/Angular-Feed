import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl+"/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private token;
private userId: string;
private isAuthenticated = false;
private tokenTimer: any;
private authStatusListener = new Subject<boolean>();
  constructor(private http:HttpClient, private router:Router) { }

  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getUserId(){
    return this.userId;
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn>0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn/1000);
    }
  }

  createUser(email:string, password:string){
    const authData:AuthData = {email:email, password:password};
    this.http.post<AuthData>(BACKEND_URL + '/signup', authData)
      .subscribe(response=>{
        console.log(response);
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      })
  }
  login(email:string, password:string){
    const authData:AuthData = {email:email, password:password};
    this.http.post<{token:string, expiresIn:number, userId:string}>(BACKEND_URL + '/login', authData)
      .subscribe(response=>{
        console.log(response);
        this.token = response.token;
        if(this.token){
          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          this.tokenTimer =this.setAuthTimer(expiresInDuration);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      },error => {
        this.authStatusListener.next(false);
      });
  }
  private setAuthTimer(duration:number){
    console.log("your duration is: " + duration);
    setTimeout(()=>{

      alert('You are been LogOut! Please login again');
      this.logout();
    }, duration*1000);
  }
  logout(){
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.token = null;
    this.userId = null;
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData(token:string, expirationDate:Date, userId:string){
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
}
}
