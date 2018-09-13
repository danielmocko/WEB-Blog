import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent} from './components/home/home.component';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { RegistrationComponent} from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotAuthGuard} from './guards/notAuth.guard';
import { AuthGuard } from './guards/auth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/delete-blog/delete-blog.component';

const appRoutes:Routes =[
  {path:'',component: HomeComponent},
  {path:'dashboard',component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'register',component:RegistrationComponent, canActivate:[NotAuthGuard]},
  {path:'login',component:LoginComponent, canActivate:[NotAuthGuard]},
  {path:'profile',component:ProfileComponent, canActivate:[AuthGuard]},
  {path:'blog',component:BlogComponent,canActivate:[AuthGuard]},
  {path:'edit-blog/:id',component:EditBlogComponent,canActivate:[AuthGuard]},
  {path: 'delete-blog/:id',component:DeleteBlogComponent,canActivate:[AuthGuard]},
  {path:'**', component: HomeComponent},
];


@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports:[RouterModule]
  })
  
  export class AppRoutingModule { }
  