import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/venta/services/cliente.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ObservacionClienteComponent } from '../../observacion-cliente/observacion-cliente.component';

@Component({
  selector: 'app-listado-cliente-venta',
  templateUrl: './listado-cliente-venta.component.html',
  styleUrls: ['./listado-cliente-venta.component.css']
})
export class ListadoClienteVentaComponent implements OnInit {
  @ViewChild(ObservacionClienteComponent) childobservacioncliente!: ObservacionClienteComponent;
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;
  filterpost = "";

  loadinglistado : boolean = false;
  
  cantidad_registros : number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private clienteservice:ClienteService, private toastr: ToastrService, private error:ErrorService) { 
  }

  ngOnInit(): void {

  }

  keyFiltrado()
  {
    this.page = 1;
  }

  actualizarLista()
  {
    this.listarClientes();
  }

  listarClientes()
  {
    this.loadinglistado = true;

    this.clienteservice.listar().subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  agregar(codigo : String)
  {
      const resultado = this.datos.find( (valor : any) => valor.cod_cliente === codigo );
      this.datosenviar.emit(resultado);
      //console.log(resultado);
  }

  actualizarListadoCliente()
  {
    this.page = 1;
    this.filterpost="";
    this.listarClientes();
    this.toastr.success("Listado de clientes actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  verObservacion(cod_cliente: string, cliente: string)
  {
    this.childobservacioncliente.verObservacion(cod_cliente, cliente);
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}