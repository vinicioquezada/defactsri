import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ActivatedRoute, Router } from '@angular/router';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { OpcionesExploradorVentaComponent } from '../opciones-explorador-venta/opciones-explorador-venta.component';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { ListarNotaCreditoComponent } from '../listar-nota-credito/listar-nota-credito.component';
import { ListarGuiaRemisionComponent } from '../listar-guia-remision/listar-guia-remision.component';
import * as CryptoJS from 'crypto-js';
import { first } from 'rxjs';

@Component({
  selector: 'app-visualizar-listado-venta-cliente',
  templateUrl: './visualizar-listado-venta-cliente.component.html',
  styleUrls: ['./visualizar-listado-venta-cliente.component.css']
})
export class VisualizarListadoVentaClienteComponent implements OnInit {
  @ViewChild(OpcionesExploradorVentaComponent) opcionesexploradorventacomponent!: OpcionesExploradorVentaComponent;
  @ViewChild(ListarNotaCreditoComponent) listarnotacreditocomponent: ListarNotaCreditoComponent;
  @ViewChild(ListarGuiaRemisionComponent) listarguiaremisioncomponent: ListarGuiaRemisionComponent;
  @Output() datosenviar: EventEmitter<any> = new EventEmitter<any>();

  tipoformulario: string = "exploradorventa";

  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  cod_cliente : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  cod_proyecto : string = "";
  
  loadinglistado : boolean = false;

  cantidad_registros : number = 0;

  cliente: string = "";

  cod_ruc: string = "0";
  datosrucempresa : any = [];

  recaudador: string = "";

  firmasruc: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private route: ActivatedRoute, private bodyStyleService: BodyStyleService, private rucempresaservice : RucEmpresaService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    this.listarFacturasVentasPorCliente(1);
  }

  async formularioNormal()
  {
    this.route.queryParams.pipe(first()).subscribe(async (params) => {
      const firma = params['firma'];

      const paramsSinFirma = { ...params };
      delete paramsSinFirma['firma'];

      const normalizado: any = {
        cod_sucursal: String(paramsSinFirma["cod_sucursal"] || "").trim(),
        cod_cliente: String(paramsSinFirma["cod_cliente"] || "").trim(),
        cliente: String(paramsSinFirma["cliente"] || "").trim(),
        fechadesde: String(paramsSinFirma["fechadesde"] || "").trim(),
        fechahasta: String(paramsSinFirma["fechahasta"] || "").trim()
      };

      const hashCalculado = await this.generarHash(normalizado);

      if (firma !== hashCalculado) {
        this.router.navigate(['/']);
        return;
      }

      this.page = 1;
      this.filterpost="";
      this.datos = [];
      this.cod_sucursal = params["cod_sucursal"];
      this.cod_cliente = params["cod_cliente"];
      this.cliente = params["cliente"];
      this.fechadesde = params["fechadesde"];
      this.fechahasta = params["fechahasta"];
      this.listarRucEmpresas();
    });


    

  }
 
  listarFacturasVentasPorCliente(page: number)
  {
    this.page = page;
    this.filterpost="";
    this.loadinglistado = true;
    this.ventaservice.listarFacturasVentasPorCliente(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_cliente).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
      this.cantidad_registros = data.length;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  listarRucEmpresas()
  {
    this.cod_ruc = "0";
    this.loadinglistado = true;
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datosrucempresa = data;
      let objetoidentificacion = {
        "cod_ruc" : "0",
        "empresa": "TODOS"
      }
      this.datosrucempresa.unshift(objetoidentificacion);
      

      const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
      const savedpage = parseInt(sessionStorage.getItem("page"));
      const savedfechadesde = sessionStorage.getItem("fechadesde");
      const savedfechahasta = sessionStorage.getItem("fechahasta");
      if (savedtipoformulario=="explorador_venta") {
        this.fechadesde = savedfechadesde;
        this.fechahasta = savedfechahasta;
        sessionStorage.removeItem("tipo_formulario");
        sessionStorage.removeItem("cod_sucursal");
        sessionStorage.removeItem("cod_ruc");
        sessionStorage.removeItem("estado");
        sessionStorage.removeItem("page");
        sessionStorage.removeItem("fechadesde");
        sessionStorage.removeItem("fechahasta");
        sessionStorage.removeItem("cod_tipo_documento");
        
        this.listarFacturasVentasPorCliente(savedpage);
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
        this.listarFacturasVentasPorCliente(1);
      }


    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");      
    });
  }

  opciones(item: any)
  {
    const resultado = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == item.cod_ruc );
    if (resultado)
    {
      this.opcionesexploradorventacomponent.ruc = resultado.ruc_sucursal;
      this.opcionesexploradorventacomponent.tipoambiente = resultado.tipo_ambiente;
      this.opcionesexploradorventacomponent.razon_social = resultado.razonsocial;
      this.opcionesexploradorventacomponent.nombre_comercial = resultado.nombrecomercial;//Unico que funciona en opcionesexploradorventacomponent
      this.opcionesexploradorventacomponent.contabilidad = resultado.contabilidad;
      this.opcionesexploradorventacomponent.direccion_matriz = resultado.direccion_matriz;
      this.opcionesexploradorventacomponent.direccion_establecimiento = resultado.direccion_establecimiento;
      this.opcionesexploradorventacomponent.tipo_contribuyente = resultado.tipo_contribuyente;
      this.opcionesexploradorventacomponent.contribuyente = resultado.contribuyente;
      this.opcionesexploradorventacomponent.leyenda = resultado.leyenda;

      this.opcionesexploradorventacomponent.cod_sucursal = this.cod_sucursal;//Restaurar datos
      this.opcionesexploradorventacomponent.cod_ruc = this.cod_ruc;
      this.opcionesexploradorventacomponent.fechadesde = this.fechadesde;
      this.opcionesexploradorventacomponent.fechahasta = this.fechahasta;
      this.opcionesexploradorventacomponent.estado = "0";
      this.opcionesexploradorventacomponent.page = String(this.page);
      this.opcionesexploradorventacomponent.cod_tipo_documento = "0";
      this.opcionesexploradorventacomponent.opciones(item);
      $("#mymodalopciones").modal("show");
    }
    else
    {
      this.toastr.error("No se encontró el RUC en la venta, vuelva a buscar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  recibirDatosEstado(item: any): void {
    this.datos.find((x:any) => x.cod_factura_venta === item.cod_factura_venta).estado = item.estado;
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

  generarHash(data: any): string {
    return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
  }

}