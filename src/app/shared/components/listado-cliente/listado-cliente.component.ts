import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ClienteService } from 'src/app/venta/services/cliente.service';
import { AbonoVentaService } from 'src/app/cuentapc/services/abono-venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-cliente',
  templateUrl: './listado-cliente.component.html',
  styleUrls: ['./listado-cliente.component.css']
})
export class ListadoClienteComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;
  filterpost = "";

  cod_cliente_eliminar : string = "";
  cliente_eliminar : string = "";

  loadinglistado : boolean = false;
  

  cantidad_registros : number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private clienteservice:ClienteService, private toastr: ToastrService, private error:ErrorService, private abonoventaservice : AbonoVentaService) { 
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
    

    this.clienteservice.listarClientesBasico().subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  listarClientesPorCobrar(cod_sucursal: string)
  {
    this.loadinglistado = true;
    

    this.abonoventaservice.listarClientesPorCobrar(cod_sucursal).subscribe( (data : any) =>
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

  handlePageChange(event: number): void {
    this.page = event;
  }
}