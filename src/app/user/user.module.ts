import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserRegistrationComponent } from './user-registration.component';
import { UserLoginComponent } from './user-login.component';
import { UserRegistrationGuard } from '../guards/user-registration.guard';
import { UserData } from '../data/data';



@NgModule({
  declarations: [
    UserRegistrationComponent,
    UserLoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InMemoryWebApiModule.forRoot(UserData),
    RouterModule.forChild([
      { path: 'user-registration',
        canDeactivate: [UserRegistrationGuard], 
        component: UserRegistrationComponent},
      { path: 'user-login', component: UserLoginComponent}
  ])  
  ]
})
export class UserModule { }
