import { Component, OnInit } from '@angular/core';

import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CajeroService } from '../../services/cajero.service';

import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-cajero',
  templateUrl: './explorador-cajero.component.html',
  styleUrls: ['./explorador-cajero.component.css']
})
export class ExploradorCajeroComponent implements OnInit {
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  loadinglistado : boolean = false;
  
  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private cajeroservice:CajeroService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
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

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarCierresCajas();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    this.datos = [];
  }
 
  listarCierresCajas()
  {
    this.page = 1;
    this.filterpost="";
    
    this.loadinglistado = true;
    

    this.cajeroservice.listarCierresCajas(this.fechadesde, this.fechahasta, this.cod_sucursal).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarSucursales()
  {
    this.datossucursal = [];
    this.loadinglistado = true;
    
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  visualizar(cod_cajero : string)
  {	 
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/resumencaja?cod_cajero=" + cod_cajero + "&cod_sucursal=" + this.cod_sucursal, "", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}