import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth',  loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)},
  { path: 'pages',  loadChildren:()=>import('./pages/pages.module').then(m=>m.PagesModule)},
  { path: 'Error', loadChildren:()=>import('./error/error.module').then(m=>m.ErrorModule) },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
