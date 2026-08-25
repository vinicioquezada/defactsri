import { Component, OnInit , ViewChild} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from '../../services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { Router } from '@angular/router';
import { PedidoPanaderiaComponent } from 'src/app/shared/components/venta/pedido-panaderia/pedido-panaderia.component';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { RegistroAbonoComponent } from 'src/app/shared/components/registro-abono/registro-abono.component';
import { OpcionesExploradorPedidoComponent } from 'src/app/shared/components/venta/opciones-explorador-pedido/opciones-explorador-pedido.component';

@Component({
  selector: 'app-explorador-pedidos',
  templateUrl: './explorador-pedidos.component.html',
  styleUrls: ['./explorador-pedidos.component.css']
})
export class ExploradorPedidosComponent implements OnInit {
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";

  estado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  numero_factura : string = "";
  cliente : string = "";
  cod_factura_venta : string = "";

  loading : boolean = false;
  loadinglistado : boolean = false;
  loadingmodal : boolean = false;

  disabledbtncopiar : boolean = true;
  disabledbtnanular : boolean = false;

  @ViewChild(PedidoPanaderiaComponent) childpedidopanaderia: PedidoPanaderiaComponent;
  @ViewChild(RegistroAbonoComponent) childregistroabono: RegistroAbonoComponent;
  @ViewChild(OpcionesExploradorPedidoComponent) childopcionesexploradorpedido: OpcionesExploradorPedidoComponent;

  recaudador: string = "";

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private router : Router, private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.recaudador = this.usersession.getConfiguracion("recaudador");
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
  }

  changeEstadoPedido(event: any): void {
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
      this.listarPedidos(1);
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(cod_factura_venta: string, numero_factura: string, estado: string, tipo_venta: string, cliente : string, claveacceso : string, deuda_valor : number, estado_pedido : number)
  {
    this.childopcionesexploradorpedido.cod_sucursal = this.cod_sucursal;//Restaurar datos
    this.childopcionesexploradorpedido.fechadesde = this.fechadesde;
    this.childopcionesexploradorpedido.fechahasta = this.fechahasta;
    this.childopcionesexploradorpedido.estado_select = this.estado;
    this.childopcionesexploradorpedido.page = this.page;
    this.childopcionesexploradorpedido.opciones(cod_factura_venta, numero_factura, estado, tipo_venta, cliente , claveacceso, deuda_valor, estado_pedido);
  }

  verDetallesPedido(cod_factura_venta: string, numero_factura: string, cliente : string)
  {
    this.cod_factura_venta = cod_factura_venta;
    this.numero_factura = numero_factura;
    this.cliente = cliente;
    this.childpedidopanaderia.formularioNormal("modificar", this.cod_factura_venta);
    $("#mymodalverdetallespedido").modal("show");
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.estado = "T";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.numero_factura = "";
    this.cod_factura_venta = "";

    this.datos = [];

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedestado = sessionStorage.getItem("estado");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_pedidos") {
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
      this.listarPedidos(savedpage);
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
 
  listarPedidos(page: number)
  {
    this.page = page;
    this.filterpost="";

    this.loadinglistado = true;

    this.ventaservice.listarPedidos(this.fechadesde, this.fechahasta, this.cod_sucursal, this.estado).subscribe( (data : any) =>
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
    this.datossucursal = [];
    this.loading = true;
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  registrarAbono(item: any): void
  {
    let valor_cuota = null;
    let fecha_maxima_pago = "";
    let valor_mora = 0;
    if(item.tipo_credito==1)//Con cuotas
    {
      valor_cuota = null;
    }
    this.childregistroabono.clickNuevoAbono(item.tipo_credito, 1, "CUOTA", fecha_maxima_pago, valor_cuota, item.deuda_valor, item.numero_factura, valor_mora, item.cod_factura_venta);
  }

  sendGuardar()
  {
    this.listarPedidos(1);
  }

  recibirDatosEstadoAnulado(item: any): void {
    this.datos.find((x:any) => x.cod_factura_venta === item.cod_factura_venta).estado = 'ANULADA';
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}