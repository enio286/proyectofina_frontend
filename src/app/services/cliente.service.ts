import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly API_URL = 'http://localhost:3000/api/clientes';
  private http = inject(HttpClient);

  getClientes(): Observable<any> {
    return this.http.get(this.API_URL).pipe(
      catchError(error => {
        console.error('Error al obtener clientes:', error);
        return throwError(() => error);
      })
    );
  }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post(this.API_URL, cliente);
  }

  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}