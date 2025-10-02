import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  role?: { name: string };
}

export interface EquipoDto {
  id?: number;
  nombre: string;
  ciudad: string;
  logoUrl: string;
}

export interface JugadorDto {
  id?: number;
  nombreCompleto: string;
  numero: number;
  posicion: string;
  estaturaCm: number;
  edad: number;
  nacionalidad: string;
  equipoId: number;
  equipo?: EquipoDto;
}

export interface PartidoDto {
  id: number;
  fechaHora: string; // ISO
  marcadorLocal: number;
  marcadorVisitante: number;
  equipoLocal: EquipoDto;
  equipoVisitante: EquipoDto;
  rosterLocal?: JugadorDto[];
  rosterVisitante?: JugadorDto[];
}

export interface PartidoUpsert {
  fechaHora: string;       // ISO
  equipoLocalId: number;
  equipoVisitanteId: number;
}

export interface MarcadorDto {
  marcadorLocal: number;
  marcadorVisitante: number;
}

export interface RoleDto {
  id: number;
  name: string;
}

export interface UserDto {
  id?: number;
  username: string;
  roleId: number;
  roleName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  // private baseUrl = 'http://localhost:5062/api';
  private baseUrl = '/api'; 


  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/login`, payload).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        if (res.role?.name) localStorage.setItem('role', res.role.name);
        localStorage.setItem('username', res.username);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }

  //Equipos
  list(searchTerm?: string, cityFilter?: string): Observable<EquipoDto[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (cityFilter) params = params.set('cityFilter', cityFilter);
    return this.http.get<EquipoDto[]>(`${this.baseUrl}/Admin/equipos`, { params });
  }

  get(id: number): Observable<EquipoDto> {
    return this.http.get<EquipoDto>(`${this.baseUrl}/Admin/equipos/${id}`);
  }

  create(payload: Omit<EquipoDto, 'id'>): Observable<EquipoDto> {
    return this.http.post<EquipoDto>(`${this.baseUrl}/Admin/equipos`, payload);
  }

  update(id: number, payload: Omit<EquipoDto, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Admin/equipos/${id}`, payload, {
    responseType: 'text' as 'json'   
  });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Admin/equipos/${id}`, {
    responseType: 'text' as 'json'  
  });
  }


  //Jugadores
   getById(id: number): Observable<JugadorDto> {
    return this.http.get<JugadorDto>(`${this.baseUrl}/Admin/jugadores/${id}`);
  }

  listByEquipo(equipoId: number, searchTerm?: string, positionFilter?: string): Observable<JugadorDto[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (positionFilter) params = params.set('cityFilter', positionFilter);
    return this.http.get<JugadorDto[]>(`${this.baseUrl}/Admin/equipos/${equipoId}/jugadores`, { params });
  }

  createJ(payload: Omit<JugadorDto, 'id' | 'equipo'>) {
    return this.http.post<string>(`${this.baseUrl}/Admin/jugadores`, payload, {
      responseType: 'text' as 'json' 
    });
  }

  updateJ(id: number, payload: Omit<JugadorDto, 'id' | 'equipo'>) {
    return this.http.put<string>(`${this.baseUrl}/Admin/jugadores/${id}`, payload, {
      responseType: 'text' as 'json'
    });
  }

  deleteJ(id: number) {
    return this.http.delete<string>(`${this.baseUrl}/Admin/jugadores/${id}`, {
      responseType: 'text' as 'json'
    });
  }


  //Partidos
  listP(startDate?: string, endDate?: string): Observable<PartidoDto[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate)   params = params.set('endDate', endDate);
    return this.http.get<PartidoDto[]>(`${this.baseUrl}/Admin/partidos`, { params });
  }

  getP(id: number): Observable<PartidoDto> {
    return this.http.get<PartidoDto>(`${this.baseUrl}/Admin/partidos/${id}`);
  }

  createP(payload: PartidoUpsert) {
    return this.http.post<string>(`${this.baseUrl}/Admin/partidos`, payload, {
      responseType: 'text' as 'json' // text/plain en backend
    });
  }

  updateP(id: number, payload: PartidoUpsert) {
    return this.http.put<string>(`${this.baseUrl}/Admin/partidos/${id}`, payload, {
      responseType: 'text' as 'json'
    });
  }

  deleteP(id: number) {
    return this.http.delete<string>(`${this.baseUrl}/Admin/partidos/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  setRoster(partidoId: number, equipoId: number, jugadorIds: number[]) {
    return this.http.post<string>(`${this.baseUrl}/Admin/partidos/${partidoId}/roster/equipo/${equipoId}`, jugadorIds, {
      responseType: 'text' as 'json'
    });
  }

  updateScore(id: number, payload: MarcadorDto) {
    return this.http.put<string>(`${this.baseUrl}/Admin/partidos/${id}/marcador`, payload, {
      responseType: 'text' as 'json'
    });
  }


  //publicos
        listPublicPartidos(startDate?: string, endDate?: string) {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate);
        if (endDate)   params = params.set('endDate', endDate);
        return this.http.get<PartidoDto[]>(`${this.baseUrl}/Partidos`, { params });
      }

      // Detalle público por id
      getPublicPartido(id: number) {
        return this.http.get<PartidoDto>(`${this.baseUrl}/Partidos/${id}`);
      }

      // Actualizar marcador (público)
      updatePublicScore(id: number, payload: MarcadorDto) {
        return this.http.put<string>(`${this.baseUrl}/Partidos/${id}/marcador`, payload, {
          responseType: 'text' as 'json'
        });
      }

      getRoles() {
  return this.http.get<RoleDto[]>(`${this.baseUrl}/Auth/roles`);
}

createRole(payload: { name: string }) {
  return this.http.post<void>(`${this.baseUrl}/Auth/roles`, payload, {
    responseType: 'text' as 'json' // por si devuelve text/plain
  });
}

updateRole(id: number, payload: { name: string }) {
  return this.http.put<void>(`${this.baseUrl}/Auth/roles/${id}`, payload, {
    responseType: 'text' as 'json'
  });
}

deleteRole(id: number) {
  return this.http.delete<void>(`${this.baseUrl}/Auth/roles/${id}`, {
    responseType: 'text' as 'json'
  });
}

// USUARIOS
      getUsers() {
        return this.http.get<UserDto[]>(`${this.baseUrl}/Auth/users`);
      }

      getUser(id: number) {
        return this.http.get<UserDto>(`${this.baseUrl}/Auth/users/${id}`);
      }

      // Crear usuario
      register(payload: { username: string; password: string; roleId: number }) {
        return this.http.post<void>(`${this.baseUrl}/Auth/register`, payload, {
          responseType: 'text' as 'json'
        });
      }

      // Editar usuario
      updateUser(id: number, payload: { username: string; roleId: number }) {
        return this.http.put<void>(`${this.baseUrl}/Auth/users/${id}`, payload, {
          responseType: 'text' as 'json'
        });
      }

      // Eliminar usuario
      deleteUser(id: number) {
        return this.http.delete<void>(`${this.baseUrl}/Auth/users/${id}`, {
          responseType: 'text' as 'json'
        });
      }

      // Cambiar contraseña
      changePassword(id: number, payload: { newPassword: string }) {
        return this.http.put<void>(`${this.baseUrl}/Auth/users/${id}/change-password`, payload, {
          responseType: 'text' as 'json'
        });
      }
}
