import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ListadoClienteComponent } from 'src/app/shared/components/listado-cliente/listado-cliente.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ConfigService } from 'src/app/shared/services/config.service';

import { CreditoService } from 'src/app/cuentapc/services/credito.service';
import { NotaCreditoService } from '../../services/nota-credito.service';
import { ClienteService } from '../../services/cliente.service';
import { SaldoNotaCreditoService } from '../../services/saldo-nota-credito.service';
import { ListarVentasClienteComponent } from 'src/app/shared/components/venta/listar-ventas-cliente/listar-ventas-cliente.component';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-pago-nota-credito',
  templateUrl: './pago-nota-credito.component.html',
  styleUrls: ['./pago-nota-credito.component.css']
})
export class PagoNotaCreditoComponent implements OnInit {
  multisucursal : string = "0";
  electronico : string = "0";

  page = 1;
  count = 0;
  pagesize = 5;

  @ViewChild(ListadoClienteComponent) childlistadocliente: ListadoClienteComponent;
  @ViewChild(ListarVentasClienteComponent) childlistarventascliente: any;

  cod_sucursal : string = "";
  sucursal : string = "";
  datossucursal : any;
  datosformapago : any;
  datosdeuda : any;
  datossaldonotacredito : any;
  datoscreditos: any;

  loading : boolean = false;
  

  cod_cliente : string = "";
  cliente : string = "";
  cedula : string = "";

  fecha : string = "";

  cod_saldo_nota_credito : number = 0;
  numero_nota_credito : string = "";
  saldo_favor : string = "0";
  saldo_favor_editar : number = 0;
  cod_nota_credito : string = "";
  observacion : string = "";
  termino_deudor : number = 0;//0 Sin deudas y 1 Con deudas

  valor_compensacion : number = 0;//Valor de la cuota en créditos

  cod_factura_venta: string = "";
  importetotal: string = "";
  factura : string = "";

  detalle : string = "";

  ban : number = 0;

  disabledbtnnuevoabono : boolean = true;
  disabledbtnguardarabono : boolean = true;
  disabledbtnactualizarabono : boolean = true;

  colormensaje : string;
  textomensaje : string;

  seccioncompensacion : number = 0;

  saldo_favor_general : number = 0;

  loadinglistado : boolean = false;
  
  
  opcionesprivilegios : any;

  constructor(private toastr : ToastrService, private error : ErrorService, private sucursalesservice : SucursalesService, private formapagoservice : FormaPagoService, private notacreditoservice: NotaCreditoService, private creditoservice: CreditoService, private clienteservice: ClienteService, private saldonotacreditoservice: SaldoNotaCreditoService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
  }

  ngAfterViewInit(): void {
    this.childlistadocliente.listarClientes();
    this.formularioNormal();
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal()
  {
    this.page = 1;
    this.datosdeuda = [];
    this.datossaldonotacredito = [];
    this.datoscreditos = [];
    this.loading = false;
    

    this.cod_cliente = "";
    this.cliente = "";
    this.cedula = "";

    this.fecha = moment().format('YYYY-MM-DD');

    this.cod_nota_credito = "";
    this.numero_nota_credito = "";
    this.saldo_favor = "0";
    this.saldo_favor_editar = 0;

    this.cod_factura_venta = "";
    this.importetotal = "";
    this.factura = "";

    this.seccioncompensacion = 0;

    this.saldo_favor_general = 0;

    this.disabledbtnnuevoabono = true;
    this.disabledbtnguardarabono = true;
    this.disabledbtnactualizarabono = true;
  }

  clickListarCliente()
  {
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  recibirDatosCliente(datosrecibidoscliente: any)
  {
    this.seccioncompensacion = 0;
    this.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.cedula = datosrecibidoscliente.cedula;
    $("#mymodallistarclientes").modal("hide");
    this.listarNotasCreditosCliente();
  }

  buscarCliente()
  {
    this.datosdeuda = [];
    this.seccioncompensacion = 0;
    this.loading = true;
    
    this.clienteservice.buscar(this.cedula).subscribe( (data : any) =>
    {
      if(data.cod_cliente==false)
      {
        this.toastr.info("No se encuentra nota de credito de cliente con numero ingresado.", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_cliente = data.cod_cliente;
        this.cliente = data.apellido + " " + data.nombre;
        this.listarNotasCreditosCliente();
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarNotasCreditosCliente()
  {
    this.page = 1;
    this.saldo_favor_general = 0;
    this.datosdeuda = [];
    this.loadinglistado = true;
    
    this.notacreditoservice.listarNotasCreditosCliente(this.cod_cliente).subscribe( (data : any) =>
    {
      this.datosdeuda = data;
      data.forEach(element => {
        if(element.saldo_favor>=0)
        {
          this.saldo_favor_general = this.saldo_favor_general + parseFloat(element.saldo_favor);
        }
      });
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  buscarSaldoNotaCredito(item: any): void
  {
    this.cod_nota_credito = item.cod_nota_credito;
    this.numero_nota_credito = item.numero_nota_credito;
    this.termino_deudor = item.termino_deudor;
    this.saldo_favor = item.saldo_favor;
    this.valor_compensacion = item.valor_compensacion;

    if(parseFloat(this.saldo_favor)<=0)
    {
      this.disabledbtnnuevoabono = true;
    }
    else
    {
      this.disabledbtnnuevoabono = false;
    }
    
      this.listarSaldosNotaCredito(this.cod_nota_credito);//Lista los abonos
  }

  listarSaldosNotaCredito(cod_nota_credito : string)//Lista los abonos
  {
    this.datossaldonotacredito = [];
    this.loadinglistado = true;
    
    this.saldonotacreditoservice.listarSaldosNotaCredito(cod_nota_credito).subscribe( (data : any) =>
    {
      //console.log(data);
      this.datossaldonotacredito = data;
      this.loadinglistado = false;
      
      //this.listarCreditosCliente(this.cod_nota_credito);//Carga los créditos
      
      this.seccioncompensacion = 1;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarFacturasVentasPorCliente()//Lista los créditos
  {
    $("#mymodallistadoventascliente").modal("show");
    this.childlistarventascliente.cod_sucursal = this.cod_sucursal;
    this.childlistarventascliente.cod_cliente = this.cod_cliente;
    this.childlistarventascliente.listarFacturasVentasPorCliente();
    /*
    //this.fecha_maxima_pago = "";
    this.loadinglistado = true;
    this.datoscreditos = [];
    this.venta.listarFacturasVentasPorCliente(cod_cliente).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datoscreditos = data; 
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    */
  }

  clickNuevoRegistro()
  {
    let CurrentDate = moment().unix();
    this.cod_saldo_nota_credito = CurrentDate;
    this.disabledbtnguardarabono = true;
    
    this.valor_compensacion = null;

    this.cod_factura_venta = "";
    this.importetotal = "";
    this.factura = "";
    
    this.ban = 0;
    this.observacion = "";
    this.colormensaje = "";
    this.textomensaje = "";

    $("#mymodalregistrocompensacion").modal("show");
      
    this.calcularCompensacion();
  }

  calcularCompensacion()
  {
    if(this.valor_compensacion==null)
    {
      this.toastr.info("Ingrese una cantidad para compensación", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.ban==0)
      {
        if(this.valor_compensacion>=parseFloat(this.saldo_favor))
        {
          this.termino_deudor = 1;//Saldo Finalizada
          this.colormensaje = "#0000FF";
          this.textomensaje = "Saldo finalizada";
          this.valor_compensacion = parseFloat(this.saldo_favor);
        }
        else
        {
            let deuda_total = parseFloat(this.saldo_favor) - this.valor_compensacion;
            this.termino_deudor = 0;//Saldo Continua
            this.colormensaje = "#FF0000";
            this.textomensaje = "Saldo Pendiente : " + redondeardecimales(deuda_total, 2);
        }
        this.disabledbtnguardarabono = false;
      }
      else
      {
        if(this.valor_compensacion>=this.saldo_favor_editar)
        {
          this.termino_deudor = 1;//Saldo Finalizada
          this.colormensaje = "#0000FF";
          this.textomensaje = "Saldo finalizada";
          this.valor_compensacion = this.saldo_favor_editar;
        }
        else
        {
            let deuda_total = this.saldo_favor_editar - this.valor_compensacion;
            this.termino_deudor = 0;//Saldo Continua
            this.colormensaje = "#FF0000";
            this.textomensaje = "Saldo Pendiente : " + redondeardecimales(deuda_total, 2);
        }
        this.disabledbtnactualizarabono = false;
      }
    }
  }

  clickGuardarCompensacion()
  {
    /*if(this.cod_factura_venta=="")
    {
      this.toastr.info("Debe agregar un numero de factura para el registro de compensación", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {*/
      Swal.fire({
        title: '¿Desea registrar Compensación?',
        text: 'El abono se registrará',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Registrar',
        cancelButtonText: 'No, Registrar'
      }).then((result) => {
        if (result.value) {
          this.guardar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'No se realizó el registro',
            'error'
          )
        }
      });
    /*}*/
  }

  guardar(){
      this.loading = true;
      

      const parametros = {
        'cod_saldo_nota_credito' : this.cod_saldo_nota_credito,
        'cod_nota_credito' : this.cod_nota_credito,
        'cod_factura_venta' : this.cod_factura_venta,
        'fecha_registro' : this.fecha,
        'saldo_ocupado' : this.valor_compensacion,
        'observacion' : this.observacion
      };

      this.saldonotacreditoservice.guardar(parametros).subscribe( (data : any) =>
      {
        this.loading = false;
        

        if (data.estado == true)
        {
          this.toastr.success("Registro de Compensación Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          this.listarNotasCreditosCliente();
          $("#mymodalregistrocompensacion").modal("hide");
          this.seccioncompensacion = 0;
          this.exportarPdf(this.cod_saldo_nota_credito);
        }
        else
        {
          this.toastr.error("Registro de abono no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.loading = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  clickCerrarFacturas()
  {
    //this.listarCreditosCliente(this.cod_cliente);
    this.seccioncompensacion = 0;
  }

  exportarPdf(cod_saldo_nota_credito : number)
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/compensacion?cod_saldo_nota_credito=" + cod_saldo_nota_credito, "Compensación", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
    miVentana.focus();
  }

  revisarDetalles(detalle : string)
  {
    this.detalle = detalle;
    $("#mymodalrevisardetalles").modal("show");
  }

  editarCompensacion(cod_saldo_nota_credito : string)
  {
    const resultado = this.datossaldonotacredito.find( (valor : any) => valor.cod_saldo_nota_credito == cod_saldo_nota_credito );
    //console.log(this.datossaldonotacredito);
    this.cod_saldo_nota_credito = resultado.cod_saldo_nota_credito;
    this.ban = 1;
    this.observacion = resultado.observacion;
    this.cod_factura_venta = "";
    this.saldo_favor_editar = parseFloat(this.saldo_favor) + parseFloat(resultado.saldo_ocupado);
    this.valor_compensacion = resultado.valor;
    this.colormensaje = "";
    this.textomensaje = "";

    $("#mymodalregistrocompensacion").modal("show");
  }

  clickActualizarCompensacion()
  {
    if(this.cod_factura_venta=="")
    {
      this.toastr.info("Debe agregar un numero de factura para actualizar el registro de compensación", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      Swal.fire({
        title: '¿Desea actualizar Compensación?',
        text: 'El abono se actualizará',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Actualizar',
        cancelButtonText: 'No, Actualizar'
      }).then((result) => {
        if (result.value) {
          this.actualizar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'No se realizó la actualización',
            'error'
          )
        }
      });
    }
  }

  actualizar(){
      this.loading = true;

      const parametros = {
        'cod_saldo_nota_credito' : this.cod_saldo_nota_credito,
        'cod_factura_venta' : this.cod_factura_venta,
        'fecha_registro' : this.fecha,
        'saldo_ocupado' : this.valor_compensacion,
        'observacion' : this.observacion
      };

      this.saldonotacreditoservice.actualizar(parametros).subscribe( (data : any) =>
      {
        this.loading = false;

        if (data.estado == true)
        {
          this.toastr.success("Registro de Compensación Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          this.listarNotasCreditosCliente();
          $("#mymodalregistrocompensacion").modal("hide");
          this.seccioncompensacion = 0;
        }
        else
        {
          this.toastr.error("Registro de abono no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.loading = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  clickAnularCompensacion()
  {
    Swal.fire({
      title: '¿Desea anular Compensación?',
      text: 'El abono se anulará',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, Anular'
    }).then((result) => {
      if (result.value) {
        this.anular();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'No se realizó la actualización',
          'error'
        )
      }
    });
  }

  anular(){
      this.loading = true;
      

      const parametros = {
        'cod_saldo_nota_credito' : this.cod_saldo_nota_credito
      };

      this.saldonotacreditoservice.anular(parametros).subscribe( (data : any) =>
      {
        this.loading = false;

        if (data.estado == true)
        {
          this.toastr.success("Registro de Compensación Anulado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          this.listarNotasCreditosCliente();
          $("#mymodalregistrocompensacion").modal("hide");
          this.seccioncompensacion = 0;
        }
        else
        {
          this.toastr.error("Registro de abono no se pudo Anular, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.loading = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  visualizar(cod_nota_credito : string, tipo_venta : string)
  {
    if(tipo_venta=="FACTURA" || tipo_venta=="ELECTRONICA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/notacredito?codnotacredito=" + cod_nota_credito, "Devolución Venta", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
      
     if(tipo_venta=="RECIBO")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/devolucionrecibo?codnotacredito=" + cod_nota_credito, "Devolución Nota de Venta", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  recibirDatosFacturas(datosrecibidosfactura: any)
  {
    this.cod_factura_venta = datosrecibidosfactura.cod_factura_venta;
    this.importetotal = datosrecibidosfactura.importetotal
    this.factura = datosrecibidosfactura.serieestab + "-" + datosrecibidosfactura.ptoemi + "-" + this.padLeft(datosrecibidosfactura.numero_factura, 9);
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }
}