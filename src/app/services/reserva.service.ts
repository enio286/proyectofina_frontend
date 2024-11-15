import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private readonly API_URL = 'http://localhost:3000/api/reservas';
  private http = inject(HttpClient);

  getReservas(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(this.API_URL, reserva);
  }

  actualizarReserva(id: number, reserva: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, reserva);
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/estado`, { estado });
  }

  eliminarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}