import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { RetencionService } from '../../services/retencion.service';
import { DatosSujetoRetenidoComponent } from '../retencion/datos-sujeto-retenido/datos-sujeto-retenido.component';
import { DetalleRetencionComponent } from '../retencion/detalle-retencion/detalle-retencion.component';
import { DatosVentasComponent } from '../retencion/datos-ventas/datos-ventas.component';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-compra-retencion',
  templateUrl: './explorador-compra-retencion.component.html',
  styleUrls: ['./explorador-compra-retencion.component.css']
})
export class ExploradorCompraRetencionComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  tipo_retencion : string = "ELECTRONICA";
  numeracion_automatica : string = "1";

  @ViewChild(DatosSujetoRetenidoComponent) childdatossujetoretenido: any;
  @ViewChild(DetalleRetencionComponent) childdetalleretencionComponent: any;
  @ViewChild(DatosVentasComponent) childdatosventascomponent: any;

  disabledbtnnuevo : boolean = false;
  disabledbtnguardar : boolean = true;
  disabledbtnsrienviar : boolean = true;
  disabledbtnimprimir : boolean = true;

  cod_sucursal : string = "";
  sucursal : string = "";
  datossucursal : any;

  serieestab : string = "";
  ruc : string = "";
  tipoambiente : string = "";
  razon_social : string = "";
  nombre_comercial : string = "";
  contabilidad : string = "";
  direccion_matriz : string = "";
  direccion_establecimiento : string = "";
  tipo_contribuyente : string = "";
  contribuyente : string = "";
  leyenda : string = "";

  firmap12 : string = "";
  clavep12 : string = "";
  pk12 : number = 1;
  firmapublica : string = "";
  firmaprivada : string = "";
  certificado: string = "";

  cod_retencion : string = "";

  loading : boolean = false;

  constructor(private retencionservice: RetencionService, private sucursalesservice : SucursalesService, private toastr : ToastrService, private error : ErrorService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.listarSucursales();
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal = elemento;
    this.buscarSucursal();
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.deshabilitaCampos();
  }

  clickNuevo()
  {
    if(this.datossucursal.length>0)
    {
      this.loading = true;
          this.formularioNormal();
          this.habilitarFormulario();
          /*
          this.childdetalleventa.datosdetalles = [];
          let element = document.getElementById("box");
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          */
          this.verificarRegistro();
          /*
          this.datosproducto = this.childlistadoproductogeneral.datosproducto;
          this.datostarifasproducto = this.childlistadoproductogeneral.datostarifasproducto;
          this.loading = false;
          */
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal()
  {
    this.disabledbtnnuevo = false;
    this.disabledbtnguardar = true;
    this.disabledbtnsrienviar = true;
    this.disabledbtnimprimir = true;

    this.cod_retencion = "";

    this.childdatossujetoretenido.formularioNormal();
    this.childdetalleretencionComponent.formularioNormal();
    this.childdatosventascomponent.formularioNormal();
    /*
    this.numero_factura = "";
    this.claveacceso = "0";

    this.ptoemi = this.usersession.getConfiguracion("ptoemi");


    this.colormensaje = "";
    this.textomensaje = "";

    this.cod_identificacion = "07";
    this.identificacion = "VENTA A CONSUMIDOR FINAL*";
    this.cod_cliente = "1";
    this.cliente = "CONSUMIDOR FINAL";
    this.numero_identificacion = "9999999999999";
    this.celular = "0000000000";
    this.telefono = "000-000";
    this.correo = "N";
    this.direccion = "N";

    this.cod_empleado = "0";

    this.id_forma_pago = "01";
    this.forma_pago = "SIN UTILIZACION DEL SISTEMA FINANCIERO";
    this.cod_tarjeta_tarifa = "0";
    this.tarjeta_tarifa = "";
    this.porcentaje_tarjeta_tarifa = "0";

    
    this.datostarjetatarifa = [];

    this.loading = false;
    

    this.diferencia = "";
    this.diferenciavalor="";
    this.recibido = "";

    this.recibidoabono = "0";
    this.id_forma_pago_abono = "01";

    this.pedido = 0;
    this.deudor=0;
    this.tipo_credito=0;
    */
    //this.flagNormal();

    /*
    this.childdetalleventa.datosdetalles = [];
    this.childdetalleventa.formularioNormal();
    this.importetotal = 0;

    this.arr_factura_venta = {};

    this.tipo_venta = this.defecto_venta;
    */
  }

  habilitarFormulario()
  {
    this.disabledbtnnuevo = true;
    this.disabledbtnguardar = false;

    this.childdatossujetoretenido.habilitarFormulario();
    this.childdetalleretencionComponent.habilitarFormulario();
    this.childdatosventascomponent.habilitarFormulario();
    /*
    this.disabledchkimpuesto = false;
    this.disabledtxtcodigobarra = false;
    this.disabledbtnlistarproducto = false;

    this.disabledbtnlistarcliente = false;
    this.disabledbtnagregarcliente = false;

    this.disabledcmbtipoventa = false;
    this.disabledtxtnfactura = false;
    this.disabledtxtfecha = false;
    this.disabledcmbformapago = false;

    this.disabledchkcontado = false;
    this.disabledtxtrecibido = false;
    this.disabledbtncalcular = false;

    this.disabledcmbempleado = false;

    this.childdetalleventa.disabledtabladetalles = false;

    this.childdetalleventa.habilitarFormulario();
    */
  }

  verificarRegistro()
  {
    this.loading = true;
    

    this.retencionservice.verificarRegistro().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.formularioNormal();
        this.deshabilitaCampos();
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_retencion = moment().unix().toString() + data.codigo;
        this.childdatossujetoretenido.numero_retencion = data.n_comprobante;
        this.childdatossujetoretenido.claveacceso = data.claveacceso;
        this.childdatossujetoretenido.fecha_registro = moment(data.fecha).format('YYYY-MM-DD');
        let numeracionautomatica = parseInt(this.numeracion_automatica);
        if(numeracionautomatica==0)
        {
          this.childdatossujetoretenido.numero_retencion = "";
        }
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarSucursales()
  {
    this.loading = true;

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loading = false;
      this.childdatossujetoretenido.childlistadoproveedor.listarProveedores();
      this.childdetalleretencionComponent.listarTipoDocumentos();
      this.childdetalleretencionComponent.listarTipoImpuestos();
      this.buscarSucursal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  deshabilitaCampos()
  {
    /*
    this.chkimpuesto = true;
    this.childlistadoproductogeneral.chkimpuesto = true;
    this.disabledchkimpuesto = true;
    this.disabledtxtcodigobarra = true;
    this.disabledbtnlistarproducto = true;
    
    this.childdetalleventa.disabledtabladetalles = true;
    
    this.disabledbtnlistarcliente = true;
    this.disabledbtnagregarcliente = true;

    this.disabledcmbtipoventa = true;
    this.disabledtxtnfactura = true;
    this.disabledtxtfecha = true;
    this.disabledcmbformapago = true;
    this.disabledcmbtarifacredito = true;
    this.chkcontado = true;
    this.disabledchkcontado = true;
    this.disabledtxtrecibido = true;
    this.disabledbtncalcular = true;

    this.disabledcmbempleado = true;
    */
  }

  buscarSucursal()
  {
    const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.serieestab = resultado.serieestab;
    this.ruc = resultado.ruc_sucursal;
    this.tipoambiente = resultado.tipo_ambiente;
    this.razon_social = resultado.razonsocial;
    this.nombre_comercial = resultado.nombrecomercial;
    this.contabilidad = resultado.contabilidad;
    this.direccion_matriz = resultado.direccion_matriz;
    this.direccion_establecimiento = resultado.direccion_establecimiento;
    this.tipo_contribuyente = resultado.tipo_contribuyente;
    this.contribuyente = resultado.contribuyente;
    this.leyenda = resultado.leyenda;
    this.firmap12 = resultado.firmap12;
    this.clavep12 = resultado.clavep12;
    this.pk12 = resultado.pk12;
    this.firmapublica = resultado.firmapublica;
    this.firmaprivada = resultado.firmaprivada;
    this.certificado = resultado.certificado;
  }

  recibirDatosDetallesRetencion(datosrecibidosdetalleretencion: any)
  {
    this.childdatosventascomponent.datosdetalles.push(datosrecibidosdetalleretencion);
    this.childdatosventascomponent.actualizarValores();
    this.childdetalleretencionComponent.limpiarAgregar();
  }

}