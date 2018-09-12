import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule} from './app-routing.module'; 
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpModule} from '@angular/http';
import { AuthorizationService } from './services/authorization.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    HttpModule
  ],
  providers: [AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
