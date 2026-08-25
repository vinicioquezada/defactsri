import { Component, EventEmitter, OnInit , Output, ViewChild} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { PedidoPanaderiaComponent } from 'src/app/shared/components/venta/pedido-panaderia/pedido-panaderia.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { RegistroAbonoComponent } from 'src/app/shared/components/registro-abono/registro-abono.component';

@Component({
  selector: 'app-opciones-explorador-pedido',
  templateUrl: './opciones-explorador-pedido.component.html',
  styleUrls: ['./opciones-explorador-pedido.component.css']
})
export class OpcionesExploradorPedidoComponent implements OnInit {
  @Output() datosenvioestadoanulado: EventEmitter<any> = new EventEmitter<any>();
  
  kardex : string = "";
  datos : any;

  cod_sucursal : string = "";

  estado_select : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  claveacceso : string = "";

  numero_factura : string = "";
  cliente : string = "";
  cod_factura_venta : string = "";
  tipo_venta : string = "";
  ptoemi : string = "";

  loading : boolean = false;
  loadinglistado : boolean = false;
  loadingmodal : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtncopiar : boolean = true;
  disabledbtnanular : boolean = false;

  estado_pedido: number=0;

  @ViewChild(PedidoPanaderiaComponent) childpedidopanaderia: any;
  @ViewChild(RegistroAbonoComponent) childregistroabono: RegistroAbonoComponent;

  page = 1;

  constructor(private router : Router, private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.kardex = this.usersession.getConfiguracion("kardex");
  }

  visualizar()
  {
    if(this.tipo_venta=="PEDIDO RESERVADO" || this.tipo_venta=="PEDIDO CON SALIDA" || this.tipo_venta=="PEDIDO ACUMULATIVO")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedido?codfacturaventa=" + this.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }

    if(this.tipo_venta=="PEDIDO PANADERIA")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedidopanaderia?codfacturaventa=" + this.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
    }
  }
  
  copiar()
  {
    this.mantenerEstados();
    if(this.tipo_venta=="PEDIDO RESERVADO")
    {
      this.router.navigate(["/menuventa/venta", "finalizarpedidoreservado", this.cod_factura_venta]);
    }

    if(this.tipo_venta=="PEDIDO CON SALIDA")
    {
      this.router.navigate(["/menuventa/venta", "finalizarpedidoconsalida", this.cod_factura_venta]);
    }

    if(this.tipo_venta=="PEDIDO ACUMULATIVO")
    {
      this.router.navigate(["/menuventa/venta", "finalizarpedidoacumulativo", this.cod_factura_venta]);
    }

    if(this.tipo_venta=="PEDIDO PANADERIA")
    {
      this.router.navigate(["/menuventa/venta", "finalizarpedidopanaderia", this.cod_factura_venta]);
    }
  }

  opciones(cod_factura_venta: string, numero_factura: string, estado: string, tipo_venta: string, cliente : string, claveacceso : string, deuda_valor : number, estado_pedido : number)
  {
    this.cod_factura_venta = cod_factura_venta;
    this.numero_factura = numero_factura;
    this.tipo_venta = tipo_venta;
    this.cliente = cliente;
    this.claveacceso = claveacceso;
    this.estado_pedido = estado_pedido;

    this.disabledbtneditar = true;
    this.disabledbtncopiar = true;

    if(estado=="ANULADA")
    {
      this.disabledbtnanular = true
    }

    if(estado_pedido==0 && estado!="ANULADA" && (tipo_venta=="PEDIDO RESERVADO" || tipo_venta=="PEDIDO CON SALIDA" || tipo_venta=="PEDIDO PANADERIA" || tipo_venta=="PEDIDO ACUMULATIVO")) {
      this.disabledbtneditar = false;
      this.disabledbtnanular = false;
    }

    if(deuda_valor<=0 && estado_pedido==0 && estado!="ANULADA" && (tipo_venta=="PEDIDO RESERVADO" || tipo_venta=="PEDIDO CON SALIDA" || tipo_venta=="PEDIDO PANADERIA" || tipo_venta=="PEDIDO ACUMULATIVO")) {
      this.disabledbtncopiar = false;
    }

    if(estado_pedido==0 && estado!="ANULADA" && tipo_venta=="PEDIDO ACUMULATIVO") {
      this.disabledbtncopiar = false;
    }

   
    $("#mymodalopciones").modal("show");
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
    this.tipo_venta = "";
    this.claveacceso = "";
   
    this.numero_factura = "";
    this.cod_factura_venta = "";

    this.datos = [];
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_pedidos");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("estado", this.estado_select);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }

  clickAnular()
  {
    Swal.fire({
      title: 'ANULAR PEDIDO Nº '  + this.numero_factura + ' - ' + this.cliente,
      text: 'Confirmar para anular el registro seleccionado',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, Anular'
    }).then((result) => {
      if (result.value) {
        this.anularFacturaVenta();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  anularFacturaVenta = () =>{
      this.guardarAnulacionFactura();
  }

  guardarAnulacionFactura = () =>{

    this.loadingmodal = true;

    const parametros = {
      'cod_factura_venta' : this.cod_factura_venta,
      'claveacceso' : this.claveacceso,
      'kardex' : this.kardex,
      'estado_pedido' : this.estado_pedido,
      'tipo_venta' : this.tipo_venta
    };

    this.ventaservice.anularPedidoVenta(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;

        if (data.estado == true)
        {
          this.toastr.success("Pedido Anulado Correctamente, se restablecieron valores del inventario", "INFORMACIÓN DEL SISTEMA");
          $("#mymodalopciones").modal("hide");
          this.datosenvioestadoanulado.emit(parametros);
        }
        else
        {
         this.toastr.error("No se pudo anular Factura de Venta, vuelva a intentar por favor", "INFORMACIÓN DEL SISTEMA");
        }
        
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  editarPedido()
  {
    this.mantenerEstados();
    this.router.navigate(["/menuventa/pedido", "actualizarregistro", this.cod_factura_venta]);
  }
}