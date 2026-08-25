import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from '../../services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { OpcionesExploradorVentaComponent } from 'src/app/shared/components/venta/opciones-explorador-venta/opciones-explorador-venta.component';
import { ListarNotaCreditoComponent } from 'src/app/shared/components/venta/listar-nota-credito/listar-nota-credito.component';
import { ListarGuiaRemisionComponent } from 'src/app/shared/components/venta/listar-guia-remision/listar-guia-remision.component';

import { redondeardecimales } from '../../../shared/js/decimales.js';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-venta',
  templateUrl: './explorador-venta.component.html',
  styleUrls: ['./explorador-venta.component.css']
})
export class ExploradorVentaComponent implements OnInit {
  @ViewChild(OpcionesExploradorVentaComponent) opcionesexploradorventacomponent!: OpcionesExploradorVentaComponent;
  @ViewChild(ListarNotaCreditoComponent) listarnotacreditocomponent: ListarNotaCreditoComponent;
  @ViewChild(ListarGuiaRemisionComponent) listarguiaremisioncomponent: ListarGuiaRemisionComponent;
  
  opcionesprivilegios : any;

  tipoformulario: string = "exploradorventa";

  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";

  estado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  loading : boolean = false;
  loadinglistado : boolean = false;

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
    },
    {
      "cod_tipo_documento" : 4,
      "tipo_documento" : "PROFORMA"
    }
  ];

  recaudador: string = "";

  firmasruc: string = "";
  cod_ruc: string = "0";
  datosrucempresa : any = [];

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.recaudador = this.usersession.getConfiguracion("recaudador");
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
    this.opcionesexploradorventacomponent.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarFacturas(1);
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
      this.opcionesexploradorventacomponent.ruc = resultado.ruc_sucursal;//Corregir esto debe ser al momento que se selecciona el comprobante
      this.opcionesexploradorventacomponent.tipoambiente = resultado.tipo_ambiente;
      this.opcionesexploradorventacomponent.razon_social = resultado.razonsocial;
      this.opcionesexploradorventacomponent.nombre_comercial = resultado.nombrecomercial;//Unico que funciona en opcionesexploradorventacomponent
      this.opcionesexploradorventacomponent.contabilidad = resultado.contabilidad;
      this.opcionesexploradorventacomponent.direccion_matriz = resultado.direccion_matriz;
      this.opcionesexploradorventacomponent.direccion_establecimiento = resultado.direccion_establecimiento;
      this.opcionesexploradorventacomponent.tipo_contribuyente = resultado.tipo_contribuyente;
      this.opcionesexploradorventacomponent.contribuyente = resultado.contribuyente;
      this.opcionesexploradorventacomponent.leyenda = resultado.leyenda;
      */

      this.opcionesexploradorventacomponent.cod_sucursal = this.cod_sucursal;//Restaurar datos
      this.opcionesexploradorventacomponent.cod_ruc = this.cod_ruc;
      this.opcionesexploradorventacomponent.fechadesde = this.fechadesde;
      this.opcionesexploradorventacomponent.fechahasta = this.fechahasta;
      this.opcionesexploradorventacomponent.estado = this.estado;
      this.opcionesexploradorventacomponent.page = String(this.page);
      this.opcionesexploradorventacomponent.cod_tipo_documento = this.cod_tipo_documento;
      
      this.opcionesexploradorventacomponent.opciones(item);
      $("#mymodalopciones").modal("show");
    }
    else
    {
      this.toastr.error("No se encontró el RUC en la venta, vuelva a buscar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal(): void
  {
    this.page = 1;
    this.filterpost="";

    this.estado = "0";

    this.cod_tipo_documento = "0";
    this.cod_ruc = "0";

    this.fechadesde = moment().format("YYYY-MM-DD");
    this.fechahasta = moment().format("YYYY-MM-DD");

    this.datos = [];

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedcod_ruc = sessionStorage.getItem("cod_ruc");
    const savedestado = sessionStorage.getItem("estado");
    const savedcodtipodocumento = sessionStorage.getItem("cod_tipo_documento");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_venta") {
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
      
      this.listarFacturas(savedpage);
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
 
  listarFacturas(page: number)
  {
    this.page = page;
    this.filterpost="";

    let opcion = "explorador";
    this.loadinglistado = true;

    this.ventaservice.listarFacturas(this.fechadesde, this.fechahasta, opcion, this.cod_sucursal, this.estado, this.cod_tipo_documento, this.opcionesprivilegios.solomiscomprobantes, this.cod_ruc, "").subscribe( (data : any) =>
    {
      data.forEach(element => {
        element.importetotal = redondeardecimales(element.importetotal, 2);
      });

      this.datos = data;
      this.loadinglistado = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
    
  }

  listarSucursales()
  {
    this.datossucursal = [];
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
    const factura = this.datos.find((x: any) => x.cod_factura_venta == item.cod_factura_venta);
    if (factura)
    {
      factura.estado = item.estado;
      factura.fecha_hora = item.fecha_hora;
      factura.error_sri = item.error_sri;
    }
  }

  recibirDatosCorreo(item: any): void {
    this.datos.find((x:any) => x.cod_factura_venta === item.cod_factura_venta).envio = item.envio;
  }

  listarNotaCreditoVenta(item: any)
  {
    this.listarnotacreditocomponent.listarNotaCreditoVenta(item);
    $("#mymodallistarnotacredito").modal("show");
  }

  listarGuiaRemisionVenta(item: any)
  {
    this.listarguiaremisioncomponent.listarGuiaRemisionVenta(item);
    $("#mymodallistarguiaremision").modal("show");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}