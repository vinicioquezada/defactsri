import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { EliminacionProductoService } from '../../services/eliminacion-producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-eliminacion-producto',
  templateUrl: './eliminacion-producto.component.html',
  styleUrls: ['./eliminacion-producto.component.css']
})
export class EliminacionProductoComponent implements OnInit {
  
  opcionesmenu : any;
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  loadinglistado : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnanular : boolean = false;

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private eliminacionproductoservice:EliminacionProductoService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
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

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarSolicitudesEliminacion(1);
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

    this.cod_sucursal = "";
    this.sucursal = "";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.listarSucursales();
  }
 
  listarSolicitudesEliminacion(page: number)
  {
    this.page = page;
    this.filterpost = "";

    this.loadinglistado = true;
    

    this.eliminacionproductoservice.listarSolicitudesEliminacion(this.fechadesde, this.fechahasta, this.cod_sucursal).subscribe( (data : any) =>
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

  handlePageChange(event: number): void {
    this.page = event;
  }

}