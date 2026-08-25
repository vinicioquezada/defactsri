import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-listado-vendedor',
  templateUrl: './listado-vendedor.component.html',
  styleUrls: ['./listado-vendedor.component.css']
})
export class ListadoVendedorComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;
  filterpost = "";

  cod_empleado_eliminar : string = "";
  empleado_eliminar : string = "";

  loadinglistado : boolean = false;
  

  cantidad_registros : Number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private empleadoservice:EmpleadoService, private toastr: ToastrService, private error:ErrorService) { 
  }

  ngOnInit(): void {
    
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  actualizarLista()
  {
    this.listarEmpleadosVendedores();
  }

  listarEmpleadosVendedores()
  {
    this.loadinglistado = true;
    
    this.empleadoservice.listarEmpleadosVendedores().subscribe( (data : any) =>
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
      const resultado = this.datos.find( (valor : any) => valor.cod_empleado === codigo );
      this.datosenviar.emit(resultado);
      //console.log(resultado);
  }

  actualizarListadoEmpleado()
  {
    this.page = 1;
    this.filterpost="";
    this.listarEmpleadosVendedores();
    this.toastr.success("Listado de empleados actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}