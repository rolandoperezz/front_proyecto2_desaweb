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


@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  private baseUrl = 'http://localhost:5062'; 

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/Auth/login`, payload).pipe(
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
    return this.http.get<EquipoDto[]>(`${this.baseUrl}/api/Admin/equipos`, { params });
  }

  get(id: number): Observable<EquipoDto> {
    return this.http.get<EquipoDto>(`${this.baseUrl}/api/Admin/equipos/${id}`);
  }

  create(payload: Omit<EquipoDto, 'id'>): Observable<EquipoDto> {
    return this.http.post<EquipoDto>(`${this.baseUrl}/api/Admin/equipos`, payload);
  }

  update(id: number, payload: Omit<EquipoDto, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/Admin/equipos/${id}`, payload, {
    responseType: 'text' as 'json'   
  });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/Admin/equipos/${id}`, {
    responseType: 'text' as 'json'  
  });
  }


  //Jugadores
   getById(id: number): Observable<JugadorDto> {
    return this.http.get<JugadorDto>(`${this.baseUrl}/api/Admin/jugadores/${id}`);
  }

  listByEquipo(equipoId: number, searchTerm?: string, positionFilter?: string): Observable<JugadorDto[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (positionFilter) params = params.set('cityFilter', positionFilter);
    return this.http.get<JugadorDto[]>(`${this.baseUrl}/api/Admin/equipos/${equipoId}/jugadores`, { params });
  }

  createJ(payload: Omit<JugadorDto, 'id' | 'equipo'>) {
    return this.http.post<string>(`${this.baseUrl}/api/Admin/jugadores`, payload, {
      responseType: 'text' as 'json' 
    });
  }

  updateJ(id: number, payload: Omit<JugadorDto, 'id' | 'equipo'>) {
    return this.http.put<string>(`${this.baseUrl}/api/Admin/jugadores/${id}`, payload, {
      responseType: 'text' as 'json'
    });
  }

  deleteJ(id: number) {
    return this.http.delete<string>(`${this.baseUrl}/api/Admin/jugadores/${id}`, {
      responseType: 'text' as 'json'
    });
  }
}
