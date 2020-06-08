import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private token;
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
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }


  createUser(email:string, password:string){
    const authData:AuthData = {email:email, password:password};
    this.http.post<AuthData>('http://localhost:3000/api/user/signup', authData)
      .subscribe(response=>{
        console.log(response);
        this.router.navigate(['/login']);
      })
  }
  login(email:string, password:string){
    const authData:AuthData = {email:email, password:password};
    this.http.post<{token:string, expiresIn:number}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response=>{
        console.log(response);
        this.token = response.token;
        if(this.token){
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(()=>{
            alert('You are been LogOut! Please login again');
            this.logout();
          }, expiresInDuration*1000);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })
  }
  logout(){
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.token = null;
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

}
