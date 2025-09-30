import { Component, OnInit, Type, HostListener } from '@angular/core';
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

  // estado del sidebar
  sidebarOpen = true;         // visible u oculto
  isMobile = false;           // ayuda para comportamiento overlay en móvil

  items: MenuItem[] = [];
  activeKey: string | null = null;

  componentsMap: Record<string, Type<any>> = {
    equipos: EquiposComponent,
    jugadores: JugadoresComponent,
    partidos: PartidosComponent,
    verPartidos: VerpartidosComponent,
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigateByUrl('/login'); return; }

    this.role = (localStorage.getItem('role') || '').trim();
    this.username = localStorage.getItem('username') || 'Invitado';

    this.isMobile = window.innerWidth < 992; // ~ md breakpoint
    this.sidebarOpen = !this.isMobile;       // por defecto: abierto en desktop, oculto en móvil
    this.buildMenu();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      // en desktop deja el estado como esté; si vienes de móvil cerrado, puedes querer abrirlo
      // quítalo si prefieres mantener el estado
    }
  }

  private buildMenu() {
    const admin = this.role?.toLowerCase() === 'administrador';

    const comunes: MenuItem[] = [
      {
        label: 'Menu',
        items: [
          { label: 'Ver Partidos', icon: 'pi pi-calendar', command: () => this.select('verPartidos') },
        ]
      }
    ];

    const adminItems: MenuItem[] = admin ? [
      {
        label: 'Administración',
        items: [
          { label: 'Equipos',    icon: 'pi pi-sitemap',    command: () => this.select('equipos') },
          { label: 'Jugadores',  icon: 'pi pi-users',      command: () => this.select('jugadores') },
          { label: 'Partidos',   icon: 'pi pi-list-check', command: () => this.select('partidos') },
        ]
      }
    ] : [];

    this.items = admin ? adminItems : comunes;
    this.activeKey = admin ? 'equipos' : 'verPartidos';
  }

  select(key: string) {
    this.activeKey = key;
    if (this.isMobile) this.sidebarOpen = false; // cierra al elegir en móvil
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    if (this.isMobile) this.sidebarOpen = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
