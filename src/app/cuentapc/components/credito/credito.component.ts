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

@Component({
  selector: 'app-credito',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.css']
})
export class CreditoComponent implements OnInit {
  multisucursal : string = "0";
  electronico : string = "0";

  @ViewChild(ListadoClienteComponent) childlistadocliente: any;

  cod_sucursal : string = "";
  sucursal : string = "";
  datossucursal : any;
  datosformapago : any;
  datosdeuda : any;

  loading : boolean = false;
  

  cod_cliente : string = "";
  cliente : string = "";
  cedula : string = "";

  fecha : string = "";

  //cod_abono : number = 0;
  
  /*
  deuda_valor : string = "0";
  deuda_valor_editar : number = 0;
  
  observacion : string = "";
  termino_deudor : number = 0;//0 Sin deudas y 1 Con deudas
  tipo_credito : number = 0;//1 Con cuotas y 2 Sin Cuotas
  cod_tipo_abono : number = 1;//0 Entrada y 1 Cuota
  tipo_abono : string = "";//ENTRADA y CUOTA
  valor_cuota : number = 0;//Valor de la cuota en créditos
  */

  detalle : string = "";

  
  //fecha_maxima_pago : string = "";//Solo aplica en créditos
  //valor_mora : number = 0;

  /*
  ban : number = 0;

  disabledbtnnuevoabono : boolean = true;
  disabledbtnguardarabono : boolean = true;
  disabledbtnactualizarabono : boolean = true;

  colormensaje : string;
  textomensaje : string;

  */
  secciondeudas : number = 0;

  deuda_general : number = 0;

  cod_factura_venta : string = "";
  numero_factura : string = "";
  importe : number = 0;
  total_importe : number = 0;
  porvalordirecto : boolean = true;
  entrada : number = 0;
  valor_entrada : number = 0;
  deuda_total : number = 0;
  porcentaje_credito : number = 0;
  id_forma_pago : string = "";
  cod_tipo_credito : string = "";
  datostipocredito : any[] = [
    {
      "cod_tipo_credito" : "1",
      "tipo_credito" : "SIN CUOTAS"
    },
    {
      "cod_tipo_credito" : "2",
      "tipo_credito" : "CON CUOTAS"
    }
  ];
  cod_forma_credito : string = "";
  datosformacredito : any[] = [
    {
      "cod_forma_credito" : "0",
      "forma_credito" : "NINGUNO"
    },
    {
      "cod_forma_credito" : "1",
      "forma_credito" : "MENSUAL"
    },
    {
      "cod_forma_credito" : "2",
      "forma_credito" : "QUINCENAL"
    },
    {
      "cod_forma_credito" : "3",
      "forma_credito" : "SEMANAL"
    }
  ];
  cuotas: number = 0;
  valor_cuotas: number = 0;
  cod_dia: number = 0;
  diasdelmes: any = [];
  ubicacion: string = "";
  numero_identificacion_garante: string = "";
  apellido_garante: string = "";
  nombre_garante: string = "";
  observacion: string = "";
  filadatosdeuda: number = 0;
  datoscredito: any = [];

  loadinglistado : boolean = false;
  
  
  opcionesprivilegios : any;

  ban : number = 0;
  flagocultarbotonalmacenar : boolean = false;
  flagocultarbotonactualizar : boolean = false;
  flagocultarbotongenerar : boolean = true;

  constructor(private toastr : ToastrService, private error : ErrorService, private sucursalesservice : SucursalesService, private abonoventaservice : AbonoVentaService, private formapagoservice : FormaPagoService, private creditoservice: CreditoService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
  
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarDiasMesActual();
    this.listarSucursales();
  }

  changeTipoCredito(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_credito = elemento;
    if(this.cod_tipo_credito=="1")
    {
      this.cod_forma_credito = "0";
      this.datosformacredito = [
        {
          "cod_forma_credito" : "0",
          "forma_credito" : "NINGUNO"
        }
      ];
    }
    else
    {
      this.cod_forma_credito = "1";
      this.datosformacredito = [
        {
          "cod_forma_credito" : "1",
          "forma_credito" : "MENSUAL"
        },
        {
          "cod_forma_credito" : "2",
          "forma_credito" : "QUINCENAL"
        },
        {
          "cod_forma_credito" : "3",
          "forma_credito" : "SEMANAL"
        }
      ];
    }
  }

  changeFormaCredito(event: any): void {
    const elemento = event.target.value;
    this.cod_forma_credito = elemento;
  }

  changeDiaPago(event: any): void {
    const elemento = event.target.value;
    this.cod_dia = elemento;
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
      this.datossucursal = data;
      this.loading = false;
      
      this.childlistadocliente.listarClientesPorCobrar(this.cod_sucursal);
      this.listarFormaPagos();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarFormaPagos()
  {    
    this.loading = true;
    

    this.formapagoservice.listarFormaPagos().subscribe( (data : any) =>
    {
      this.datosformapago = data;
      this.loading = false;
      this.formularioNormal();
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
    this.datosdeuda = [];
    this.loading = false;

    this.cod_cliente = "";
    this.cliente = "";
    this.cedula = "";

    this.fecha = moment().format('YYYY-MM-DD');

    this.secciondeudas = 0;

    this.deuda_general = 0;

    this.cod_factura_venta = "";
    this.numero_factura = "";
    this.importe = 0;
    this.total_importe = 0;
    this.porvalordirecto = true;
    this.deuda_total = 0;
    this.filadatosdeuda = 0;
    this.limpiarCredito();
    /*
    this.disabledbtnnuevoabono = true;
    this.disabledbtnguardarabono = true;
    this.disabledbtnactualizarabono = true;
    */
  }

  limpiarCredito()
  {
    this.entrada = 0;
    this.valor_entrada = 0;
    this.porcentaje_credito = 0;
    this.id_forma_pago = "01";
    this.cod_tipo_credito = "2";
    this.cod_forma_credito = "1";
    this.cuotas = 0;
    this.valor_cuotas = 0;
    this.cod_dia = moment().date();
    this.ubicacion = "";
    this.numero_identificacion_garante = "";
    this.apellido_garante = "";
    this.nombre_garante = "";
    this.observacion = "";
    this.datoscredito = [];

    this.ban = 0;
    this.flagocultarbotonalmacenar = false;
    this.flagocultarbotonactualizar = false;
    this.flagocultarbotongenerar = true;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal = elemento;
    this.formularioNormal();
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

  crearCredito(index: number): void
  {
    this.cod_factura_venta = this.datosdeuda[index].cod_factura_venta;
    this.numero_factura = this.datosdeuda[index].numero_factura;
    this.importe = this.datosdeuda[index].deuda_valor;
    this.total_importe = this.datosdeuda[index].deuda_valor;
    this.deuda_total = this.datosdeuda[index].deuda_valor;
    this.filadatosdeuda = index;
    this.secciondeudas = 1;
    this.buscarCredito();
  }

  buscarCredito()
  {
    this.loading = true;
    this.creditoservice.buscarCredito(this.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.cod_factura_venta == false)//No existe
      {
        this.ban = 0;
        this.limpiarCredito();
      }
      else
      {
        this.ban = 1;
				this.importe = data[0].importetotal;
        this.total_importe = data[0].total_importe;
        this.deuda_total = data[0].total_importe;
        this.entrada = data[0].entrada;
        this.deuda_total = data[0].importe_deuda;
        this.cod_tipo_credito = data[0].tipo_credito;
        this.cod_forma_credito = data[0].forma_credito;
        this.cuotas = data[0].cantidad_cuotas;
        this.valor_cuotas = data[0].valor_cuota;
        this.cod_dia = data[0].dia_pago;

				this.buscarFormaCobroAbonoEntrada();

        this.ubicacion = data[0].ubicacion;
        this.numero_identificacion_garante = data[0].identificacion_garante;
        this.apellido_garante = data[0].apellido_garante;
        this.nombre_garante = data[0].nombre_garante;
        this.observacion = data[0].observacion_credito;

        this.datoscredito = [];

        data.forEach(item => {
          let detalle = {
          'numero_credito' : item.numero_credito,
          'fecha_pago' : item.fecha_pago,
          'saldo_termino' : item.saldo_termino,
          'cuota' : item.cuota,
          'pago_pendiente' : item.pago_pendiente,
          'saldo_corriente' : item.saldo_corriente
          };
  
          this.datoscredito.push(detalle);
        });

        this.flagocultarbotonalmacenar = false;
        this.flagocultarbotonactualizar = false;
        this.flagocultarbotongenerar = true;

      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  buscarFormaCobroAbonoEntrada()
  {
    this.loading = true;
    this.creditoservice.buscarFormaCobroAbonoEntrada(this.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.cod_factura_venta == false)//No existe
      {
       
      }
      else
      {
				this.id_forma_pago = data[0].id_forma_pago;
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  changeCambiar(): void {
    if(this.porvalordirecto){
      this.porvalordirecto = false;
    }else{
      this.porvalordirecto = true;
    }
  }

  calcularEntradaPorcentaje()
  {
    this.valor_entrada = (this.importe *  this.entrada)/100
		this.total_importe = this.importe - this.valor_entrada;
    this.deuda_total = this.total_importe;
  }

  calcularEntradaDirecta()
  {
		this.valor_entrada = this.importe - this.entrada;
		this.total_importe = this.valor_entrada;
    this.deuda_total = this.total_importe;
  }

  calcularPorcentajeCredito()
  {
		let valor_porcentaje_credito = (this.total_importe *  this.porcentaje_credito)/100
		this.deuda_total = this.total_importe + valor_porcentaje_credito;
  }

  calcularCuotas()
  {
		this.valor_cuotas = redondeardecimales((this.deuda_total / this.cuotas), 2);
  }

  listarDiasMesActual()
  {
    const numeroDias = moment().daysInMonth();

    for(let c=1; c<=numeroDias; c++)
    {
      let dia = {
        "cod_dia" : c,
        "dia" : c
      }
      this.diasdelmes.push(dia);
    }
  }

  generarCreditos()
  {
    this.datoscredito = [];
    if(this.cuotas>0)
    {
      let fecha_hora = this.datosdeuda[this.filadatosdeuda].fecha_hora;
      const diapago = this.cod_dia;

      fecha_hora = moment(fecha_hora).format(`YYYY-MM-${diapago} HH:mm:ss`);
      
      let saldocorriente = this.deuda_total;
      let saldocorrientecuadre=0;
      let cuota = this.valor_cuotas;
      let cantidadcuotas = this.cuotas;
      for(let c=0; c< cantidadcuotas; c++)
      {
        //let formacredito = $("#cmbformacredito").val();
        //$("#cmbformacredito").append("<option value='3'>QUINCENAL</option>");

        if(this.cod_forma_credito=="1")
        {
          let fecha_aumentada = moment(fecha_hora).add(1, 'months').format('YYYY-MM-DD');
          fecha_hora = fecha_aumentada;
        }

        if(this.cod_forma_credito=="2")
        {
          let fecha_aumentada = moment(fecha_hora).add(14, 'days').format('YYYY-MM-DD');
          fecha_hora = fecha_aumentada;
        }

        if(this.cod_forma_credito=="3")
        {
          let fecha_aumentada = moment(fecha_hora).add(7, 'days').format('YYYY-MM-DD');
          fecha_hora = fecha_aumentada;
        }
        
        let saldo_termino = saldocorriente;

        saldocorrientecuadre = saldocorriente;
        saldocorriente = saldocorriente - cuota;
        saldocorriente = redondeardecimales(saldocorriente, 2);

        if(c==(cantidadcuotas-1))
        {
          if(saldocorriente<0)
          {
            saldocorriente = cuota - Math.abs(saldocorriente);
            cuota = saldocorriente;
            saldocorriente = 0;
          }
          else
          {
            if(saldocorriente>0)
            {
              cuota = saldocorrientecuadre;
              saldocorriente = 0;
            }
          }
        }

        let credito = {
          "numero_credito": (c + 1),
          "fecha_pago": fecha_hora,
          "saldo_termino": saldo_termino,
          "cuota": cuota,
          "pago_pendiente": cuota,
          "saldo_corriente": saldocorriente
        };
        this.datoscredito.push(credito);
      }

      if(this.ban==0)
      {
        this.flagocultarbotonalmacenar = true;
        this.flagocultarbotonactualizar = false;
      }
      else
      {
        this.flagocultarbotonalmacenar = false;
        this.flagocultarbotonactualizar = true;
      }
    }
    else
    {
      this.toastr.warning("Debe ingresar una cantidad de cuotas para calcular", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickGuardar()
  {
    if(this.valor_cuotas <= 0 || this.importe <= 0 || this.total_importe <= 0 || this.deuda_total <=0 || this.ubicacion.length == 0 || this.numero_identificacion_garante.length == 0 || this.apellido_garante.length == 0 || this.nombre_garante.length == 0)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      Swal.fire({
        title: 'Guardar Registro de Crédito',
        text: '¿Estás seguro de guardar registro?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No, Cerrar'
      }).then((result) => {
        if (result.value) {
          this.guardar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
    }
  }

  guardar(){
      this.loading = true;

      let detalles = [];

      this.datoscredito.forEach(item => {
        let detalle = {
        'numero_credito' : item.numero_credito,
        'fecha_pago' : item.fecha_pago,
        'saldo_termino' : item.saldo_termino,
        'cuota' : item.cuota,
        'pago_pendiente' : item.pago_pendiente,
        'saldo_corriente' : item.saldo_corriente
        };

        detalles.push(detalle);
      });

      let credito = {
        'total_importe' : this.total_importe,
        'entrada' : this.entrada,
        'importe_deuda' : this.deuda_total,
        'tipo_credito' : this.cod_tipo_credito,
        'forma_credito' : this.cod_forma_credito,
        'cantidad_cuotas' : this.cuotas,
        'valor_cuota' : this.valor_cuotas,
        'dia_pago' : this.cod_dia,
        'id_forma_pago' : this.id_forma_pago,
        'observacion_credito' : this.observacion,
        'ubicacion' : this.ubicacion,
        'identificacion_garante' : this.numero_identificacion_garante,
        'apellido_garante' : this.apellido_garante,
        'nombre_garante' : this.nombre_garante,
        'cod_factura_venta' : this.cod_factura_venta,
        'detalles' : detalles
      };
      
      this.creditoservice.guardar(credito).subscribe( (data : any) =>
      {
        this.loading = false;
        if (data.estado == true)
        {
          this.toastr.success("Registro de Crédito Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          this.secciondeudas = 0;
          this.limpiarCredito();
          this.listarCuentasCobrarCliente();
        }
        else
        {
          this.toastr.error("Registro de Crédito no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.loading = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  clickActualizar()
  {
    if(this.valor_cuotas <= 0 || this.importe <= 0 || this.total_importe <= 0 || this.deuda_total <=0 || this.ubicacion.length == 0 || this.numero_identificacion_garante.length == 0 || this.apellido_garante.length == 0 || this.nombre_garante.length == 0)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      Swal.fire({
        title: 'Actualizar Registro de Crédito',
        text: '¿Estás seguro de actualizar registro?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Si, Actualizar',
        cancelButtonText: 'No, Cerrar'
      }).then((result) => {
        if (result.value) {
          this.actualizar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
    }
  }

  actualizar(){
    this.loading = true;

    let detalles = [];

    this.datoscredito.forEach(item => {
      let detalle = {
      'numero_credito' : item.numero_credito,
      'fecha_pago' : item.fecha_pago,
      'saldo_termino' : item.saldo_termino,
      'cuota' : item.cuota,
      'pago_pendiente' : item.pago_pendiente,
      'saldo_corriente' : item.saldo_corriente
      };

      detalles.push(detalle);
    });

    let credito = {
      'total_importe' : this.total_importe,
      'entrada' : this.valor_entrada,
      'importe_deuda' : this.deuda_total,
      'tipo_credito' : this.cod_tipo_credito,
      'forma_credito' : this.cod_forma_credito,
      'cantidad_cuotas' : this.cuotas,
      'valor_cuota' : this.valor_cuotas,
      'dia_pago' : this.cod_dia,
      'id_forma_pago' : this.id_forma_pago,
      'observacion_credito' : this.observacion,
      'ubicacion' : this.ubicacion,
      'identificacion_garante' : this.numero_identificacion_garante,
      'apellido_garante' : this.apellido_garante,
      'nombre_garante' : this.nombre_garante,
      'cod_factura_venta' : this.cod_factura_venta,
      'detalles' : detalles
    };

    this.creditoservice.actualizar(credito).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.estado == true)
      {
        this.toastr.success("Registro de Crédito Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.secciondeudas = 0;
        this.limpiarCredito();
        this.listarCuentasCobrarCliente();
      }
      else
      {
        this.toastr.error("Registro de Crédito no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
  });
}

  clickCerrarCredito()
  {
    this.secciondeudas = 0;
    this.listarCuentasCobrarCliente();
  }

  revisarDetalles(detalle : string)
  {
    this.detalle = detalle;
    $("#mymodalrevisardetalles").modal("show");
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

  imprimirPagare(cod_factura_venta : string)
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/cuentaspc/pagares?codfacturaventa=" + cod_factura_venta, "Generación de Pagaré", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

}