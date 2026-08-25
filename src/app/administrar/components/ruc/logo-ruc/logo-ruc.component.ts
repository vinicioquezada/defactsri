import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { WsService } from 'src/app/shared/services/ws.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';

@Component({
  selector: 'app-logo-ruc',
  templateUrl: './logo-ruc.component.html',
  styleUrls: ['./logo-ruc.component.css']
})
export class LogoRucComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  cod_proyecto : string = "";
  cod_ruc: string = "";
  empresa: string = "";

  selectedLogoFile: File | null = null;
  selectedLogoBase64: string | ArrayBuffer | null = null;
  @ViewChild('fileLogo') fileLogo!: ElementRef;

  constructor(private swalservice: SwalService, private toastr: ToastrService, private rucempresaservice:RucEmpresaService, private error:ErrorService, private usersession: UserSessionService, private wsservice: WsService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    //this.selectedLogoBase64 = this.configService.settings.baseUrlSri + "/conexion/" + this.cod_proyecto + "/logo/" + this.cod_ruc + ".png";
  }

  async onLogoSelected(event: Event)
  {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension !== 'png') {
      const ok = await this.swalservice.alertAviso("Debe seleccionar una imagen PNG");
      this.clearLogo();
      return;
    }

    this.selectedLogoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedLogoBase64 = reader.result;
    };
    reader.readAsDataURL(file);
  }

  clearLogo(): void {
    this.fileLogo.nativeElement.value = null;
    this.selectedLogoFile = null;
    this.selectedLogoBase64 = null;
  }

  subirLogo() {
    this.swalservice.iniciarLoading("Almacenando...");
    let formImage = new FormData();
    formImage.append("logo", this.selectedLogoFile);
    formImage.append("cod_proyecto", this.cod_proyecto);
    formImage.append("cod_ruc", this.cod_ruc);
    this.wsservice.subirLogo(formImage).subscribe( (data : any) => {
      this.swalservice.close();
      if(data.estado) {
        this.datosenvio.emit();
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
    if(this.selectedLogoFile == null)
    {
      const ok = await this.swalservice.alertAviso("Debe seleccionar una imagen PNG");
    }
    else
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "Control del Sistema",
        text: "¿Está seguro de subir el logo seleccionado?",
        icon: "info",
        confirmText: "Sí, Subir",
        cancelText: "No, Cerrar"
      });

      if (ok) {
        this.subirLogo();
      }
    }
  }

}
