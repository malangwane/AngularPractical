import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertListComponent } from './advert-list.component';
import { RouterModule } from '@angular/router';
import { AdvertListGuard } from '../guards/advert-list.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AdvertListComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'advert-list/:id', 
      canActivate: [AdvertListGuard],
        component: AdvertListComponent },
    ])  
  ]
})
export class AdvertModule { }
