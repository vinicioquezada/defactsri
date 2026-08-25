import { Component, OnInit, ViewChild } from '@angular/core';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { Location } from '@angular/common';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { AsignacionRucComponent } from './asignacion-ruc/asignacion-ruc.component';
import { LogoSucursalComponent } from './logo-sucursal/logo-sucursal.component';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ConfiguracionServicioComponent } from './configuracion-servicio/configuracion-servicio.component';
import { SucursalFormComponent } from './sucursal-form/sucursal-form.component';
declare var $:any;

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css']
})
export class SucursalComponent implements OnInit {
  @ViewChild(AsignacionRucComponent) childasignacionruc!: AsignacionRucComponent;
  @ViewChild(LogoSucursalComponent) childlogosucursal!: LogoSucursalComponent;
  @ViewChild(ConfiguracionServicioComponent) childconfiguracionservicio!: ConfiguracionServicioComponent;
  @ViewChild(SucursalFormComponent) childsucursalform!: SucursalFormComponent;
  status: string = "";
  datossucursal : any = [];
  cod_sucursal: string = "";
  sucursal: string = "";
  urllogo : string = "";
  versionlogo: any = new Date().getTime();

  constructor(private usersession: UserSessionService, private location: Location, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private swalservice: SwalService, private router : Router, private configService: ConfigService) { }

  ngOnInit(): void {
    this.urllogo = this.configService.settings.baseUrl + "/images/";
    this.status = this.usersession.getConfiguracion("status");

    if(this.status != "1")
    {
      this.location.back();
    }
    else
    {
      this.listarSucursalesGenerales();
    }
  }

  async listarSucursalesGenerales(): Promise<void> {
    this.swalservice.iniciarLoading("Cargando...");

    try {
      const data = await firstValueFrom(this.sucursalesservice.listarSucursalesGenerales());
      this.datossucursal = data;
     
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.swalservice.close();
    }
  }

  activar = (cod_sucursal: number, valor_estado: number) =>{
    let mensaje: string = "";
    if(valor_estado==1)
    {
      mensaje = "habilitado";
    }
    else
    {
      mensaje = "deshabilitado";
    }

    this.swalservice.iniciarLoading("Actualizando...");

    const parametros = {
      'cod_sucursal' : cod_sucursal,
      'estado' : valor_estado,
    };

    this.sucursalesservice.activarSucursal(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      
      if (data.estado == true)
      {
        if(valor_estado==1)
        {
          this.datossucursal.find((x:any) => x.cod_sucursal === cod_sucursal).estado = 1;
        }
        else
        {
          this.datossucursal.find((x:any) => x.cod_sucursal === cod_sucursal).estado = 0;
        }
        this.toastr.success("Registro " + mensaje + " satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo " + mensaje + ", vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
  });

  }

  async editar(cod_sucursal: string)
  {
    $("#mymodalformsucursal").modal("show");
    this.childsucursalform.nombreformulario = "EDITAR";
    this.childsucursalform.cod_sucursal = cod_sucursal;
    await this.childsucursalform.buscarSucursal();
    this.childsucursalform.flagocultarboton = true;
  }

  async copiar(cod_sucursal: string)
  {
    $("#mymodalformsucursal").modal("show");
    this.childsucursalform.nombreformulario = "COPIAR";
    this.childsucursalform.cod_sucursal = cod_sucursal;
    await this.childsucursalform.buscarSucursal();
    this.childsucursalform.sucursal.cod_sucursal = 0;
    this.childsucursalform.flagocultarboton = false;
  }

  recibirDatosSucursal()
  {
    this.listarSucursalesGenerales();
    this.childsucursalform.formularioNormal();
    $("#mymodalformsucursal").modal("hide");
  }

  asignarRuc(cod_sucursal: string, sucursal: string)
  {
	  this.childasignacionruc.cod_sucursal= cod_sucursal;
    this.childasignacionruc.sucursal= sucursal;
    this.childasignacionruc.datosrucempresa = [];
    this.childasignacionruc.listarRucEmpresas();
	  $("#mymodalasignacionruc").modal("show");
  }

  clickLogo(cod_sucursal: string, empresa: string)
  {
    this.childlogosucursal.cod_sucursal = cod_sucursal;
    this.childlogosucursal.sucursal = empresa;
    this.childlogosucursal.clearLogo();
	  $("#mymodallogo").modal("show");
  }

  recibirDatosLogoSucursal(opcion: string)
  {
    if(opcion=="normal")
    {
      const item = this.datossucursal.find(
        (x: any) => x.cod_sucursal == this.childlogosucursal.cod_sucursal
      );

      if (item) {

        item.versionlogo = new Date().getTime();
      }
    }
    else
    {
      this.versionlogo = new Date().getTime();
    }

    $("#mymodallogo").modal("hide");
  }

  clickConfiguracionServicio()
  {
    this.childconfiguracionservicio.buscarConfiguracion();
	  $("#mymodalconfiguracionservicio").modal("show");
  }

  clickNuevoSucursal()
  {
    this.childsucursalform.nombreformulario = "NUEVO";
    this.childsucursalform.formularioNormal();
    $("#mymodalformsucursal").modal("show");
  }
   



}