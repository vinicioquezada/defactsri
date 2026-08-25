import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { WsService } from 'src/app/shared/services/ws.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
declare var $:any;

@Component({
  selector: 'app-firma-ruc',
  templateUrl: './firma-ruc.component.html',
  styleUrls: ['./firma-ruc.component.css']
})
export class FirmaRucComponent implements OnInit {
  cod_proyecto : string = "";
  cod_ruc: string = "";
  empresa: string = "";

  certificado: string = "";
  firmap12: string = "";
  clavep12: string = "";
  fecha_caducidad_firma: string = "";
  firmap12subida: string = "";

  selectedP12File: File | null = null;
  @ViewChild('fileP12') fileP12!: ElementRef;

  constructor(private swalservice: SwalService, private toastr: ToastrService, private rucempresaservice:RucEmpresaService, private error:ErrorService, private usersession: UserSessionService, private wsservice: WsService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
  }

  async onP12Selected(event: Event) {

    if(this.clavep12.length==0)
    {
       const ok = await this.swalservice.alertOkRequerido({
          title: "Control del Sistema",
          text: "Ingrese clave de firma"
        });
    }
    else
    {
      const input = event.target as HTMLInputElement;

      if (!input.files || input.files.length === 0) {
        return;
      }

      const file = input.files[0];

      // Validar extensión
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension !== 'p12') {
        alert('Debe seleccionar un archivo .p12');
        this.clearP12();
        return;
      }

      this.selectedP12File = file;

      //console.log(this.selectedP12File);
      this.subirFirma("revision");
    }
  }

  clearP12(): void {
    this.certificado = "";
    this.firmap12 = "";
    this.clavep12 = "";
    this.firmap12subida = "";
    this.fecha_caducidad_firma = "";
    this.fileP12.nativeElement.value = null;
    this.selectedP12File = null;
  }

  subirFirma(proceso: string) {
    this.swalservice.iniciarLoading("Subiendo Firma...");
    let formfirma = new FormData();
    formfirma.append("firma", this.selectedP12File);
    formfirma.append("cod_proyecto", this.cod_proyecto);
    formfirma.append("clavep12", this.clavep12);
    formfirma.append("proceso", proceso);
    this.wsservice.subirFirma(formfirma).subscribe( (data : any) => {
      this.swalservice.close();
      if(data.estado) {
        this.firmap12 = data.nombre_archivo;
        this.certificado = data.tipo_certificado;
        this.fecha_caducidad_firma = data.fecha_caducidad;

        if(proceso=="subir")
        {
          this.actualizarDatosFirma();
        }

      } else {
        this.toastr.error(data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  async clickSubir()
  {
    if(this.selectedP12File == null)
    {
      const ok = await this.swalservice.alertAviso("Debe seleccionar una firma p12 para subir");
    }
    else
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "Control del Sistema",
        text: "¿Está seguro de subir y actualizar la firma?",
        icon: "info",
        confirmText: "Sí, Subir",
        cancelText: "No, Cerrar"
      });

      if (ok) {
        this.subirFirma("subir");
      }
    }
  }

  actualizarDatosFirma()
  {
    this.swalservice.iniciarLoading("Actualizando Firma...");

    const parametros = {
      'cod_ruc' : this.cod_ruc,
      'firmap12' :this.firmap12,
      'clavep12' : this.clavep12,
      'certificado' : this.certificado,
      'fecha_caducidad_firma' : this.fecha_caducidad_firma
    };

    this.rucempresaservice.actualizarDatosFirma(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        $("#mymodalfirma").modal("hide");
        this.toastr.success("Firma subida satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Firma no se pudo subir para su registro, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  descargarFirma()
  {
    const url = this.configService.settings.baseUrlSri + "/conexion/" + this.cod_proyecto + "/" + this.firmap12subida;

    const link = document.createElement('a');
    link.href = url;
    link.download = this.firmap12subida;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
