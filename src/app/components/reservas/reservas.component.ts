import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { ClienteService } from '../../services/cliente.service';
import { DestinoService } from '../../services/destino.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private clienteService = inject(ClienteService);
  private destinoService = inject(DestinoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  reservas: any[] = [];
  clientes: any[] = [];
  destinos: any[] = [];
  reservaDialog = false;
  reserva: any = {};
  editando = false;
  estados = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Confirmada', value: 'confirmada' },
    { label: 'Cancelada', value: 'cancelada' }
  ];
loading: unknown;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.reservaService.getReservas().subscribe(data => {
      this.reservas = data;
    });
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = data.map((c: any) => ({
        label: `${c.nombre} ${c.apellido}`,
        value: c.id
      }));
    });
    this.destinoService.getDestinos().subscribe(data => {
      this.destinos = data.map((d: any) => ({
        label: d.nombre,
        value: d.id,
        precio: d.precio
      }));
    });
  }

  nuevaReserva() {
    this.reserva = {
      estado: 'pendiente',
      fecha_inicio: new Date(),
      fecha_fin: new Date()
    };
    this.editando = false;
    this.reservaDialog = true;
  }

  editarReserva(reserva: any) {
    this.reserva = {...reserva};
    this.reserva.fecha_inicio = new Date(reserva.fecha_inicio);
    this.reserva.fecha_fin = new Date(reserva.fecha_fin);
    this.editando = true;
    this.reservaDialog = true;
  }

  guardarReserva() {
    if (this.editando) {
      this.reservaService.actualizarReserva(this.reserva.id, this.reserva).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva actualizada'});
        this.cargarDatos();
        this.reservaDialog = false;
      });
    } else {
      this.reservaService.crearReserva(this.reserva).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva creada'});
        this.cargarDatos();
        this.reservaDialog = false;
      });
    }
  }

  cambiarEstado(id: number, estado: string) {
    this.reservaService.cambiarEstado(id, estado).subscribe(() => {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Estado actualizado'});
      this.cargarDatos();
    });
  }

  eliminarReserva(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta reserva?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.reservaService.eliminarReserva(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Reserva eliminada correctamente'
            });
            this.cargarDatos();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la reserva'
            });
          }
        });
      }
    });
  }
}