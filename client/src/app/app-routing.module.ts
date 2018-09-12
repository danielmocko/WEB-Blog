import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent} from './components/home/home.component';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { RegistrationComponent} from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';


const appRoutes:Routes =[
  {path:'',component: HomeComponent},
  {path:'dashboard',component: DashboardComponent},
  {path:'register',component:RegistrationComponent},
  {path:'login',component:LoginComponent},
  {path:'profile',component:ProfileComponent},
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
  