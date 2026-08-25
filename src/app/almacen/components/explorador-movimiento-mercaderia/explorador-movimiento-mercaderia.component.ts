import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { MovimientoMercaderiaService } from '../../services/movimiento-mercaderia.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-movimiento-mercaderia',
  templateUrl: './explorador-movimiento-mercaderia.component.html',
  styleUrls: ['./explorador-movimiento-mercaderia.component.css']
})
export class ExploradorMovimientoMercaderiaComponent implements OnInit {
  multisucursal : string = "0";
  kardex : string = "";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  cod_sucursal_receptar : string = "";
  sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  numero_movimiento : string = "";
  cod_movimiento_mercaderia : string = "";

  loadinglistado : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnanular : boolean = false;

  control_estricto_movimiento : string = "";

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private movimientomercaderiaService:MovimientoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.control_estricto_movimiento = this.usersession.getConfiguracion("control_estricto_movimiento");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  imprimir()
  {	 
	  window.open(this.configService.settings.baseUrl + "/reportes/almacen/movimientomercaderia?codmovimientomercaderia=" + this.cod_movimiento_mercaderia, "width=800, height=500");
  }

  editar()
  {	 
	  this.router.navigate(["/menualmacen/movimientomercaderia/actualizarregistro/", this.cod_movimiento_mercaderia]);
  }

  visualizar()
  {	 
	  this.router.navigate(["/menualmacen/movimientomercaderia/visualizarregistro/", this.cod_movimiento_mercaderia]);
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarMovimientosMercaderias();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(cod_movimiento_mercaderia: string, numero_movimiento: string, cod_sucursal_receptar: string, estado: string)
  {
    this.cod_movimiento_mercaderia = cod_movimiento_mercaderia;
    this.numero_movimiento = numero_movimiento;
    this.cod_sucursal_receptar = cod_sucursal_receptar;

    if(estado=="CREADA")
    {
      this.disabledbtneditar = false;
      this.disabledbtnanular = false;
    }

    if(estado=="ANULADA")
    {
      this.disabledbtneditar = true;
      this.disabledbtnanular = true;
    }
   
    $("#mymodalopciones").modal("show");
  }


  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.cod_sucursal = "";
    this.sucursal = "";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.numero_movimiento = "";
    this.cod_movimiento_mercaderia = "";

    this.listarSucursales();
  }
 
  listarMovimientosMercaderias()
  {
    this.page = 1;
    this.filterpost="";
    
    this.loadinglistado = true;
    

    this.movimientomercaderiaService.listarMovimientosMercaderias(this.cod_sucursal, this.fechadesde, this.fechahasta).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  clickAnular()
  {
    Swal.fire({
      title: 'ANULAR MOVIMIENTO Nº  '  + this.numero_movimiento,
      text: 'Confirmar para anular el registro seleccionado',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, Anular'
    }).then((result) => {
      if (result.value) {
        this.anularMovimientoMercaderia();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  listarSucursales()
  {    
    this.loadinglistado = true;
    

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  anularMovimientoMercaderia = () =>{

    this.loadinglistado = true;

    const parametros = {
      'cod_movimiento_mercaderia' : this.cod_movimiento_mercaderia,
      'cod_sucursal' : this.cod_sucursal,
      'cod_sucursal_receptar' : this.cod_sucursal_receptar,
      'control_estricto_movimiento' : this.control_estricto_movimiento,
      'kardex' : this.kardex
    };

    this.movimientomercaderiaService.anularMovimientoMercaderia(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      

      if (data.estado == true)
      {
        this.datos.find((x:any) => x.cod_movimiento_mercaderia == this.cod_movimiento_mercaderia).estado = 'ANULADA';
        this.formularioNormal();        
        this.toastr.success("Registro anulado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodalopciones").modal("hide");
      }
      else
      {
        this.toastr.error("Registro no se pudo anular, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
  });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}