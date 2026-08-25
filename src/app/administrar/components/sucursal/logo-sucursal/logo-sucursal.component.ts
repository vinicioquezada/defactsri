import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { WsService } from 'src/app/shared/services/ws.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';

@Component({
  selector: 'app-logo-sucursal',
  templateUrl: './logo-sucursal.component.html',
  styleUrls: ['./logo-sucursal.component.css']
})
export class LogoSucursalComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  cod_proyecto : string = "";
  cod_sucursal: string = "";
  sucursal: string = "";

  selectedLogoFile: File | null = null;
  selectedLogoBase64: string | ArrayBuffer | null = null;
  @ViewChild('fileLogo') fileLogo!: ElementRef;

  constructor(private swalservice: SwalService, private toastr: ToastrService, private sucursalservice:SucursalesService, private error:ErrorService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    //this.selectedLogoBase64 = this.configService.settings.baseUrlSri + "/conexion/" + this.cod_proyecto + "/logo/" + this.cod_sucursal + ".png";
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension !== 'png') {
      alert('Debe seleccionar una imagen PNG');
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
    formImage.append("cod_sucursal", this.cod_sucursal);
    this.sucursalservice.subirLogo(formImage).subscribe( (data : any) => {
      this.swalservice.close();
      if(data.estado) {
        this.datosenvio.emit("normal");
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

  async clickSubirLogoPrincipal()
  {
    const ok = await this.swalservice.alertConfirmRequerido({
      title: "Control del Sistema",
      text: "¿Está seguro de subir el logo seleccionado como principal?",
      icon: "info",
      confirmText: "Sí, Subir",
      cancelText: "No, Cerrar"
    });

    if (ok) {
      this.subirLogoPrincipal();
    }
  }

  subirLogoPrincipal() {
    this.swalservice.iniciarLoading("Almacenando...");
    let formImage = new FormData();
    formImage.append("logo", this.selectedLogoFile);
    this.sucursalservice.subirLogoPrincipal(formImage).subscribe( (data : any) => {
      this.swalservice.close();
      if(data.estado) {
        this.datosenvio.emit("principal");
      } else {
        this.toastr.error(data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

}