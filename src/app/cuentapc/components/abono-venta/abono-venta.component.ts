import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { AbonoVentaService } from '../../services/abono-venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ListadoClienteComponent } from 'src/app/shared/components/listado-cliente/listado-cliente.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ConfigService } from 'src/app/shared/services/config.service';

import { CreditoService } from '../../services/credito.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { RegistroAbonoComponent } from 'src/app/shared/components/registro-abono/registro-abono.component';

@Component({
  selector: 'app-abono-venta',
  templateUrl: './abono-venta.component.html',
  styleUrls: ['./abono-venta.component.css']
})
export class AbonoVentaComponent implements OnInit {
  multisucursal : string = "0";
  electronico : string = "0";

  page = 1;
  count = 0;
  pagesize = 5;

  @ViewChild(ListadoClienteComponent) childlistadocliente: any;
  @ViewChild(RegistroAbonoComponent) childregistroabono: RegistroAbonoComponent;

  cod_sucursal : string = "";
  sucursal : string = "";
  datossucursal : any;
  datosdeuda : any;
  datosabono : any;
  datoscreditos: any;
  loading : boolean = false;
  cod_cliente : string = "";
  cliente : string = "";
  cedula : string = "";
  fecha : string = "";
  numero_factura : string = "";
  deuda_valor : string = "0";
  cod_factura_venta : string = "";
  termino_deudor : number = 0;//0 Sin deudas y 1 Con deudas
  tipo_credito : number = 0;//1 Con cuotas y 2 Sin Cuotas
  valor_cuota : number = 0;//Valor de la cuota en créditos
  detalle : string = "";
  fecha_maxima_pago : string = "";//Solo aplica en créditos
  valor_mora : number = 0;
  disabledbtnnuevoabono : boolean = true;
  secciondeudas : number = 0;
  deuda_general : number = 0;
  loadinglistado : boolean = false;
  opcionesprivilegios : any;

  constructor(private toastr : ToastrService, private error : ErrorService, private sucursalesservice : SucursalesService, private abonoventaservice : AbonoVentaService, private creditoservice: CreditoService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
  
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();

    this.listarSucursales();
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  listarSucursales()
  {    
    this.loading = true;
    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
      this.sucursal = resultado.sucursal;
      this.childlistadocliente.listarClientesPorCobrar(this.cod_sucursal);
      this.formularioNormal();
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  formularioNormal()
  {
    this.page = 1;
    this.datosdeuda = [];
    this.datosabono = [];
    this.datoscreditos = [];
    this.loading = false;
    

    this.cod_cliente = "";
    this.cliente = "";
    this.cedula = "";

    this.fecha = moment().format('YYYY-MM-DD');

    this.cod_factura_venta = "";
    this.numero_factura = "";
    this.deuda_valor = "0";
    this.tipo_credito = 0;

    this.secciondeudas = 0;

    this.deuda_general = 0;

    this.disabledbtnnuevoabono = true;
  }

  clickListarCliente()
  {
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  recibirDatosCliente(datosrecibidoscliente: any)
  {
    this.secciondeudas = 0;
    this.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.cedula = datosrecibidoscliente.cedula;
    $("#mymodallistarclientes").modal("hide");
    this.listarCuentasCobrarCliente();
  }

  buscarClientesPorCobrar()
  {
    this.datosdeuda = [];
    this.secciondeudas = 0;
    this.loading = true;
    
    this.abonoventaservice.buscarClientesPorCobrar(this.cod_sucursal, this.cedula).subscribe( (data : any) =>
    {
      if(data.cod_cliente==false)
      {
        this.toastr.info("No se encuentra deuda de cliente con numero ingresado.", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_cliente = data.cod_cliente;
        this.cliente = data.apellido + " " + data.nombre;
        this.listarCuentasCobrarCliente();
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarCuentasCobrarCliente()
  {
    this.page = 1;
    this.deuda_general = 0;
    this.datosdeuda = [];
    this.loadinglistado = true;
    
    this.abonoventaservice.listarCuentasCobrarCliente(this.cod_cliente).subscribe( (data : any) =>
    {
      this.datosdeuda = data;
      data.forEach(element => {
        if(element.deuda_valor>=0)
        {
          this.deuda_general = this.deuda_general + parseFloat(element.deuda_valor);
        }
      });
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  buscarAbono(item: any): void
  {
    this.cod_factura_venta = item.cod_factura_venta;
    this.numero_factura = item.numero_factura;
    this.termino_deudor = item.termino_deudor;
    this.deuda_valor = item.deuda_valor;
    this.tipo_credito = item.tipo_credito;
    this.valor_cuota = item.valor_cuota;

    if(parseFloat(this.deuda_valor)<=0)
    {
      this.disabledbtnnuevoabono = true;
    }
    else
    {
      this.disabledbtnnuevoabono = false;
    }
    
      this.listarAbonosCobrarCliente(this.cod_factura_venta);//Lista los abonos
    }

  listarAbonosCobrarCliente(cod_factura_venta : string)//Lista los abonos
  {
    this.datosabono = [];
    this.loadinglistado = true;
    
    this.abonoventaservice.listarAbonosCobrarCliente(cod_factura_venta).subscribe( (data : any) =>
    {
      //console.log(data);
      this.datosabono = data;
      this.loadinglistado = false;
      if(this.tipo_credito==2)//Con crédito
      {
        this.listarCreditosCliente(this.cod_factura_venta);//Carga los créditos
      }
      this.secciondeudas = 1;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarCreditosCliente(cod_factura_venta : string)//Lista los créditos
  {
    //this.fecha_maxima_pago = "";
    this.loadinglistado = true;
    this.datoscreditos = [];
    this.creditoservice.listarCreditosCliente(cod_factura_venta).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datoscreditos = data; 
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  
  clickNuevoAbono()
  {
    if(this.tipo_credito==1)//Con cuotas
    {
      this.valor_cuota = null;
    }
    this.childregistroabono.clickNuevoAbono(this.tipo_credito, 1, "CUOTA", this.fecha_maxima_pago, this.valor_cuota, this.deuda_valor, this.numero_factura, this.valor_mora, this.cod_factura_venta);
  }

  sendGuardar()
  {
    this.listarCuentasCobrarCliente();
    this.secciondeudas = 0;
  }

  clickCerrarAbonos()
  {
    this.listarCuentasCobrarCliente();
    this.secciondeudas = 0;
  }

  exportarPdf(cod_abono : number)
  {
    this.childregistroabono.exportarPdf(cod_abono);
  }

  revisarDetalles(detalle : string)
  {
    this.detalle = detalle;
    $("#mymodalrevisardetalles").modal("show");
  }

  editarAbono(cod_abono_venta : string)
  {
    const item = this.datosabono.find( (valor : any) => valor.cod_abono_venta == cod_abono_venta );
    if(item)
    {
      this.childregistroabono.editarAbono(item, this.numero_factura, this.deuda_valor);
    }
    else
    {
      this.toastr.error("No se encontró el registro del abono", "INFORMACIÓN DEL SISTEMA");
    }
  }

  visualizar(cod_factura_venta : string, tipo_venta : string)
  {
    if(tipo_venta=="FACTURA" || tipo_venta=="ELECTRONICA")
    {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventa?codfacturaventa=" + cod_factura_venta + "&electronico=" + this.electronico, "Factura de Venta", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
    }
    
   if(tipo_venta=="RECIBO")
   {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/recibo?codfacturaventa=" + cod_factura_venta, "Nota de Venta", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
   }
 
   if(tipo_venta=="PROFORMA")
   {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/proforma?codfacturaventa=" + cod_factura_venta, "Proforma", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
   }

   if(tipo_venta=="PEDIDO RESERVADO")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedido?codfacturaventa=" + cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }

    if(tipo_venta=="PEDIDO PANADERIA")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedidopanaderia?codfacturaventa=" + cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}