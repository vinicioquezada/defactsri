import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { SalidaMercaderiaService } from '../../services/salida-mercaderia.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-salida-mercaderia',
  templateUrl: './explorador-salida-mercaderia.component.html',
  styleUrls: ['./explorador-salida-mercaderia.component.css']
})
export class ExploradorSalidaMercaderiaComponent implements OnInit {
  multisucursal : string = "0";
  kardex : string = "";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  numero_salida : string = "";
  cod_salida_mercaderia : string = "";

  loadinglistado : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnanular : boolean = false;

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private salidamercaderiaservice: SalidaMercaderiaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.kardex = this.usersession.getConfiguracion("kardex");
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

  visualizar()
  {
    this.mantenerEstados();	 
	  this.router.navigate(["/menualmacen/salidamercaderia/visualizarregistro", this.cod_salida_mercaderia]);
  }

  imprimir()
  {	 
	  window.open(this.configService.settings.baseUrl + "/reportes/almacen/salidamercaderia?codsalidamercaderia=" + this.cod_salida_mercaderia + "&numero_salida=" + this.numero_salida, "width=800, height=500");
  }

  editar()
  {
    this.mantenerEstados();
	  this.router.navigate(["/menualmacen/salidamercaderia/actualizarregistro", this.cod_salida_mercaderia]);
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_salida_mercaderia");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarSalidasMercaderias(1);
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(cod_salida_mercaderia: string, numero_salida: string, estado: string)
  {
    this.cod_salida_mercaderia = cod_salida_mercaderia;
    this.numero_salida = numero_salida;

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
   
    this.numero_salida = "";
    this.cod_salida_mercaderia = "";

    this.listarSucursales();

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedestado = sessionStorage.getItem("estado");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_salida_mercaderia") {
      this.cod_sucursal = savedcodsucursal;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      this.listarSalidasMercaderias(savedpage);
    }
    else
    {
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
    }
  }
 
  listarSalidasMercaderias(page: number)
  {
    this.page = page;
    this.filterpost="";
    
    this.loadinglistado = true;
    

    this.salidamercaderiaservice.listarSalidasMercaderias(this.cod_sucursal, this.fechadesde, this.fechahasta).subscribe( (data : any) =>
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
      title: 'ANULAR SALIDA Nº '  + this.numero_salida,
      text: 'Confirmar para anular el registro seleccionado',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, Anular'
    }).then((result) => {
      if (result.value) {
        this.anularSalidaMercaderia();
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

  anularSalidaMercaderia()
  {
    this.loadinglistado = true;
    const parametros = {
      'cod_salida_mercaderia' : this.cod_salida_mercaderia,
      'kardex' : this.kardex
    };
    this.salidamercaderiaservice.anularSalidaMercaderia(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      if (data.estado == true)
      {
        this.datos.find((x:any) => x.cod_salida_mercaderia == this.cod_salida_mercaderia).estado = 'ANULADA';
        this.formularioNormal();        
        this.toastr.success("Registro anulado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodalopciones").modal("hide");
      }
      else
      {
        this.toastr.error("Registro no se pudo anular, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}