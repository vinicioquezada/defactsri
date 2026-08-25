import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { AbonoVentaService } from 'src/app/cuentapc/services/abono-venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { CreditoService } from 'src/app/cuentapc/services/credito.service';
import { Location } from '@angular/common';
import { CajeroService } from 'src/app/venta/services/cajero.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-registro-abono',
  templateUrl: './registro-abono.component.html',
  styleUrls: ['./registro-abono.component.css']
})
export class RegistroAbonoComponent implements OnInit {
  cod_sucursal : string = "";
  sucursal : string = "";
  datosformapago : any;

  loading : boolean = false;

  fecha : string = "";

  cod_abono : number = 0;
  numero_factura : string = "";
  deuda_valor : string = "0";
  deuda_valor_editar : number = 0;
  cod_factura_venta : string = "";
  observacion : string = "";
  termino_deudor : number = 0;//0 Sin deudas y 1 Con deudas
  tipo_credito : number = 0;//1 Con cuotas y 2 Sin Cuotas
  cod_tipo_abono : number = 1;//0 Entrada y 1 Cuota
  tipo_abono : string = "";//ENTRADA y CUOTA
  valor_cuota : number = 0;//Valor de la cuota en créditos

  fecha_maxima_pago : string = "";//Solo aplica en créditos
  valor_mora : number = 0;

  id_forma_pago : string = "";

  ban : number = 0;

  disabledbtnguardarabono : boolean = true;
  disabledbtnactualizarabono : boolean = true;

  colormensaje : string;
  textomensaje : string;

  loadinglistado : boolean = false;
  
  
  opcionesprivilegios : any;

  control_estricto_cajero : string = "";
  recaudador: string = "";

  cod_reserva : string = "";

  @Output() sendGuardar: EventEmitter<any> = new EventEmitter<any>();

  constructor(private toastr : ToastrService, private error : ErrorService, private sucursalesservice : SucursalesService, private abonoventaservice : AbonoVentaService, private formapagoservice : FormaPagoService, private creditoservice: CreditoService, private location: Location, private cajeroservice: CajeroService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    //this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    //this.electronico = this.usersession.getConfiguracion("electronico");
  
    //this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();

    this.control_estricto_cajero = this.opcionesprivilegios["controlestrictocajero"];
    this.recaudador = this.usersession.getConfiguracion("recaudador");

    this.formularioNormal();
    this.listarFormaPagos();
  
  }

  verificarCajaAbiertaUsuario()
  {
    this.loading = true;
    this.cajeroservice.verificarCajaAbiertaUsuario(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      if(data.cod_cajero==false)
      {
        Swal.fire({
          title: "Control del Sistema",
          text: "Debe aperturar caja primero antes de realizar venta",
          icon: "info",
          confirmButtonText: 'OK'
        }).then( (result) => {
          if (result.value) {
            this.location.back();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
      else
      {
        this.calcularMora();
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }
  
  verificarCajaAbiertaUsuarioRecaudador()
  {
    this.loading = true;
    this.cajeroservice.verificarCajaAbiertaUsuarioRecaudador(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      if(data.cod_cajero==false)
      {
        Swal.fire({
          title: "Control del Sistema",
          text: "Debe aperturar caja primero antes de realizar venta",
          icon: "info",
          confirmButtonText: 'OK'
        }).then( (result) => {
          if (result.value) {
            this.location.back();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
      else
      {
        this.calcularMora();
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  clickDeshacer()
  {
    this.formularioNormal();
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

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
  }

  formularioNormal()
  {
    this.fecha = moment().format('YYYY-MM-DD');

    this.cod_factura_venta = "";
    this.numero_factura = "";
    this.deuda_valor = "0";
    this.deuda_valor_editar = 0;
    this.tipo_credito = 0;

    this.disabledbtnguardarabono = true;
    this.disabledbtnactualizarabono = true;
  }

  clickNuevoAbono(tipo_credito: number, cod_tipo_abono: number, tipo_abono: string, fecha_maxima_pago: string, valor_cuota: number, deuda_valor: string, numero_factura: string, valor_mora: number, cod_factura_venta: string)
  {
    this.cod_factura_venta = cod_factura_venta;
    this.numero_factura = numero_factura;
    this.deuda_valor = deuda_valor;
    this.tipo_credito = tipo_credito;
    let CurrentDate = moment().unix();
    this.cod_abono = CurrentDate;
    this.disabledbtnguardarabono = true;
    this.cod_tipo_abono = cod_tipo_abono;//0 Entrada y 1 Cuota
    this.tipo_abono = tipo_abono;//ENTRADA y CUOTA
    this.id_forma_pago = "01";
    if(this.tipo_credito==1)//Con cuotas
    {
      this.valor_cuota = null;
    }
    this.ban = 0;
    this.valor_mora = valor_mora;
    this.observacion = "";
    this.colormensaje = "";
    this.textomensaje = "";

    this.fecha_maxima_pago = fecha_maxima_pago;
    this.valor_cuota = valor_cuota;
    
    if(this.control_estricto_cajero == "1")
    {
      if(this.recaudador == "1")
      {
        this.verificarCajaAbiertaUsuarioRecaudador();
      }
      else
      {
        this.verificarCajaAbiertaUsuario();
      }
      
    }
    else
    {
      this.calcularMora();
    }
  }

  calcularMora()
  {
    this.loading = true;
    this.abonoventaservice.calcularMora(this.fecha_maxima_pago, this.valor_cuota).subscribe( (data : any) =>
    {
      this.loading = false;

      this.valor_mora = data.valor;
      $("#mymodalregistroabono").modal("show");
      
      if(this.tipo_credito==2)//Con cuotas
      {
        this.calcularAcredorAbono();
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  calcularAcredorAbono()
  {
    if(this.valor_cuota==null)
    {
      this.toastr.warning("Ingrese una cantidad para abonar.", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.ban==0)
      {
        if(this.valor_cuota>=parseFloat(this.deuda_valor))
        {
          this.termino_deudor = 1;//Deuda Finalizada
          this.colormensaje = "#0000FF";
          this.textomensaje = "Deuda finalizada";
          this.valor_cuota = parseFloat(this.deuda_valor);
        }
        else
        {
            let deuda_total = parseFloat(this.deuda_valor) - this.valor_cuota;
            this.termino_deudor = 0;//Deuda Continua
            this.colormensaje = "#FF0000";
            this.textomensaje = "Deuda Pendiente : " + redondeardecimales(deuda_total, 2);
        }
        this.disabledbtnguardarabono = false;
      }
      else
      {
        if(this.valor_cuota>=this.deuda_valor_editar)
        {
          this.termino_deudor = 1;//Deuda Finalizada
          this.colormensaje = "#0000FF";
          this.textomensaje = "Deuda finalizada";
          this.valor_cuota = this.deuda_valor_editar;
        }
        else
        {
            let deuda_total = this.deuda_valor_editar - this.valor_cuota;
            this.termino_deudor = 0;//Deuda Continua
            this.colormensaje = "#FF0000";
            this.textomensaje = "Deuda Pendiente : " + redondeardecimales(deuda_total, 2);
        }
        this.disabledbtnactualizarabono = false;
      }
    }
  }

  clickGuardarAbono()
  {
    Swal.fire({
      title: '¿Desea registrar Abono?',
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
  }

  guardar(){
      this.loading = true;
      

      const parametros = {
        'cod_abono_venta' : this.cod_abono,
        'tipo_abono' : this.cod_tipo_abono,
        'cod_factura_venta' : this.cod_factura_venta,
        'valor' : this.valor_cuota,
        'valor_mora' : this.valor_mora,
        'fecha_registro' : this.fecha,
        'fecha_maximo_pago' : this.fecha_maxima_pago,
        'termino_deudor' : this.termino_deudor,
        'id_forma_pago' : this.id_forma_pago,
        'observacion' : this.observacion,
        'tipo_credito' : this.tipo_credito,
        'cod_reserva' : this.cod_reserva
      };

      this.abonoventaservice.guardar(parametros).subscribe( (data : any) =>
      {
        this.loading = false;
        

        if (data.estado == true)
        {
          this.toastr.success("Registro de Abono Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          $("#mymodalregistroabono").modal("hide");
          this.exportarPdf(this.cod_abono);
          this.sendGuardar.emit();
        }
        else
        {
          this.toastr.error("Registro de abono no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
        
    });
  }

  exportarPdf(cod_abono : number)
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/cuentaspc/abonoventa?cod_abono_venta=" + cod_abono, "", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  editarAbono(item : any, numero_factura: string, deuda_valor: string)
  {
    this.deuda_valor = deuda_valor;
    this.numero_factura = numero_factura;
    this.cod_abono = item.cod_abono_venta;
    this.cod_tipo_abono = item.tipo_abono;//0 Entrada y 1 Cuota
    this.tipo_abono = "CUOTA";//ENTRADA y CUOTA
    this.id_forma_pago = item.id_forma_pago;
    this.ban = 1;
    this.valor_mora = 0;
    this.observacion = item.observacion;
    this.deuda_valor_editar = parseFloat(this.deuda_valor) + parseFloat(item.valor);
    this.valor_cuota = item.valor;
    this.colormensaje = "";
    this.textomensaje = "";

    $("#mymodalregistroabono").modal("show");
  }

  clickActualizarAbono()
  {
    Swal.fire({
      title: '¿Desea actualizar Abono?',
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

  actualizar(){
      this.loading = true;
      

      const parametros = {
        'cod_abono_venta' : this.cod_abono,
        'tipo_abono' : this.cod_tipo_abono,
        'cod_factura_venta' : this.cod_factura_venta,
        'valor' : this.valor_cuota,
        'valor_mora' : this.valor_mora,
        'fecha_registro' : this.fecha,
        'fecha_maximo_pago' : this.fecha_maxima_pago,
        'termino_deudor' : this.termino_deudor,
        'id_forma_pago' : this.id_forma_pago,
        'observacion' : this.observacion,
        'tipo_credito' : this.tipo_credito,
        'cod_reserva' : this.cod_reserva
      };

      this.abonoventaservice.actualizar(parametros).subscribe( (data : any) =>
      {
        this.loading = false;
        

        if (data.estado == true)
        {
          this.toastr.success("Registro de Abono Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          $("#mymodalregistroabono").modal("hide");
          this.sendGuardar.emit();
        }
        else
        {
          this.toastr.error("Registro de abono no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
        
    });
  }

  clickAnularAbono()
  {
    Swal.fire({
      title: '¿Desea anular Abono?',
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
        'cod_abono_venta' : this.cod_abono,
        'tipo_credito' : this.tipo_credito,
        'cod_reserva' : this.cod_reserva
      };
      this.abonoventaservice.anular(parametros).subscribe( (data : any) =>
      {
        this.loading = false;
        if (data.estado == true)
        {
          this.toastr.success("Registro de Abono Anulado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          $("#mymodalregistroabono").modal("hide");
          this.sendGuardar.emit();
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
}