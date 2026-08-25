import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ListadoProveedorComponent } from 'src/app/shared/components/listado-proveedor/listado-proveedor.component';
import { ProveedorFormComponent } from 'src/app/compra/components/proveedor/proveedor-form/proveedor-form.component';
import { RetencionService } from 'src/app/retencion/services/retencion.service';
import * as moment from 'moment';
declare var $:any;
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';

@Component({
  selector: 'app-datos-sujeto-retenido',
  templateUrl: './datos-sujeto-retenido.component.html',
  styleUrls: ['./datos-sujeto-retenido.component.css']
})
export class DatosSujetoRetenidoComponent implements OnInit {
  @Output() datosenviar: EventEmitter<any> = new EventEmitter<any>();
  tipoformulario: string = "agregar";
  
  cod_factura_compra : string = "";
  cod_identificacion : string = "";
  identificacion : string = "";
  cod_proveedor : string = "";
  proveedor : string = "";
  numero_identificacion : string = "";
  celular : string = "";
  correo : string = "";
  direccion : string = "";

  loading : boolean = false;

  disabledbtn : boolean = true;

  constructor(private retencionservice: RetencionService, private toastr : ToastrService, private error : ErrorService) { }

  ngOnInit(): void {
    
  }

  clickListarCompras()
  {
    $("#mymodallistarcompras").modal("show");
  }

  formularioNormal()
  {
    this.cod_factura_compra = "";
    this.cod_identificacion = "";
    this.identificacion = "-----------------";
    this.cod_proveedor = "";
    this.proveedor = "-----------------";
    this.numero_identificacion = "-----------------";
    this.celular = "-----------------";
    this.correo = "-----------------";
    this.direccion = "-----------------";
    this.disabledbtn = true;
  }

  habilitarFormulario()
  {
    this.disabledbtn = false;
  }

  deshabilitarFormulario()
  {
    this.disabledbtn = true;
  }

  recibirDatosCompra(compra: any)
  {
    this.cod_identificacion = compra[0].cod_identificacion;
    this.identificacion = compra[0].identificacion;
    this.cod_proveedor = compra[0].cod_proveedor;
    this.proveedor = compra[0].proveedor;
    this.numero_identificacion = compra[0].ruc;
    this.celular = compra[0].celular;
    this.correo = compra[0].correo;
    this.direccion = compra[0].direccion;
    this.cod_factura_compra = compra[0].cod_factura_compra;
    $("#mymodallistarcompras").modal("hide");
    this.datosenviar.emit(compra);
  }

  asignacionDatosSujeto(cod_identificacion: string, identificacion: string, cod_proveedor: string, proveedor: string, ruc: string, celular: string, correo: string, direccion: string, cod_factura_compra: string)
  {
    this.cod_identificacion = cod_identificacion;
    this.identificacion = identificacion;
    this.cod_proveedor = cod_proveedor;
    this.proveedor = proveedor;
    this.numero_identificacion = ruc;
    this.celular = celular;
    this.correo = correo;
    this.direccion = direccion;
    this.cod_factura_compra = cod_factura_compra;
  }
}