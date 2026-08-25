import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturaReservaService } from '../../services/factura-reserva.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { AbonoVentaService } from 'src/app/cuentapc/services/abono-venta.service';
import { AbonoReservaService } from '../../services/abono-reserva.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { OpcionesExploradorVentaComponent } from 'src/app/shared/components/venta/opciones-explorador-venta/opciones-explorador-venta.component';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { RegistroAbonoComponent } from 'src/app/shared/components/registro-abono/registro-abono.component';

@Component({
  selector: 'app-explorador-pagos',
  templateUrl: './explorador-pagos.component.html',
  styleUrls: ['./explorador-pagos.component.css']
})
export class ExploradorPagosComponent implements OnInit {
  @ViewChild(OpcionesExploradorVentaComponent) opcionesexploradorventacomponent: any;
  @ViewChild(RegistroAbonoComponent) childregistroabono: RegistroAbonoComponent;
  tipoformulario: string = "exploradorventahotel";

  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  disabledbtnpagarhabitacion : boolean = true;

  cod_sucursal : string = "";

  loading : boolean = false;
  loadinglistado : boolean = false;

  cod_reserva : string = "";
  cod_cliente : string = "";

  numero_factura : string = "";
  cod_factura_venta : string = "";
  sucursal : string = "";
  datosformapago : any;
  datosabono : any;
  fecha : string = "";
  cod_abono : number = 0;
  deuda_valor : string = "0";
  deuda_valor_editar : number = 0;
  observacion : string = "";
  termino_deudor : number = 0;//0 Sin deudas y 1 Con deudas
  tipo_credito : number = 0;//1 Con cuotas y 2 Sin Cuotas
  cod_tipo_abono : number = 1;//0 Entrada y 1 Cuota
  tipo_abono : string = "";//ENTRADA y CUOTA
  valor_cuota : number = 0;//Valor de la cuota en créditos
  detalle : string = "";
  fecha_maxima_pago : string = "";//Solo aplica en créditos
  valor_mora : number = 0;
  id_forma_pago : string = "";
  ban : number = 0;
  disabledbtnnuevoabono : boolean = true;
  disabledbtnguardarabono : boolean = true;
  disabledbtnactualizarabono : boolean = true;
  colormensaje : string;
  textomensaje : string;
  secciondeudas : number = 0;
  descripcion: string = "";

  datosrucempresa : any = [];
  
  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private location: Location, private router : Router, private rutaActiva: ActivatedRoute, private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private facturareservaservice : FacturaReservaService, private abonoventaservice : AbonoVentaService, private formapagoservice : FormaPagoService, private abonoreservaservice : AbonoReservaService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private rucempresaservice : RucEmpresaService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_reserva = this.rutaActiva.snapshot.paramMap.get("cod_reserva")!;
    this.cod_cliente = this.rutaActiva.snapshot.paramMap.get("cod_cliente")!;
    this.descripcion = this.rutaActiva.snapshot.paramMap.get("descripcion")!;
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
    this.bodyStyleService.resetBodyStyles();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  goBack(){
    this.location.back();
  }

  clickpagarhabitacion()
  {
    let codigo = this.rutaActiva.snapshot.paramMap.get("codigo")!;
    this.router.navigate(["/menuhotel/facturareserva", "nuevoregistro",  this.cod_reserva, this.cod_cliente, codigo]);
  }

  clicknuevafactura()
  {
    let codigo = "0";//No busca el codigo
    this.router.navigate(["/menuhotel/facturareserva", "nuevoregistro",  this.cod_reserva, this.cod_cliente, codigo]);
  }


  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    this.listarRucEmpresas();
  }

  listarRucEmpresas()
  {
    this.loading = true;
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosrucempresa = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.opcionesexploradorventacomponent.formularioNormal();
    this.listarRucEmpresas();
    this.listarFacturas();
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

      this.opcionesexploradorventacomponent.opciones(item);
      this.opcionesexploradorventacomponent.cod_reserva = this.cod_reserva;
      $("#mymodalopciones").modal("show");
    }
    else
    {
      this.toastr.error("No se encontró el RUC en la venta, vuelva a buscar", "INFORMACIÓN DEL SISTEMA");
    }
      
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.datos = [];
  }
 
  listarFacturas()
  {
    this.page = 1;
    this.loadinglistado = true;
    
    this.facturareservaservice.listarFacturasReservas(this.cod_reserva).subscribe( (data : any) =>
    {
      this.datos = data;
      try
      {
        if(this.datos.length>0)
        {
          const resultado = this.datos.find( (valor : any) => valor.tipo_pago == 0);
          this.disabledbtnpagarhabitacion = true;
        }
        else
        {
          this.disabledbtnpagarhabitacion = false;
        }
      }
      catch(e)
      {
        this.disabledbtnpagarhabitacion = false;
      }

      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  listarSucursales()
  {
    this.datossucursal = [];
    this.loadinglistado = true;
    
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.formularioNormal();
      this.listarRucEmpresas();
      this.listarFacturas();
      this.listarFormaPagos();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarFormaPagos()
  {    
    this.loading = true;
    

    this.formapagoservice.listarFormaPagos().subscribe( (data : any) =>
    {
      this.datosformapago = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  /*Inicia Abonos*/
  buscarAbono(index: number): void
  {
    this.cod_factura_venta = this.datos[index].cod_factura_venta;
    this.numero_factura = this.datos[index].numero_factura;
    this.termino_deudor = this.datos[index].termino_deudor;
    this.deuda_valor = String(this.datos[index].deuda_valor);
    this.tipo_credito = this.datos[index].tipo_credito;
    this.valor_cuota = this.datos[index].valor_cuotao;

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
      
      this.secciondeudas = 1;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  clickCerrarAbonos()
  {
    this.listarFacturas();
    this.secciondeudas = 0;
  }

  clickNuevoAbono()
  {
    if(this.tipo_credito==1)//Con cuotas
    {
      this.valor_cuota = null;
    }
    this.childregistroabono.cod_reserva = this.cod_reserva;
    this.childregistroabono.clickNuevoAbono(this.tipo_credito, 1, "CUOTA", this.fecha_maxima_pago, this.valor_cuota, this.deuda_valor, this.numero_factura, this.valor_mora, this.cod_factura_venta);
  }

  editarAbono(cod_abono_venta : string)
  {
    const item = this.datosabono.find( (valor : any) => valor.cod_abono_venta == cod_abono_venta );
    if(item)
    {
      this.childregistroabono.cod_reserva = this.cod_reserva;
      this.childregistroabono.editarAbono(item, this.numero_factura, this.deuda_valor);
    }
    else
    {
      this.toastr.error("No se encontró el registro del abono", "INFORMACIÓN DEL SISTEMA");
    }
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

  sendGuardar()
  {
    this.listarFacturas();
    this.secciondeudas = 0;
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
  }
  /*Termnina Abonos*/

  recibirDatosEstado(item: any): void {
    this.datos.find((x:any) => x.cod_factura_venta === item.cod_factura_venta).estado = item.estado;
  }

  recibirDatosCorreo(item: any): void {
    this.datos.find((x:any) => x.cod_factura_venta === item.cod_factura_venta).envio = item.envio;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}