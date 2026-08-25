import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProveedorService } from 'src/app/compra/services/proveedor.service';
import { AbonoCompraService } from 'src/app/cuentapc/services/abono-compra.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-listado-proveedor',
  templateUrl: './listado-proveedor.component.html',
  styleUrls: ['./listado-proveedor.component.css']
})
export class ListadoProveedorComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;
  filterpost = "";

  cod_proveedor_eliminar : string = "";
  proveedor_eliminar : string = "";

  loadinglistado : boolean = false;
  

  cantidad_registros : Number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private proveedorservice:ProveedorService, private toastr: ToastrService, private error:ErrorService, private abonocompraservice : AbonoCompraService) { 
  }

  ngOnInit(): void {

  }

  keyFiltrado()
  {
    this.page = 1;
  }

  actualizarLista()
  {
    this.listarProveedores();
  }

  listarProveedores()
  {
    this.loadinglistado = true;
    

    this.proveedorservice.listar().subscribe( (data : any) =>
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
      const resultado = this.datos.find( (valor : any) => valor.cod_proveedor === codigo );
      this.datosenviar.emit(resultado);
      //console.log(resultado);
  }

  listarproveedoresporpagar(cod_sucursal: string)
  {
    this.loadinglistado = true;
    

    this.abonocompraservice.listarProveedoresPorPagar(cod_sucursal).subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  actualizarListadoProveedor()
  {
    this.page = 1;
    this.filterpost="";
    this.listarProveedores();
    this.toastr.success("Listado de proveedores actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}