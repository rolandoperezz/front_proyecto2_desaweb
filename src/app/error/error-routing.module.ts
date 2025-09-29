import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorHomeComponent } from './error-home/error-home.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
    {
    path:'',component: ErrorHomeComponent,
    children:
    [
      { path: 'Error', component: ErrorComponent },     //Data
      { path: '**', redirectTo: 'Error', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
