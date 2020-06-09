import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import { PostCreateComponent } from './posts/post-create/post-create.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { HeaderComponent } from './header/header.component';
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import { PostListComponent } from './posts/post-list/post-list.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthIntercetor} from "./auth/auth-intercetor";
import {ErrorInterceptor} from "./error-interceptor";
import {MatDialogModule} from "@angular/material/dialog";
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    LayoutModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule


  ],
  providers: [{provide: HTTP_INTERCEPTORS ,useClass: AuthIntercetor, multi:true},
    {provide: HTTP_INTERCEPTORS ,useClass: ErrorInterceptor, multi:true}],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
