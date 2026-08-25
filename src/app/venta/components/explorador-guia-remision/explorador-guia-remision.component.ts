import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { GuiaRemisionService } from '../../services/guia-remision.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { OpcionesExploradorGuiaRemisionComponent } from 'src/app/shared/components/venta/opciones-explorador-guia-remision/opciones-explorador-guia-remision.component';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-guia-remision',
  templateUrl: './explorador-guia-remision.component.html',
  styleUrls: ['./explorador-guia-remision.component.css']
})
export class ExploradorGuiaRemisionComponent implements OnInit {
  @ViewChild(OpcionesExploradorGuiaRemisionComponent) opcionesexploradorguiaremisioncomponent!: OpcionesExploradorGuiaRemisionComponent;
  tipoformulario: string = "exploradorguiaremision";

  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  estado : string = "";
  estado_comprobante : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  razon_social_transportista : string = "";
  ptoemi : string = "";
  correo : string = "";
  cod_factura_venta = "";

  loading : boolean = false;
  loadinglistado : boolean = false;
  loadingmodal : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnenviarcorreo : boolean = false;
  disabledbtnenviarsri : boolean = false;
  disabledbtnanular : boolean = false;
  disabledbtndescargarride : boolean = false;
  disabledbtndescargarxml : boolean = false;
  disabledbtndescargardocumentos : boolean = false;
  disabledbtncomprobarsri : boolean = false;
  disabledbtncrearride : boolean = false;

  arr_guia_remision : any;

  firmasruc: string = "";
  cod_ruc: string = "0";
  datosrucempresa : any = [];

  cod_tipo_documento : string = "";
  datostipodocumento : any[] = [
    {
      "cod_tipo_documento" : 0,
      "tipo_documento" : "TODOS"
    },
    {
      "cod_tipo_documento" : 1,
      "tipo_documento" : "FACTURA ELECTRÓNICA"
    },
    {
      "cod_tipo_documento" : 2,
      "tipo_documento" : "FACTURA"
    },
    {
      "cod_tipo_documento" : 3,
      "tipo_documento" : "RECIBO"
    }
  ];

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private guiaremisionservice:GuiaRemisionService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    this.listarRucEmpresas();
  }

  changeEmpresa(event: any): void {
      const elemento = event.target.value;
      this.cod_ruc = elemento;
  }

  changeTipoDocumento(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_documento = elemento;
  }

  changeEstadoComprobante(event: any): void {
    const elemento = event.target.value;
    this.estado = elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarGuiasRemision(1);
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(item: any)
  {
    const resultado = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == item.cod_ruc );
    if (resultado)
    {
      /*
      this.opcionesexploradorguiaremisioncomponent.ruc = resultado.ruc_sucursal;
      this.opcionesexploradorguiaremisioncomponent.tipoambiente = resultado.tipo_ambiente;
      this.opcionesexploradorguiaremisioncomponent.razon_social = resultado.razonsocial;
      this.opcionesexploradorguiaremisioncomponent.nombre_comercial = resultado.nombrecomercial;
      this.opcionesexploradorguiaremisioncomponent.contabilidad = resultado.contabilidad;
      this.opcionesexploradorguiaremisioncomponent.direccion_matriz = resultado.direccion_matriz;
      this.opcionesexploradorguiaremisioncomponent.direccion_establecimiento = resultado.direccion_establecimiento;
      this.opcionesexploradorguiaremisioncomponent.tipo_contribuyente = resultado.tipo_contribuyente;
      this.opcionesexploradorguiaremisioncomponent.contribuyente = resultado.contribuyente;
      this.opcionesexploradorguiaremisioncomponent.leyenda = resultado.leyenda;
      */
     
      this.opcionesexploradorguiaremisioncomponent.cod_sucursal = this.cod_sucursal;//Restaurar datos
      this.opcionesexploradorguiaremisioncomponent.cod_ruc = this.cod_ruc;
      this.opcionesexploradorguiaremisioncomponent.fechadesde = this.fechadesde;
      this.opcionesexploradorguiaremisioncomponent.fechahasta = this.fechahasta;
      this.opcionesexploradorguiaremisioncomponent.estado = this.estado;
      this.opcionesexploradorguiaremisioncomponent.page = String(this.page);
      this.opcionesexploradorguiaremisioncomponent.cod_tipo_documento = this.cod_tipo_documento;
      this.opcionesexploradorguiaremisioncomponent.opciones(item);
      $("#mymodalopciones").modal("show");
    }
    else
    {
      this.toastr.error("No se encontró el RUC en la guia de remisión, vuelva a buscar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.estado = "0";

    this.cod_tipo_documento = "0";
    this.cod_ruc = "0";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.opcionesexploradorguiaremisioncomponent.formularioNormal();

    this.datos = [];

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedcod_ruc = sessionStorage.getItem("cod_ruc");
    const savedestado = sessionStorage.getItem("estado");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    const savedcodtipodocumento = sessionStorage.getItem("cod_tipo_documento");
    if (savedtipoformulario=="explorador_guia_remision") {
      this.cod_sucursal = savedcodsucursal;
      this.cod_ruc = savedcod_ruc;
      this.estado = savedestado;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      this.cod_tipo_documento = savedcodtipodocumento
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("cod_ruc");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      sessionStorage.removeItem("cod_tipo_documento");
      this.listarGuiasRemision(savedpage);
    }
    else
    {
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("cod_ruc");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      sessionStorage.removeItem("cod_tipo_documento");
    }
  }

  listarGuiasRemision(page: number)
  {
    this.page = page;
    this.filterpost="";
    let opcion = "explorador";
    this.loadinglistado = true;
    this.guiaremisionservice.listarGuiasRemision(this.fechadesde, this.fechahasta, opcion, this.cod_sucursal, this.estado,this.cod_tipo_documento, this.cod_ruc).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  listarSucursales()
  {    
    this.loading = true;
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      this.listarRucEmpresas();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  listarRucEmpresas()
  {
    this.cod_ruc = "0";
    this.loading = true;
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosrucempresa = data;

      let objetoidentificacion = {
        "cod_ruc" : "0",
        "empresa": "TODOS"
      }
      this.datosrucempresa.unshift(objetoidentificacion);
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  recibirDatosEstado(item: any): void {
    const guiaremision = this.datos.find((x: any) => x.cod_guia_remision == item.cod_guia_remision);
    if (guiaremision)
    {
      guiaremision.estado = item.estado;
      guiaremision.fecha_hora = item.fecha_hora;
      guiaremision.error_sri = item.error_sri;
    }
  }

  recibirDatosCorreo(item: any): void {
    this.datos.find((x:any) => x.cod_guia_remision === item.cod_guia_remision).envio = item.envio;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}