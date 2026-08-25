import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { IngresoMercaderiaService } from '../../services/ingreso-mercaderia.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { KardexService } from 'src/app/kardex/services/kardex.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-ingreso-mercaderia',
  templateUrl: './explorador-ingreso-mercaderia.component.html',
  styleUrls: ['./explorador-ingreso-mercaderia.component.css']
})
export class ExploradorIngresoMercaderiaComponent implements OnInit {
  
  opcionesmenu : any;
  multisucursal : string = "0";
  kardex : string = "";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  numero_ingreso : string = "";
  cod_ingreso_mercaderia : string = "";

  loadinglistado : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnanular : boolean = false;

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private ingresomercaderiaservice:IngresoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private kardexservice: KardexService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
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
	  this.router.navigate(["/menualmacen/ingresomercaderia/visualizarregistro", this.cod_ingreso_mercaderia]);
  }

  imprimir()
  {
	  window.open(this.configService.settings.baseUrl + "/reportes/almacen/ingresomercaderia?codingresomercaderia=" + this.cod_ingreso_mercaderia + "&numero_ingreso=" + this.numero_ingreso, "width=800, height=500");
  }

  editar()
  {
    this.mantenerEstados();
	  this.router.navigate(["/menualmacen/ingresomercaderia/actualizarregistro", this.cod_ingreso_mercaderia]);
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarIngresosMercaderias(1);
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(cod_ingreso_mercaderia: string, numero_ingreso: string, estado: string)
  {
    this.cod_ingreso_mercaderia = cod_ingreso_mercaderia;
    this.numero_ingreso = numero_ingreso;

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

  clickRegistroCaducidad()
  {
    this.mantenerEstados();
    this.router.navigate(["/menualmacen/registrocaducidadingreso", this.cod_ingreso_mercaderia]);
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_ingreso_mercaderia");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }


  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.cod_sucursal = "";
    this.sucursal = "";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.numero_ingreso = "";
    this.cod_ingreso_mercaderia = "";

    this.listarSucursales();

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedestado = sessionStorage.getItem("estado");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_ingreso_mercaderia") {
      this.cod_sucursal = savedcodsucursal;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      this.listarIngresosMercaderias(savedpage);
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
 
  listarIngresosMercaderias(page: number)
  {
    this.page = page;
    this.filterpost = "";

    this.loadinglistado = true;
    

    this.ingresomercaderiaservice.listarIngresosMercaderias(this.cod_sucursal, this.fechadesde, this.fechahasta).subscribe( (data : any) =>
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
        title: 'ANULAR INGRESO Nº '  + this.numero_ingreso,
        text: 'Confirmar para anular el registro seleccionado',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Anular',
        cancelButtonText: 'No, Anular'
      }).then((result) => {
        if (result.value) {
          if(this.kardex=="1")
          {
            this.verificarSalidasKardex();
          }
          else
          {
            this.anularIngresoMercaderia();
          }
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

  verificarSalidasKardex()
  {
    this.loadinglistado = true;

    this.kardexservice.verificarSalidasKardex(this.cod_ingreso_mercaderia, "INGRESO", 0).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      
      if (data.estado == true)
      {
        if(data.diferencias == 0)
        {
          this.anularIngresoMercaderia();
        }
        else
        {
          this.toastr.error("No es posible anular el ingreso de mercadería porque ya existen movimientos de salida, en ese caso debe modificar unicamente el registro de ingreso del producto o ajustar el kardex", "INFORMACIÓN DEL SISTEMA");
        }
      }
      else
      {
        this.toastr.error("No se pudo consultar en el kardex el movimiento, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  anularIngresoMercaderia()
  {
    this.loadinglistado = true;

    const parametros = {
      'cod_ingreso_mercaderia' : this.cod_ingreso_mercaderia,
      'kardex' : this.kardex
    };

    this.ingresomercaderiaservice.anularIngresoMercaderia(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      

      if (data.estado == true)
      {
        this.datos.find((x:any) => x.cod_ingreso_mercaderia == this.cod_ingreso_mercaderia).estado = 'ANULADA';
        this.formularioNormal();        
        this.toastr.success("Registro anulado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodalopciones").modal("hide");
      }
      else
      {
        this.toastr.error("Registro no se pudo anular Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
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