import { Component, OnInit, EventEmitter, Output, } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { TipoDocumentoService } from 'src/app/retencion/services/tipo-documento.service';
import { TipoImpuestoService } from 'src/app/retencion/services/tipo-impuesto.service';
import { CodigoRetencionService } from 'src/app/retencion/services/codigo-retencion.service';
declare var $:any;

@Component({
  selector: 'app-detalle-retencion',
  templateUrl: './detalle-retencion.component.html',
  styleUrls: ['./detalle-retencion.component.css']
})
export class DetalleRetencionComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();
  datosdetalles : any = [];
  codigo_tipo_documento : string = "0";
  tipo_documento : string = "";
  codigo_tipo_impuesto : string = "0";
  tipo_impuesto : string = "";
  cod_codigo_retencion : string = "0";
  numero_documento : string = "";
  fecha_compra : string = "";
  base_imponible : number = 0;
  codigo_retencion : string = "";
  porcentaje_retencion : number = 0;
  valor_retenido : number = 0;

  datoscodigoretencion : any;
  datostipodocumento : any;
  datosrenta: any;
  datosiva: any;
  datosisd: any;
 
  flagtipoimpuesto : boolean = false;
  flagtipodocumento : boolean = false;
  flagcodigoretencion : boolean = false;

  loading : boolean = false;
  loadingtipoimpuesto : boolean = false;

  disabledbtn : boolean = true;

  constructor(private tipodocumentoservice : TipoDocumentoService, private tipoimpuestoservice : TipoImpuestoService, private codigoretencionservice : CodigoRetencionService, private toastr : ToastrService, private error : ErrorService) { }

  ngOnInit(): void {
    this.listarTipoDocumentos();
    this.listarCodigoRetencion();
  }


  onChangeTipoDocumento(event: any): void {
    const elemento = event.target.value;
    this.codigo_tipo_documento = elemento;
    this.buscarTipoDocumento();
  }

  onChangeSeleccionCodigoRetencion(item: any, event: any, i: number, codigo_tipo_impuesto: string, tipo_impuesto: string): void {
    const elemento = event.target.value;
    this.cod_codigo_retencion = elemento;
    this.codigo_tipo_impuesto = codigo_tipo_impuesto;
    this.tipo_impuesto = tipo_impuesto;

    if(codigo_tipo_impuesto == "1")
    {
      this.base_imponible = item.total;
    }
    else
    {
      this.base_imponible = item.total_iva;
    }
    
    
    if(elemento!=0)
    {
      this.buscarCodigoRetencion();
    }
  }

  listarTipoDocumentos()
  {
    this.loading = true;
    
    this.tipodocumentoservice.listarTipoDocumentos().subscribe( (data : any) =>
    {
      this.datostipodocumento = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  formularioNormal()
  {
    this.codigo_tipo_documento = "0";
    this.tipo_documento = "";
    this.numero_documento = "";
    this.fecha_compra = "";
    this.disabledbtn = true;
    this.datosdetalles = [];
  }

  habilitarFormulario()
  {
    this.disabledbtn = false;
  }

  deshabilitarFormulario()
  {
    this.disabledbtn = true;
  }
  
  buscarTipoDocumento()
  {
    const resultado = this.datostipodocumento.find( (valor : any) => valor.codigo_tipo_documento == this.codigo_tipo_documento );
    this.tipo_documento = resultado.tipo_documento;
  }
  
  buscarCodigoRetencion()
  {
    const resultado = this.datoscodigoretencion.find( (valor : any) => valor.cod_codigo_retencion == this.cod_codigo_retencion );
    this.codigo_retencion = resultado.codigo_retencion;
    this.porcentaje_retencion = resultado.porcentaje;

    this.valor_retenido =  (this.base_imponible * this.porcentaje_retencion) / 100;
    
    let objetoDetalle = {
      "codigo_tipo_impuesto" : this.codigo_tipo_impuesto,
      "cod_codigo_retencion" : this.cod_codigo_retencion, 
      "codigo_retencion" : this.codigo_retencion,
      "tipo_impuesto" : this.tipo_impuesto,
      "base_imponible" : this.base_imponible,
      "porcentaje_retencion" : this.porcentaje_retencion,
      "valor_retenido" : this.valor_retenido.toFixed(6),
      "cod_documento" : this.codigo_tipo_documento,
      "tipo_documento" : this.tipo_documento,
      "numero_documento" : this.numero_documento,
      "fecha_emision_documento" : this.fecha_compra,
      "accion" : "añadir"
    }
    //console.log(objetoDetalle);
    this.datosenviar.emit(objetoDetalle);
  }

  listarCodigoRetencion()
  {    
    this.loading = true;
    this.codigoretencionservice.listarCodigoRetencion().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datoscodigoretencion = data;
      const resultadodatosrenta = this.datoscodigoretencion.filter( (valor : any) => valor.codigo_tipo_impuesto == 1 );
      const resultadodatosiva = this.datoscodigoretencion.filter( (valor : any) => valor.codigo_tipo_impuesto == 2 );
      const resultadodatosisd = this.datoscodigoretencion.filter( (valor : any) => valor.codigo_tipo_impuesto == 6 );
      this.datosrenta = resultadodatosrenta;
      this.datosiva = resultadodatosiva;
      this.datosisd = resultadodatosisd;
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  seleccionarImpuesto()
  {
    $("#mymodalseleccionarimpuesto").modal("show");
  }
}