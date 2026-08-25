import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { RetencionService } from '../../services/retencion.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { OpcionesExploradorRetencionComponent } from 'src/app/shared/components/retencion/opciones-explorador-retencion/opciones-explorador-retencion.component';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-retencion',
  templateUrl: './explorador-retencion.component.html',
  styleUrls: ['./explorador-retencion.component.css']
})
export class ExploradorRetencionComponent implements OnInit {
  @ViewChild(OpcionesExploradorRetencionComponent) opcionesexploradorretencioncomponent: any;
  tipoformulario: string = "exploradorretencion";

  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  estado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  numero_retencion : string = "";
  proveedor : string = "";
  cod_retencion : string = "";
  ptoemi : string = "";
  correo : string = "";

  cod_factura_compra = "";

  loading : boolean = false;
  loadinglistado : boolean = false;
  loadingmodal : boolean = false;

  arr_retencion : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private retencionservice: RetencionService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.listarSucursales();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    this.buscarSucursal();
  }

  buscarSucursal()
  {
    const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.opcionesexploradorretencioncomponent.serieestab = resultado.serieestab;
    this.opcionesexploradorretencioncomponent.ruc = resultado.ruc_sucursal;
    this.opcionesexploradorretencioncomponent.tipoambiente = resultado.tipo_ambiente;
    this.opcionesexploradorretencioncomponent.razon_social = resultado.razonsocial;
    this.opcionesexploradorretencioncomponent.nombre_comercial = resultado.nombrecomercial;
    this.opcionesexploradorretencioncomponent.contabilidad = resultado.contabilidad;
    this.opcionesexploradorretencioncomponent.direccion_matriz = resultado.direccion_matriz;
    this.opcionesexploradorretencioncomponent.direccion_establecimiento = resultado.direccion_establecimiento;
    this.opcionesexploradorretencioncomponent.tipo_contribuyente = resultado.tipo_contribuyente;
    this.opcionesexploradorretencioncomponent.contribuyente = resultado.contribuyente;
    this.opcionesexploradorretencioncomponent.leyenda = resultado.leyenda;
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
      this.listarRetenciones(1);
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(cod_retencion: string, numero_retencion: string, estado: string, proveedor : string, claveacceso : string, ptoemi : string, correo : string, cod_factura_compra : string)
  {
    this.opcionesexploradorretencioncomponent.opciones(cod_retencion, numero_retencion,estado, proveedor, claveacceso , ptoemi, correo, cod_factura_compra);
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.estado = "0";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.opcionesexploradorretencioncomponent.formularioNormal();

    this.datos = [];

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedestado = sessionStorage.getItem("estado");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_retencion") {
      this.cod_sucursal = savedcodsucursal;
      this.estado = savedestado;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      this.listarRetenciones(savedpage);
    }
    else
    {
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
    }
  }


  listarRetenciones(page: number)
  {
    this.page = page;
    this.filterpost="";

    let opcion = "explorador";

    this.loadinglistado = true;
    this.retencionservice.listarRetencionesCompras(this.fechadesde, this.fechahasta, opcion, this.cod_sucursal, this.estado).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA"); 
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
      this.buscarSucursal();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }
  
  recibirDatosEstado(item: any): void {
    this.datos.find((x:any) => x.cod_retencion === item.cod_retencion).estado = item.estado;
  }

  recibirDatosCorreo(item: any): void {
    this.datos.find((x:any) => x.cod_retencion === item.cod_retencion).envio = item.envio;
  }

  recibirMantenerEstados(): void {
    sessionStorage.setItem("tipo_formulario", "explorador_retencion");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("estado", this.estado);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}