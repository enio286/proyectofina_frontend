import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DestinoService } from '../../services/destino.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-destinos',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.css']
})
export class DestinosComponent implements OnInit {
  private destinoService = inject(DestinoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  destinos: any[] = [];
  destinoSeleccionado: any = null;
  mostrarDialogo = false;
  editando = false;
  destinoDialog = false;
  destino: any = {};

  ngOnInit() {
    this.cargarDestinos();
  }

  cargarDestinos() {
    this.destinoService.getDestinos().subscribe(data => {
      this.destinos = data;
    });
  }

  nuevoDestino() {
    this.destino = {};
    this.editando = false;
    this.destinoDialog = true;
  }

  editarDestino(destino: any) {
    this.destino = {...destino};
    this.editando = true;
    this.destinoDialog = true;
  }

  guardarDestino() {
    if (this.editando) {
      this.destinoService.actualizarDestino(this.destino.id, this.destino).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Destino actualizado'});
        this.cargarDestinos();
        this.destinoDialog = false;
      });
    } else {
      this.destinoService.crearDestino(this.destino).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Destino creado'});
        this.cargarDestinos();
        this.destinoDialog = false;
      });
    }
  }

  seleccionarDestino(destino: any) {
    this.destinoSeleccionado = destino;
    this.mostrarDialogo = true;
  }

  eliminarDestino(id: number) {
    console.log('Intentando eliminar destino con ID:', id);
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este destino?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        console.log('Confirmación aceptada, procediendo a eliminar');
        this.destinoService.eliminarDestino(id).subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Destino eliminado correctamente'
            });
            this.cargarDestinos();
          },
          error: (error) => {
            console.error('Error detallado:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el destino'
            });
          }
        });
      }
    });
  }
}