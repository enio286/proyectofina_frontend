import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    DialogModule, 
    InputTextModule, 
    FormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  clientes: any[] = [];
  clienteDialog = false;
  cliente: any = {};
  editando = false;
  loading = true;

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes recibidos:', data);
        this.clientes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes'
        });
        this.loading = false;
      }
    });
  }

  nuevoCliente() {
    this.cliente = {};
    this.editando = false;
    this.clienteDialog = true;
  }

  editarCliente(cliente: any) {
    this.cliente = {...cliente};
    this.editando = true;
    this.clienteDialog = true;
  }

  guardarCliente() {
    if (this.editando) {
      this.clienteService.actualizarCliente(this.cliente.id, this.cliente).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Cliente actualizado'});
        this.cargarClientes();
        this.clienteDialog = false;
      });
    } else {
      this.clienteService.crearCliente(this.cliente).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Cliente creado'});
        this.cargarClientes();
        this.clienteDialog = false;
      });
    }
  }

  eliminarCliente(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.clienteService.eliminarCliente(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cliente eliminado correctamente'
            });
            this.cargarClientes();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el cliente'
            });
          }
        });
      }
    });
  }
}