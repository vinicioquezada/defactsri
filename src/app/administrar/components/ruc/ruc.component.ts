import { Component, OnInit, ViewChild } from '@angular/core';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { Location } from '@angular/common';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { LogoRucComponent } from './logo-ruc/logo-ruc.component';
import { FirmaRucComponent } from './firma-ruc/firma-ruc.component';
import { ConfigService } from 'src/app/shared/services/config.service';
import { SecuenciasFacturaComponent } from './secuencias-factura/secuencias-factura.component';
import { RucFormComponent } from './ruc-form/ruc-form.component';
declare var $:any;

@Component({
  selector: 'app-ruc',
  templateUrl: './ruc.component.html',
  styleUrls: ['./ruc.component.css']
})
export class RucComponent implements OnInit {
  cod_proyecto : string = "";
  baseurlsri: string = '';
  status: string = "";
  datosruc : any = [];
  @ViewChild(LogoRucComponent) childlogoruc!: LogoRucComponent;
  @ViewChild(FirmaRucComponent) childfirmaruc!: FirmaRucComponent;
  @ViewChild(SecuenciasFacturaComponent) childsecuenciasfactura!: SecuenciasFacturaComponent;
  @ViewChild(RucFormComponent) childrucform!: RucFormComponent;
  versionlogo: any = new Date().getTime();

  constructor(private usersession: UserSessionService, private location: Location, private toastr: ToastrService, private error:ErrorService, private rucempresaservice:RucEmpresaService, private swalservice: SwalService, private router : Router, private configService: ConfigService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.status = this.usersession.getConfiguracion("status");
    this.baseurlsri = this.configService.settings.baseUrlSri;

    if(this.status != "1")
    {
      this.location.back();
    }
    else
    {
      this.listarRucGenerales();
    }
  }

  async listarRucGenerales(): Promise<void> {
    this.swalservice.iniciarLoading("Cargando...");

    try {
      const data = await firstValueFrom(this.rucempresaservice.listarRucGenerales());
      this.datosruc = data;
     
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.swalservice.close();
    }
  }

  activar = (cod_ruc: number, valor_estado: number) =>{
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
      'cod_ruc' : cod_ruc,
      'estado' : valor_estado,
    };

    this.rucempresaservice.activarRuc(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      
      if (data.estado == true)
      {
        if(valor_estado==1)
        {
          this.datosruc.find((x:any) => x.cod_ruc === cod_ruc).estado = 1;
        }
        else
        {
          this.datosruc.find((x:any) => x.cod_ruc === cod_ruc).estado = 0;
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

  async editar(cod_ruc: string)
  {
    $("#mymodalformruc").modal("show");
    this.childrucform.nombreformulario = "EDITAR";
    this.childrucform.cod_ruc = cod_ruc;
    await this.childrucform.buscarRuc();
    this.childrucform.flagocultarboton = true;
  }

  async copiar(cod_ruc: string)
  {
	  $("#mymodalformruc").modal("show");
    this.childrucform.nombreformulario = "COPIAR";
    this.childrucform.cod_ruc = cod_ruc;
    await this.childrucform.buscarRuc();
    this.childrucform.rucempresa.cod_ruc = 0;
    this.childrucform.flagocultarboton = false;
  }

  recibirDatosRuc()
  {
    this.listarRucGenerales();
    this.childrucform.formularioNormal();
    $("#mymodalformruc").modal("hide");
  }

  clickNuevoRuc()
  {
    this.childrucform.nombreformulario = "NUEVO";
    this.childrucform.formularioNormal();
    $("#mymodalformruc").modal("show");
  }

  clickLogo(cod_ruc: string, empresa: string)
  {
    this.childlogoruc.cod_ruc = cod_ruc;
    this.childlogoruc.empresa = empresa;
    this.childlogoruc.clearLogo();
	  $("#mymodallogo").modal("show");
  }

  clickFirma(item: any)
  {
    this.childfirmaruc.cod_ruc = item.cod_ruc;
    this.childfirmaruc.empresa = item.empresa;
    this.childfirmaruc.clearP12();
	  $("#mymodalfirma").modal("show");
    this.childfirmaruc.firmap12subida = item.firmap12;
  }

  recibirDatosLogoRuc()
  {
    const item = this.datosruc.find(
      (x: any) => x.cod_ruc == this.childlogoruc.cod_ruc
    );

    if (item) {

      item.versionlogo = new Date().getTime();

    }

    $("#mymodallogo").modal("hide");
  }

  secuenciasFactura(item: any)
  {
    this.childsecuenciasfactura.cod_ruc = item.cod_ruc;
    this.childsecuenciasfactura.empresa = item.empresa;
    this.childsecuenciasfactura.serieestab = this.padLeft(item.serieestab, 3);
    this.childsecuenciasfactura.ptoemi = this.padLeft(item.ptoemi, 3);
    this.childsecuenciasfactura.listarSecuenciasFacturas();
	  $("#mymodalsecuenciasfactura").modal("show");
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

}