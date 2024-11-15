import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {
  private readonly API_URL = 'http://localhost:3000/api/destinos';
  private http = inject(HttpClient);

  getDestinos(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  crearDestino(destino: any): Observable<any> {
    return this.http.post(this.API_URL, destino);
  }

  actualizarDestino(id: number, destino: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, destino);
  }

  eliminarDestino(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}