import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, Directive, Pipe } from '@angular/core';
import { AppRoutingModule} from './app-routing.module'; 
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { HttpModule} from '@angular/http';
import { AuthorizationService } from './services/authorization.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { BlogService } from './services/blog.service';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    DeleteBlogComponent,
    PublicProfileComponent,
    PublicProfileComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    HttpModule,
  
  ],
  providers: [
    AuthorizationService,
    AuthGuard,
    NotAuthGuard,
    BlogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
