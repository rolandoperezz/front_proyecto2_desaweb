import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorHomeComponent } from './error-home/error-home.component';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    ErrorHomeComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }
