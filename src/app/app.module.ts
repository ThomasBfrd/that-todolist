import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as fr from '@angular/common/locales/fr'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SingleTaskComponent } from './single-task/single-task.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './task/components/task/task.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { registerLocaleData } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { TaskRefreshService } from './services/task-refresh.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SingleTaskComponent,
    TasksListComponent,
    TaskComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    LoginComponent,
    SignupComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule,

  ],
  providers: [
    {provide: 'LOCAL_ID', useValue: 'fr-FR'},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    TaskRefreshService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default)
  }
}
