import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { FirmaUsuarioService } from 'src/app/usuario/services/firma-usuario.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare var $:any;

@Component({
  selector: 'app-configurar-firma-venta',
  templateUrl: './configurar-firma-venta.component.html',
  styleUrls: ['./configurar-firma-venta.component.css']
})
export class ConfigurarFirmaVentaComponent implements OnInit {
  loading : boolean = false;
  loadinglistado : boolean = false;
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  cod_ruc: string = "";
  cod_sucursal_estable: string = "";
  datosrucempresa : any = [];

  constructor(private toastr : ToastrService, private error : ErrorService, private rucempresaservice : RucEmpresaService, private firmausuarioservice: FirmaUsuarioService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.cod_sucursal_estable = this.usersession.getConfiguracion("cod_sucursal");
    this.cod_ruc = this.usersession.getConfiguracion("cod_ruc");
    this.datosrucempresa = [];
  }

  configurarFirmaVenta()
  {
    this.listarRucEmpresas();
    $("#mymodalconfigurarfirmaventa").modal("show");
  }

  listarRucEmpresas()
  {    
    this.loadinglistado = true;
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datosrucempresa = data;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  changeEmpresa(event: any): void {
      const elemento = event.target.value;
      this.cod_ruc = elemento;
  }

  clickGuardar()
  {
    Swal.fire({
    title: 'Información del Sistema',
    text: '¿Estás seguro de guardar la configuración para firmar el documento, en caso que tenga datos ingresados, tener en cuenta el ruc con el impuesto en los detalles?',
    icon: 'info',//'warning'
    showCancelButton: true,
    confirmButtonText: 'Si, Continuar',
    cancelButtonText: 'No, Cerrar'
    }).then((result) => {
      if (result.value) {
        this.guardar();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  guardar() {
    this.loading = true;
    const parametros = {
      'cod_sucursal' : this.cod_sucursal_estable,
      'cod_ruc' : this.cod_ruc
    };
    this.firmausuarioservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_sucursal' : this.cod_sucursal_estable,
          'cod_ruc' : this.cod_ruc
        };
        this.datosenvio.emit(parametrosenviar);
        this.toastr.success("Firma de usuario configurada satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Firma no se pudo configurar al usuario, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

}
