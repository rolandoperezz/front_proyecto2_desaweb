import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { EquiposComponent} from '../equipos/equipos.component';
import { PartidosComponent } from '../partidos/partidos.component';
import { JugadoresComponent } from '../jugadores/jugadores.component';
import { VerpartidosComponent } from '../verpartidos/verpartidos.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  role: string | null = null;
  username: string | null = null;

  sidebarOpen = true;
  items: MenuItem[] = [];
  activeKey: string | null = null;

  /** Registro: clave -> componente a renderizar */
  componentsMap: Record<string, Type<any>> = {
    equipos: EquiposComponent,
    jugadores: JugadoresComponent,
    partidos: PartidosComponent,
    verPartidos: VerpartidosComponent,
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.role = (localStorage.getItem('role') || '').trim();
    this.username = localStorage.getItem('username') || 'Invitado';

    this.buildMenu();
  }

  private buildMenu() {
    const admin = this.role?.toLowerCase() === 'administrador';

    if (admin) {
      this.items = [
        {
          label: 'Administración',
          items: [
            { label: 'Equipos',   icon: 'pi pi-sitemap',    command: () => this.select('equipos') },
            { label: 'Jugadores', icon: 'pi pi-users',      command: () => this.select('jugadores') },
            { label: 'Partidos',  icon: 'pi pi-list-check', command: () => this.select('partidos') },
          ]
        }
      ];
      this.activeKey = 'equipos';
    } else {
      this.items = [
        {
          label: 'Menú',
          items: [
            { label: 'Ver Partidos', icon: 'pi pi-calendar', command: () => this.select('verPartidos') }
          ]
        }
      ];
      this.activeKey = 'verPartidos';
    }
  }

  select(key: string) {
    this.activeKey = key;
    if (window.innerWidth < 992) this.sidebarOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
