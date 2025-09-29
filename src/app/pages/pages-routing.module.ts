import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesHomeComponent } from './pages-home/pages-home.component';
import { EquiposComponent } from './equipos/equipos.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { PartidosComponent } from './partidos/partidos.component';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
   {
    path:'',component: PagesHomeComponent,
    children:
    [
      { path: 'equipos', component: EquiposComponent },   
      { path: 'jugadores', component: JugadoresComponent},   
      { path: 'partidos', component: PartidosComponent },   
      { path: 'inicio', component: InicioComponent },   
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
