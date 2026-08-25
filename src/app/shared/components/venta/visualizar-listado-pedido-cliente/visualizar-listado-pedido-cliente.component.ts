import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { VentaService } from 'src/app/venta/services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ActivatedRoute, Router } from '@angular/router';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { PedidoPanaderiaComponent } from '../pedido-panaderia/pedido-panaderia.component';
import { RegistroAbonoComponent } from '../../registro-abono/registro-abono.component';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { OpcionesExploradorPedidoComponent } from '../opciones-explorador-pedido/opciones-explorador-pedido.component';
import * as CryptoJS from 'crypto-js';
import { first } from 'rxjs';

@Component({
  selector: 'app-visualizar-listado-pedido-cliente',
  templateUrl: './visualizar-listado-pedido-cliente.component.html',
  styleUrls: ['./visualizar-listado-pedido-cliente.component.css']
})
export class VisualizarListadoPedidoClienteComponent implements OnInit {
  @Output() datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(PedidoPanaderiaComponent) childpedidopanaderia: any;
  @ViewChild(RegistroAbonoComponent) childregistroabono: RegistroAbonoComponent;
  @ViewChild(OpcionesExploradorPedidoComponent) childopcionesexploradorpedido: OpcionesExploradorPedidoComponent;
  
  opcionesprivilegios : any;

  estado : string = "";

  multisucursal : string = "0";
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

  numero_factura : string = "";

  cliente: string = "";

  proceso : string = "";
  checktodos: boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private route: ActivatedRoute, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
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
    this.listarPedidosPorCliente(1);
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

      this.proceso = "0";
      this.checktodos = false;

      this.page = 1;
      this.filterpost="";
      this.estado = "T";
      this.datos = [];
      this.cod_sucursal = params["cod_sucursal"];
      this.cod_cliente = params["cod_cliente"];
      this.cliente = params["cliente"];
      this.fechadesde = params["fechadesde"];
      this.fechahasta = params["fechahasta"];
      this.listarPedidosPorCliente(1);
    });
  }
 
  listarPedidosPorCliente(page: number)
  {
    this.page = page;
    this.filterpost="";

    this.loadinglistado = true;

    this.ventaservice.listarPedidosPorCliente(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_cliente).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  verDetallesPedido(cod_factura_venta: string, numero_factura: string, cliente : string)
  {
    /*
    this.cod_factura_venta = cod_factura_venta;
    this.numero_factura = numero_factura;
    */
    this.cliente = cliente;
    this.childpedidopanaderia.formularioNormal("modificar", cod_factura_venta);
    $("#mymodalverdetallespedido").modal("show");
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
    this.listarPedidosPorCliente(1);
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

  recibirDatosEstadoAnulado(item: any): void {
    this.datos.find((x:any) => x.cod_factura_venta === item.cod_factura_venta).estado = 'ANULADA';
  }

  changeProceso(event: any): void {
    const elemento = event.target.value;
    this.proceso = elemento;
    this.checktodos = false;
    this.datos = this.datos.map(item => ({ ...item, seleccion: false, fila_error: false }));
  }

  changeCheckedTodos(event: any) {
    const isChecked = event.target.checked;
    
    if(this.proceso=="PEDIDO RESERVADO")
    {
      this.datos = this.datos.map(item => ({
          ...item,
          seleccion: 
              (item.estado == 'CREADA' && item.deuda_valor <= 0 && item.tipo_venta=='PEDIDO RESERVADO' && item.estado_pedido==0) 
              ? isChecked 
              : item.seleccion
      }));
    }

    if(this.proceso=="PEDIDO CON SALIDA")
    {
      this.datos = this.datos.map(item => ({
          ...item,
          seleccion: 
              (item.estado == 'CREADA' && item.deuda_valor <= 0 && item.tipo_venta=='PEDIDO CON SALIDA' && item.estado_pedido==0) 
              ? isChecked 
              : item.seleccion
      }));
    }

    if(this.proceso=="PEDIDO ACUMULATIVO")
    {
      this.datos = this.datos.map(item => ({
          ...item,
          seleccion: 
              (item.estado == 'CREADA' && item.tipo_venta=='PEDIDO ACUMULATIVO' && item.estado_pedido==0) 
              ? isChecked 
              : item.seleccion
      }));
      //&& item.deuda_valor <= 0 && item.tipo_venta=='PEDIDO ACUMULATIVO' && item.estado_pedido==0
    }
  }

  changeChecked(item: any) {
    item.seleccion = !item.seleccion;
  }


  verificarProceso(item: any)
  {
    let valor = true;
    if(this.proceso=="PEDIDO RESERVADO")
    {
      if(item.estado == "CREADA" && item.deuda_valor <= 0 && item.tipo_venta=='PEDIDO RESERVADO' && item.estado_pedido==0)
      {
        valor = false;
      }
    }

    if(this.proceso=="PEDIDO CON SALIDA")
    {
      if(item.estado == "CREADA" && item.deuda_valor <= 0 && item.tipo_venta=='PEDIDO CON SALIDA' && item.estado_pedido==0)
      {
        valor = false;
      }
    }

    if(this.proceso=="PEDIDO ACUMULATIVO")
    {
      if(item.estado == "CREADA" && item.tipo_venta=='PEDIDO ACUMULATIVO' && item.estado_pedido==0)
      {
        valor = false;
      }
    }

    return valor;
  }

  clickFacturarSeleccionados()
  {
    //console.log(this.datos);

    const datosenvio = this.datos
    .filter(item => item.seleccion === true)
    .map(item => ({
      cod_factura_venta: item.cod_factura_venta
    }));

    
    if(datosenvio.length > 0)
    {
      if(this.proceso=="PEDIDO RESERVADO")
      {
        this.router.navigate(["/menuventa/venta", "finalizarvariospedidosreservados", datosenvio[0].cod_factura_venta],
          { state: { datosenvio } }
        );

      }

      if(this.proceso=="PEDIDO CON SALIDA")
      {
        this.router.navigate(["/menuventa/venta", "finalizarvariospedidosconsalida", datosenvio[0].cod_factura_venta],
          { state: { datosenvio } }
        );
      }

      if(this.proceso=="PEDIDO ACUMULATIVO")
      {
        console.log(datosenvio);
        this.router.navigate(["/menuventa/venta", "finalizarvariospedidosacumulativos", datosenvio[0].cod_factura_venta],
          { state: { datosenvio } }
        );
      }
    }
    else
    {
      this.toastr.warning("Selecciona al menos un pedido para facturar", "INFORMACIÓN DEL SISTEMA");
    }
  }
  
  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  generarHash(data: any): string {
    return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
  }
}