import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PuertaDiarioService } from 'src/app/gym/services/puerta-diario.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MonitorLocalService } from 'src/app/gym/services/monitor-local.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-listado-apertura-diario',
  templateUrl: './listado-apertura-diario.component.html',
  styleUrls: ['./listado-apertura-diario.component.css']
})
export class ListadoAperturaDiarioComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;
  filterpost = "";

  cod_empleado_eliminar : string = "";
  empleado_eliminar : string = "";

  loadinglistado : boolean = false;
  
  cantidad_registros : Number = 0;

  cod_sucursal: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private puertadiarioservice: PuertaDiarioService, private monitorlocalservice: MonitorLocalService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService) { 
  }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  listarPuertaDiario()
  {
    this.loadinglistado = true;
    
    this.puertadiarioservice.listarPuertaDiario(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  clickAbrirPuerta(item : any)
  {
    if(item.cantidad_ingreso>=item.cantidad)
    {
      this.toastr.error("No se puede abrir la puerta porque se completó los diarios pagados en la venta", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      Swal.fire({
        title: 'DESEA ABRIR PUERTA',
        text: 'Confirmar para abrir la puerta con el pago seleccionado',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Abrir',
        cancelButtonText: 'No, Abrir'
      }).then((result) => {
        if (result.value) {
          this.abrirPuerta(item.cod_puerta_diario);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
    }
      
  }

  abrirPuerta(cod_puerta_diario : string)
  {
    this.loadinglistado = true;
    const parametros = {
      "cod_puerta_diario" : cod_puerta_diario,
      "cantidad_ingreso" : 1
    }
    this.puertadiarioservice.abrirPuerta(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      if(data.estado==1)
      {
        this.datos = this.datos.map(item =>
          item.cod_puerta_diario == cod_puerta_diario
            ? { ...item, cantidad_ingreso: item.cantidad_ingreso + 1 }
            : item
        );
        this.abrirPuertaDispositivo();
      }
      else
      {
        this.toastr.error("Error al conectar con el servidor", "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  abrirPuertaDispositivo()
  {
    this.monitorlocalservice.abrirPuerta().subscribe( (data : any) =>
    {
      this.mantenerPuertaSiempreCerrada();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  mantenerPuertaSiempreCerrada()
  {
    this.monitorlocalservice.mantenerPuertaSiempreCerrada().subscribe( (data : any) =>
    {
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  actualizarPuertaDiario()
  {
    this.page = 1;
    this.filterpost="";
    this.listarPuertaDiario();
    this.toastr.success("Listado de empleados actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}