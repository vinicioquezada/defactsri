import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { AbonoCompraService } from '../../services/abono-compra.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ListadoProveedorComponent } from 'src/app/shared/components/listado-proveedor/listado-proveedor.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ConfigService } from 'src/app/shared/services/config.service';

import { Location } from '@angular/common';
import { CajeroService } from 'src/app/venta/services/cajero.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-abono-compra',
  templateUrl: './abono-compra.component.html',
  styleUrls: ['./abono-compra.component.css']
})
export class AbonoCompraComponent implements OnInit {
  multisucursal : string = "0";

  page = 1;
  count = 0;
  pagesize = 5;

  @ViewChild(ListadoProveedorComponent) childlistadoproveedor: any;

  cod_sucursal : string = "";
  sucursal : string = "";
  datossucursal : any;
  datosformapago : any;
  datosdeuda : any;
  datosabono : any;

  loading : boolean = false;
  

  cod_proveedor : string = "";
  proveedor : string = "";
  ruc : string = "";

  fecha : string = "";

  cod_abono : number = 0;
  numero_factura : string = "";
  deuda_valor : string = "0";
  deuda_valor_editar : number = 0;
  cod_factura_compra : string = "";
  observacion : string = "";
  termino_deudor : number = 0;//0 Sin deudas y 1 Con deudas
  valor_cuota : number = 0;//Valor de la cuota en créditos

  detalle : string = "";

  id_forma_pago : string = "";

  ban : number = 0;

  disabledbtnnuevoabono : boolean = true;
  disabledbtnguardarabono : boolean = true;
  disabledbtnactualizarabono : boolean = true;

  colormensaje : string;
  textomensaje : string;

  secciondeudas : number = 0;
  
  deuda_general : number = 0;

  loadinglistado : boolean = false;
  
  
  opcionesprivilegios : any;

  control_estricto_cajero : string = "";
  recaudador: string = "";

  constructor(private toastr : ToastrService, private error : ErrorService, private sucursalesservice : SucursalesService, private abonocompraservice : AbonoCompraService, private formapagoservice : FormaPagoService, private location: Location, private cajeroservice: CajeroService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
  
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();

    this.control_estricto_cajero = this.opcionesprivilegios["controlestrictocajero"];
    this.recaudador = this.usersession.getConfiguracion("recaudador");
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
      this.listarSucursales();
    }
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
        this.listarSucursales();
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
        this.listarSucursales();
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

  listarSucursales()
  {    
    this.loading = true;
    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
      this.sucursal = resultado.sucursal;
      this.childlistadoproveedor.listarProveedores();
      this.formularioNormal();
      this.listarFormaPagos();
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
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

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
  }

  formularioNormal()
  {
    this.page = 1;
    this.datosdeuda = [];
    this.datosabono = [];
    this.loading = false;
    

    this.cod_proveedor = "";
    this.proveedor = "";
    this.ruc = "";

    this.fecha = moment().format('YYYY-MM-DD');

    this.cod_factura_compra = "";
    this.numero_factura = "";
    this.deuda_valor = "0";
    this.deuda_valor_editar = 0;
    this.secciondeudas = 0;

    this.deuda_general = 0;

    this.disabledbtnnuevoabono = true;
    this.disabledbtnguardarabono = true;
    this.disabledbtnactualizarabono = true;
  }

  clickListarProveedor()
  {
    this.childlistadoproveedor.filterpost="";
    $("#mymodallistarproveedores").modal("show");
  }

  recibirDatosProveedor(datosrecibidosproveedor: any)
  {
    this.secciondeudas = 0;
    this.cod_proveedor = datosrecibidosproveedor.cod_proveedor;
    this.proveedor = datosrecibidosproveedor.razon_social + " " + datosrecibidosproveedor.nombre_comercial;
    this.ruc = datosrecibidosproveedor.ruc;
    $("#mymodallistarproveedores").modal("hide");
    this.listarcuentaspagarproveedor();
  }

  buscarproveedoresporpagar()
  {
    this.datosdeuda = [];
    this.secciondeudas = 0;
    this.loading = true;
    
    this.abonocompraservice.buscarProveedoresPorPagar(this.cod_sucursal, this.ruc).subscribe( (data : any) =>
    {
      if(data.cod_proveedor==false)
      {
        this.toastr.info("No se encuentra deuda de proveedor con numero ingresado.", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_proveedor = data.cod_proveedor;
        this.proveedor = data.razon_social + " " + data.nombre_comercial;
        this.listarcuentaspagarproveedor();
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarcuentaspagarproveedor()
  {
    this.page = 1;
    this.deuda_general = 0;
    this.datosdeuda = [];
    this.loadinglistado = true;
    
    this.abonocompraservice.listarCuentasPagarProveedor(this.cod_proveedor).subscribe( (data : any) =>
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
    //onsole.log(this.datosdeuda);
    this.cod_factura_compra = item.cod_factura_compra;
    this.numero_factura = item.numero_factura;
    this.termino_deudor = item.termino_deudor;
    this.deuda_valor = item.deuda_valor;
    this.valor_cuota = item.valor_cuotao;

    if(parseFloat(this.deuda_valor)<=0)
    {
      this.disabledbtnnuevoabono = true;
    }
    else
    {
      this.disabledbtnnuevoabono = false;
    }
    
      this.listarabonospagarproveedor(this.cod_factura_compra);//Lista los abonos
    }

  listarabonospagarproveedor(cod_factura_compra : string)//Lista los abonos
  {
    this.datosabono = [];
    this.loadinglistado = true;
    
    this.abonocompraservice.listarAbonosPagarProveedor(cod_factura_compra).subscribe( (data : any) =>
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


  clickNuevoAbono()
  {
    let CurrentDate = moment().unix();
		this.cod_abono = CurrentDate;
    this.disabledbtnguardarabono = true;
    this.id_forma_pago = "01";
    this.valor_cuota = null;
    this.ban = 0;
    this.observacion = "";
    this.colormensaje = "";
    this.textomensaje = "";
    $("#mymodalregistroabono").modal("show");
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
        'cod_abono_compra' : this.cod_abono,
        'cod_factura_compra' : this.cod_factura_compra,
        'valor' : this.valor_cuota,
        'fecha_registro' : this.fecha,
        'termino_deudor' : this.termino_deudor,
        'id_forma_pago' : this.id_forma_pago,
        'observacion' : this.observacion
      };

      this.abonocompraservice.guardar(parametros).subscribe( (data : any) =>
      {
        this.loading = false;
        

        if (data.estado == true)
        {
          this.toastr.success("Registro de Abono Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          this.listarcuentaspagarproveedor();
          $("#mymodalregistroabono").modal("hide");
          this.secciondeudas = 0;
          this.exportarPdf(this.cod_abono);
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

  clickCerrarAbonos()
  {
    this.listarcuentaspagarproveedor();
    this.secciondeudas = 0;
  }

  exportarPdf(cod_abono : number)
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/cuentaspc/abonocompra?cod_abono_compra=" + cod_abono, "", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  revisarDetalles(detalle : string)
  {
    this.detalle = detalle;
    $("#mymodalrevisardetalles").modal("show");
  }

  editarAbono(cod_abono_compra : string)
  {
    const resultado = this.datosabono.find( (valor : any) => valor.cod_abono_compra == cod_abono_compra );
    //console.log(resultado);
    this.cod_abono = resultado.cod_abono_compra;
    this.id_forma_pago = resultado.id_forma_pago;
    this.ban = 1;
    this.observacion = resultado.observacion;
    this.deuda_valor_editar = parseFloat(this.deuda_valor) + parseFloat(resultado.valor);
    this.valor_cuota = resultado.valor;
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
        'cod_abono_compra' : this.cod_abono,
        'cod_factura_compra' : this.cod_factura_compra,
        'valor' : this.valor_cuota,
        'fecha_registro' : this.fecha,
        'termino_deudor' : this.termino_deudor,
        'id_forma_pago' : this.id_forma_pago,
        'observacion' : this.observacion
      };

      this.abonocompraservice.actualizar(parametros).subscribe( (data : any) =>
      {
        this.loading = false;
        

        if (data.estado == true)
        {
          this.toastr.success("Registro de Abono Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          this.listarcuentaspagarproveedor();
          $("#mymodalregistroabono").modal("hide");
          this.secciondeudas = 0;
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
        'cod_abono_compra' : this.cod_abono
      };

      this.abonocompraservice.anular(parametros).subscribe( (data : any) =>
      {
        this.loading = false;
        

        if (data.estado == true)
        {
          this.toastr.success("Registro de Abono Anulado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          this.listarcuentaspagarproveedor();
          $("#mymodalregistroabono").modal("hide");
          this.secciondeudas = 0;
        }
        else
        {
          this.toastr.error("Registro de abono no se pudo Anular, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
        
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}
