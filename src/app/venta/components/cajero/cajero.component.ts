import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CajaService } from '../../services/caja.service';
import { CajeroService } from '../../services/cajero.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ConfigService } from 'src/app/shared/services/config.service';

import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-cajero',
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.css']
})
export class CajeroComponent implements OnInit {
  
  opcionesprivilegios : any;

  datoscaja : any;
  datosprocesocaja : any = [];
  detallescajero : any = [];

  disabledbtnaperturar : boolean = false;
  disabledbtncerrarcaja : boolean = false;

  disabledcmbprocesocaja : boolean = false;
  disabledcmbcaja : boolean = false;
  disabledbtnbuscar : boolean = false;

  disabledtxtiniciodinero : boolean = false;
  disabledtxtobservacion : boolean = false;
  disabledbtncalcularcierre : boolean = true;

  loading : boolean = false;
  textoloading : string = "";

  cod_cajero : number = 0;
  cod_sucursal : string = "";
  sucursal : string = "";
  cod_caja : string = "";
  cod_proceso_caja : string = "0";
  estado_caja : string = "";

  numero_arqueo : string = "";
  fecha_apertura : string = "";
  cod_usuario : string = "";
  vendedor : string = "";

  inicio_dinero : string = "";
  total_caja : string = "";
  total_caja_sin_inicio : string = "";
  datos : any = {
  venta: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
  abono_venta: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
  ingresos: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
  notas_credito: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
  pago_nota_credito: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
  gastos: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
  informacion: { fecha_cierre: ''} 
  };

  observacion : string = "";

  flaginiciodinero : boolean = false;
  flagefectivocontado : boolean = false;

  efectivo_contado : string = "";

  fecha_cierre : string = "";
  recaudador : string = "";
  

  constructor(private toastr : ToastrService, private error : ErrorService, private cajaservice : CajaService, private cajeroservice : CajeroService, private sucursalesservice : SucursalesService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.buscarSucursal();
    this.formularioNormal();
  }

  changeProcesoCaja(event: any): void {
    const elemento = event.target.value;
    this.cod_proceso_caja = elemento;
    this.cod_caja = "0";
  }

  changeCaja(event: any): void {
    const elemento = event.target.value;
    this.cod_caja = elemento;
  }

  clickAperturar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      Swal.fire({
        title: '¿Desea aperturar caja?',
        text: 'Una vez que aperture caja desde ese momento se contabilizará las entradas y salidas de su caja',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Aperturar',
        cancelButtonText: 'No, Aperturar'
      }).then((result) => {
        if (result.value) {
          this.aperturar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Acción Cancelada',
            'No se rrealizó apertura',
            'error'
          )
        }
      });
    }
  }

  clickCerrar()
  {
    if(this.opcionesprivilegios["declaracionefectivo"]==1)
    {
      let valor : Boolean = this.verificarCamposCierre();
      if(valor)
      {
        this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.confirmarCerrar();
      }
    }
    else
    {
      this.confirmarCerrar();
    }
  }

  confirmarCerrar()
  {
    Swal.fire({
        title: '¿Desea cerrar caja?',
        text: 'Una vez que cierre caja ya no se contabilizarán los movimientos que realice en el sistema',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Cerrar',
        cancelButtonText: 'No, Cerrar'
      }).then((result) => {
        if (result.value) {
          this.cerrar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Acción Cancelada',
            'No se rrealizó cierre',
            'error'
          )
        }
      });
  }

  clickBuscar()
  {
    if(this.cod_proceso_caja=="0")
    {
      this.toastr.warning("Debe seleccionar un proceso de caja primero", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.cod_caja=="0")
      {
        this.toastr.warning("Debe seleccionar una caja para primero", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        if(this.cod_proceso_caja == "apertura")
        {
          this.apertura();
        }
        if(this.cod_proceso_caja == "cierre")
        {
          this.cierre();
        }
      }
    }
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal()
  {
    this.detallescajero = [];
    this.datosprocesocaja = [
      {
        "cod_proceso_caja" : "0",
        "proceso_caja" : "SELECCIONE UN PROCESO CAJA"
      },
      {
        "cod_proceso_caja" : "apertura",
        "proceso_caja" : "APERTURA"
      },
      {
        "cod_proceso_caja" : "cierre",
        "proceso_caja" : "CIERRE"
      }
    ];

    this.disabledbtnaperturar = true;
    this.disabledbtncerrarcaja = true;

    this.disabledcmbprocesocaja = false;
    this.disabledcmbcaja = false;
    this.disabledbtnbuscar = false;

    this.disabledtxtiniciodinero = true;
    this.disabledtxtobservacion = true;
    this.disabledbtncalcularcierre = true;

    this.loading = false;
    
    this.cod_cajero = 0;
    this.cod_proceso_caja = "0";
    this.cod_caja = "0";
    this.estado_caja = "";

    this.numero_arqueo = "";
    this.fecha_apertura = "";
    this.cod_usuario = "";
    this.vendedor = "";

    this.inicio_dinero = "";
    this.observacion = "";
    
    this.total_caja = "";
    this.fecha_cierre = "";

    this.efectivo_contado = "";

    this.datos = {
    venta: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
    abono_venta: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
    ingresos: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
    notas_credito: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
    pago_nota_credito: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
    gastos: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' },
    totales: { total: 0, efectivo: 0, debito: 0, credito: 0, deposito: 0, descripcion: '' }
    };

    this.flagNormal();
  }

  flagNormal()
  {
    this.flaginiciodinero = false;
    this.flagefectivocontado = false;
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.inicio_dinero.length==0)
    {
      this.flaginiciodinero=true;
      valor=true;
    }

    return valor;
  }

  verificarCamposCierre()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.efectivo_contado.length==0)
    {
      this.flagefectivocontado=true;
      valor=true;
    }

    return valor;
  }

  listarCajasSucursales()
  {    
    this.loading = true;
    

    this.cajaservice.listarCajasSucursales(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.datoscaja = data;
      this.loading = false;
      
      this.cod_caja = "0";
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  
  buscarSucursal()
  {    
    this.loading = true;
    

    this.sucursalesservice.buscarSucursal(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.sucursal = data.sucursal;
      this.loading = false;
      
      this.listarCajasSucursales();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }
  

  apertura()
  {    
    this.loading = true;

    this.cajaservice.apertura(this.cod_caja).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == false)
      {
        let CurrentDate = moment().unix();
        this.cod_cajero = CurrentDate;

        this.disabledcmbprocesocaja = true;
        this.disabledcmbcaja = true;
        this.disabledbtnbuscar = true;
        this.iniciarAperturaCaja();
      }
      else
      {
        this.toastr.warning("Caja seleccionada esta abierta, debe primero cerrar caja para proceder aperturar.", "INFORMACIÓN DEL SISTEMA");
        this.estado_caja = "CAJA ABIERTA DEBE CERRAR PRIMERO";
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  cierre()
  {    
    this.loading = true;

    this.cajaservice.cierre(this.cod_caja).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == false)
      {
        this.disabledcmbprocesocaja = true;
        this.disabledcmbcaja = true;
        this.disabledbtnbuscar = true;

        this.disabledtxtiniciodinero = true;
        this.disabledtxtobservacion = true;
        this.iniciarCierreCaja();
      }
      else
      {
        this.toastr.warning("Caja seleccionada esta cerrada, debe primero abrir caja para proceder a cerrar.", "INFORMACIÓN DEL SISTEMA");
        this.estado_caja = "CAJA CERRADA DEBE ABRIR PRIMERO";
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  iniciarAperturaCaja()
  {    
    this.loading = true;

    this.cajeroservice.iniciarAperturaCaja().subscribe( (data : any) =>
    {
      this.loading = false;
      
      
      if(data.estado == true)
      {
        this.estado_caja = "APERTURANDO CAJA";
        this.numero_arqueo = data.numero_arqueo;
        this.fecha_apertura = data.fecha_apertura;
        this.cod_usuario = data.cod_usuario;
        this.vendedor = data.vendedor;

        this.disabledtxtiniciodinero = false;
        this.disabledtxtobservacion = false;
        this.disabledbtnaperturar = false;
      }
      else
      {
        this.toastr.error("Se a originado un error inesperado con el servidor.", "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  iniciarCierreCaja()
  {
    this.loading = true;

    this.cajeroservice.iniciarCierreCaja(this.cod_caja).subscribe( (data : any) =>
    {
      this.loading = false;
      
      
      if(data.estado == true)
      {
        this.estado_caja = "CERRANDO CAJA";
        this.cod_cajero = data.cod_cajero;
        this.numero_arqueo = data.numero_arqueo;
        this.fecha_apertura = data.fecha_apertura;
        this.cod_usuario = data.cod_usuario;
        this.vendedor = data.vendedor;
        this.inicio_dinero = data.inicio_dinero;

        this.disabledtxtiniciodinero = true;
        this.disabledtxtobservacion = false;
        this.disabledbtncalcularcierre = false;
      }
      else
      {
        this.toastr.error("Se a originado un error inesperado con el servidor.", "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  aperturar(){

    this.loading = true;

    const parametros = {
      'cod_cajero' : this.cod_cajero,
      'cod_sucursal' : this.cod_sucursal,
      'cod_caja' : this.cod_caja,
      'cod_usuario' : this.cod_usuario,
      'inicio_dinero' : this.inicio_dinero,
      'observacion' : this.observacion
    };

    this.cajeroservice.aperturar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.formularioNormal();
        this.toastr.success("Caja aperturada satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Caja no se pudo aperturar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  cerrar(){

    this.loading = true;

    const parametros = {
      'cod_cajero' : this.cod_cajero,
      'cod_caja' :  this.cod_caja,
      'fecha_cierre' : this.fecha_cierre,
      'efectivo_contado' : this.efectivo_contado,
      'detalle_cajero' : this.detallescajero,
      'observacion' : this.observacion
    };

    this.cajeroservice.cerrar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.toastr.success("Caja cerrada satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.visualizar();
        this.formularioNormal();
      }
      else
      {
        this.toastr.error("Caja no se pudo aperturar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  visualizar()
  {	 
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/resumencaja?cod_cajero=" + this.cod_cajero + "&cod_sucursal=" + this.cod_sucursal, "", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  calcularCierreCaja(proceso: string)
  {
    this.detallescajero = [];

    this.loading = true;

    this.cajeroservice.calcularCierreCaja(this.cod_usuario, this.fecha_apertura, this.cod_sucursal, proceso).subscribe( (data : any) =>
    {
      this.loading = false; 
      this.datos = data;
      this.fecha_cierre = this.datos['informacion'].fecha_cierre;
      delete this.datos['informacion'];

      /*PLAZA MODA*/
      //this.total_general_cobrado = redondeardecimales(String( parseFloat(this.total_general_ingresos_ventas) - (parseFloat(this.total_efectivo_devolucion_nc) + parseFloat(data.total_saldo_ocupado_nota_creditos) )), 2);
      
      /*NORMAL*/
      this.total_caja = redondeardecimales(String(Number(this.datos['totales'].efectivo) + Number(this.inicio_dinero)), 2);
      this.detallescajero = Object.values(this.datos);

      this.disabledbtncerrarcaja = false;
      this.disabledbtncalcularcierre = true;

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

}