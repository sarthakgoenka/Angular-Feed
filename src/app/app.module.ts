import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HeaderComponent } from './header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {AuthIntercetor} from "./auth/auth-intercetor";
import {ErrorInterceptor} from "./error-interceptor";
import { ErrorComponent } from './error/error.component';
import {AngularMaterialModule} from "./angular-material.module";
import {PostsModule} from "./posts/posts.module";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    PostsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS ,useClass: AuthIntercetor, multi:true},
    {provide: HTTP_INTERCEPTORS ,useClass: ErrorInterceptor, multi:true}],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

