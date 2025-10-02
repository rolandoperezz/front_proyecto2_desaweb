import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { EquiposComponent } from './equipos/equipos.component';
import { PartidosComponent } from './partidos/partidos.component';
import { PagesHomeComponent } from './pages-home/pages-home.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { InicioComponent } from './inicio/inicio.component';
import { VerpartidosComponent } from './verpartidos/verpartidos.component';

import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { RolesComponent } from './roles/roles.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
@NgModule({
  declarations: [
    EquiposComponent,
    PartidosComponent,
    PagesHomeComponent,
    JugadoresComponent,
    InicioComponent,
    VerpartidosComponent,
    RolesComponent,
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    PanelMenuModule,
    ButtonModule,
    AvatarModule,
    RippleModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ToolbarModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    MultiSelectModule,
    InputNumberModule

  ],
  providers: [MessageService]
})
export class PagesModule { }
