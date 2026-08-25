import { Component, OnInit, ViewChild} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CompraService } from '../../services/compra.service';
import { NotaCreditoComprasService } from '../../services/nota-credito-compras.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { DetalleNotaCreditoComponent } from 'src/app/shared/components/detalle-nota-credito/detalle-nota-credito.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-nota-credito-compras',
  templateUrl: './nota-credito-compras.component.html',
  styleUrls: ['./nota-credito-compras.component.css']
})
export class NotaCreditoComprasComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";
  kardex : string = "";
  @ViewChild(DetalleNotaCreditoComponent) childdetallenotacredito: any;

  datossucursal : any;
  datosformapago : any;

  disabledbtnguardar : boolean = true;
  disabledbtnactualizar : boolean = true;
  disabledbtnimprimir : boolean = true;

  notacreditoexistente : string = "";

  //Inicia Datos de la nota de credito
  cod_nota_credito_compra : string = "";
  n_nota_credito_compra : string = "";
  fecha_hora : string = "";
  razon_modificacion : string = "";
  cod_usuario : string = "";
  cod_sucursal : string = "";
  cod_sucursal_buscada : string = "";
  sucursal : string = "";
  arr_nota_credito_compra : any;
  observacion : string = "";
  //Termina Datos de la nota de credito

  disabledcmbformapago : boolean = true;
  disabledtxtfecha : boolean = true;
  disabledtxtobservacion : boolean = true;

  colormensaje : string = "";
  textomensaje : string = "";

  //Inicia Datos de la factura
  cod_factura_compra : string = "";
  numero_factura : string = "";
  cod_identificacion : string = "";
  identificacion : string = "";
  cod_proveedor : string = "";
  proveedor : string = "";
  numero_identificacion : string = "";
  celular : string = "";
  telefono : string = "";
  correo : string = "";
  direccion : string = "";
  tipo_compra : string = "";
  fecha_registro : string = "";
  id_forma_pago : string = "";
  forma_pago : string = "";
  importetotal : number = 0.00;
  //Termina Datos de la factura


  flagformapago : boolean = false;

  loading : boolean = false;
  

  loadingalmacenar : boolean = false;

  tipo_formulario: string = "";

  

  constructor(private location: Location, private router : Router, private rutaActiva: ActivatedRoute, private notacreditocompraservice : NotaCreditoComprasService, private toastr : ToastrService, private error : ErrorService, private formapagoservice : FormaPagoService, private sucursalesservice : SucursalesService, private compraservice : CompraService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;

    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    //this.ptoemi = this.usersession.getConfiguracion("ptoemi");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.tipo_compra = this.usersession.getConfiguracion("defecto_compra");
    this.kardex = this.usersession.getConfiguracion("kardex");

    if(this.tipo_formulario == "nuevoregistro")
      {
        this.listarSucursales();
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro")
        {
          this.formularioNormal();
        }
      }

      this.bodyStyleService.resetBodyStyles();
  }

  ngAfterViewInit(): void {
    this.childdetallenotacredito.datostipoformadevolucion = [
    {
      "cod_tipo_forma_devolucion" : 1,
      "tipo_forma_devolucion" : "PRODUCTO"
    }];
    this.childdetallenotacredito.datosdetalles.forEach(detalle => {
      detalle.cod_tipo_forma_devolucion = 1;
    });
  }

  buscarSucursal()
  {
    const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = resultado.sucursal;
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
    this.forma_pago = resultado.forma_pago;
  }
  
  clickVerificarDetalles()
  {
    if(this.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if (this.importetotal == 0 || this.id_forma_pago.length == 0)
      {
        this.toastr.warning("Verifique forma de Pago, No hay nada que facturar, realice la factura por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {    
        this.verificaDetalles();
      }
    }
  }

  verificaDetalles()
  {
    let fila_error = false;
    for (let c = 0; c< this.childdetallenotacredito.datosdetalles.length; c++)
    {
      if(this.childdetallenotacredito.datosdetalles[c].fila_error == true)
      {
        fila_error = true;
        break;
      }
    }
    
    if(fila_error)
    {
      this.toastr.warning("Hay una o más filas pendientes de cualcular, no debe estar la fila de color rojo", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.tipo_formulario == "nuevoregistro")
      {
        Swal.fire({
          title: 'Guardar Registro de Nota de Crédito',
          text: '¿Estás seguro de almacenar registro?',
          icon: 'info',//'warning'
          showCancelButton: true,
          confirmButtonText: 'Si, Almacenar',
          cancelButtonText: 'No, Cerrar'
        }).then((result) => {
          if (result.value) {
            this.guardar();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro")
        {
          Swal.fire({
            title: 'Actualizar Registro de Nota de Crédito',
            text: '¿Estás seguro de actualizar registro?',
            icon: 'info',//'warning'
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

      
    }
  }

  guardar()
  {
    let detalles = [];
    
      this.childdetallenotacredito.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'id_detalle_compra' : item.id_detalle_compra,
          'ice' : item.porcentaje_ice,
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'precio' : item.precio_base,
          'descuento' : item.descuento_calculado,
          'total' : item.total,
          'total_ice' : item.ice,
          'total_iva' : item.iva,
          'total_final' : item.total_final,
          "unidades_denominacion" : item.unidades_denominacion,
          'inventario' : item.inventario,
          'cantidad_unidad_restada' : item.cantidad_unidad_restada,
          'costo_base_real' : item.costo_base_real,
          'costo_real' : item.costo_real
        };
        detalles.push(detalle);
      });

      let nota_credito_compra = {
        'cod_nota_credito_compra' : this.cod_nota_credito_compra,
        'id_forma_pago' : this.id_forma_pago,
        'n_nota_credito_compra' : this.n_nota_credito_compra,
        'fecha_hora' : this.fecha_hora,
        'cod_factura_compra' : this.cod_factura_compra,
        'comprobante' : "FACTURA",
        'numero_factura' : this.numero_factura,
        'fecha_emision_factura' : this.fecha_registro,
        'cod_proveedor' : this.cod_proveedor,
    
        'subtotalconimpuesto' : this.childdetallenotacredito.subtotal12,
        'subtotalsinimpuesto' : this.childdetallenotacredito.subtotal0,
        'totalsinimpuestos' : this.childdetallenotacredito.totalsinimpuestos,
        'total_descuento' : this.childdetallenotacredito.totaldescuento,
        'total_iva' : this.childdetallenotacredito.totalconimpuestos,
        'total_ice' : 0,//this.childdetallenotacredito.totalconice,
        'importetotal' : this.childdetallenotacredito.importetotal,
    
        'cod_sucursal' : this.cod_sucursal,
        'tipo_compra' : this.tipo_compra,
    
        'motivo' : this.razon_modificacion,
    
        'observacion' : this.observacion,
        'kardex' : this.kardex,
        'detalles' : detalles
      };

      
      this.loadingalmacenar = true;
      

      this.notacreditocompraservice.guardar(nota_credito_compra).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;
          
          if (data.estado == true)
          {
            this.n_nota_credito_compra = data.n_nota_credito_compra;
            this.disabledbtnguardar = true;
            this.disabledbtnimprimir = false;
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Nota de Crédito registrada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.deshabilitarFormulario();
            this.childdetallenotacredito.disabledtabladetalles = true;
            //this.childdetallenotacredito.deshabilitarFormulario();
            
            this.visualizar();
          }
          else
          {
            this.toastr.error("Nota de Crédito no se pudo registrar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingalmacenar = false;
          
      });
  }

  actualizar()
  {
    let detalles = [];
    
      this.childdetallenotacredito.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'id_detalle_compra' : item.id_detalle_compra,
          'ice' : item.porcentaje_ice,
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'precio' : item.precio_base,
          'descuento' : item.descuento_calculado,
          'total' : item.total,
          'total_ice' : item.ice,
          'total_iva' : item.iva,
          'total_final' : item.total_final,
          "unidades_denominacion" : item.unidades_denominacion,
          'inventario' : item.inventario,
          'cantidad_unidad_restada' : item.cantidad_unidad_restada,
          'costo_base_real' : item.costo_base_real,
          'costo_real' : item.costo_real
        };
        detalles.push(detalle);
      });

      let nota_credito_compra = {
        'cod_nota_credito_compra' : this.cod_nota_credito_compra,
        'n_nota_credito_compra' : this.n_nota_credito_compra,
        'cod_usuario' : "",//El backend lo ubica
        'id_forma_pago' : this.id_forma_pago,
        'fecha_hora' : this.fecha_hora,
        'cod_factura_compra' : this.cod_factura_compra,
        'comprobante' : "FACTURA",
        'numero_factura' : this.numero_factura,
        'fecha_emision_factura' : this.fecha_registro,
        'cod_proveedor' : this.cod_proveedor,
    
        'subtotalconimpuesto' : this.childdetallenotacredito.subtotal12,
        'subtotalsinimpuesto' : this.childdetallenotacredito.subtotal0,
        'totalsinimpuestos' : this.childdetallenotacredito.totalsinimpuestos,
        'total_descuento' : this.childdetallenotacredito.totaldescuento,
        'total_iva' : this.childdetallenotacredito.totalconimpuestos,
        'total_ice' : this.childdetallenotacredito.totalconice,
        'importetotal' : this.childdetallenotacredito.importetotal,
    
        'cod_sucursal' : this.cod_sucursal_buscada,
        'tipo_compra' : this.tipo_compra,
    
        'motivo' : this.razon_modificacion,
    
        'observacion' : this.observacion,
        'kardex' : this.kardex,
        'detalles' : detalles
      };

      
      this.loading = true;
      

      this.notacreditocompraservice.actualizar(nota_credito_compra).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if (data.estado == true)
          {
            this.n_nota_credito_compra = data.n_nota_credito_compra;

            this.disabledbtnimprimir = false;
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Nota de Crédito registrada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.deshabilitarFormulario();
          }
          else
          {
            this.toastr.error("Nota de Crédito no se pudo actualizar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  visualizar()
  {	 
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/compras/notacreditocompra?codnotacredito=" + this.cod_nota_credito_compra, "Devolución Venta", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
  }

  verificarRegistro()
  {
    this.loading = true;
    
    this.notacreditocompraservice.verificarRegistro().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_nota_credito_compra = data.codigo;
        this.n_nota_credito_compra = data.n_comprobante;
        this.fecha_hora = moment(data.fecha).format('YYYY-MM-DD');
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  recibirDatosDetalles(importetotal: number)
  {
    this.importetotal = importetotal;
  }

  formularioNormal()
  {
    this.notacreditoexistente = "";

    this.cod_nota_credito_compra = "";
    this.n_nota_credito_compra = "";
    this.razon_modificacion = "DEVOLUCION";
    this.fecha_hora = moment().format('YYYY-MM-DD');
    this.observacion = "";

    this.colormensaje = "";
    this.textomensaje = "";

    this.id_forma_pago = "01";
    this.forma_pago = "SIN UTILIZACION DEL SISTEMA FINANCIERO";
    this.datosformapago = [];
   
    this.loading = false;
    

    this.flagNormal();

    this.arr_nota_credito_compra = {};

    this.cod_factura_compra = this.rutaActiva.snapshot.paramMap.get("cod_factura_compra")!;
    
    this.listarFormaPagos();

    if(this.tipo_formulario == "nuevoregistro")
    {
      this.buscarSucursal();
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagformapago = false;


    if(this.forma_pago=="0")
    {
      this.flagformapago=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagformapago = false;
  }

  habilitarFormulario()
  {
    this.disabledbtnguardar = false;
    this.disabledbtnactualizar = false;
    this.disabledtxtfecha = false;
    this.disabledtxtobservacion = false;
    this.disabledcmbformapago = false;
  }

  deshabilitarFormulario()
  {
    this.disabledbtnguardar = true;
    this.disabledbtnactualizar = true;
    this.disabledtxtfecha = true;
    this.disabledtxtobservacion = true;
    this.disabledcmbformapago = true;
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
      
      if(this.tipo_formulario == "nuevoregistro")
      {
        this.buscarFacturaCompra();
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro")
        {
          this.buscarFacturaNotaCredito();
        }
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarFacturaNotaCredito()
  {
    this.loading = true;
    

    this.notacreditocompraservice.buscarFacturaNotaCredito(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.cod_nota_credito_compra = data[0].cod_nota_credito_compra;
      this.cod_sucursal_buscada = data[0].cod_sucursal;
      this.sucursal = data[0].sucursal;

      this.n_nota_credito_compra = this.padLeft(data[0].numero_nota_credito_compra, 9);
      
      this.fecha_hora = moment(data[0]["fecha_hora_nota_credito_compra"]).format('YYYY-MM-DD');
      this.razon_modificacion = data[0].motivo;
      this.id_forma_pago = "01";
      this.forma_pago = "SIN UTILIZACION DEL SISTEMA FINANCIERO";

      this.tipo_compra = data[0].tipo_compra;
      this.numero_factura = this.padLeft(data[0].serieestab, 3) + "-" + this.padLeft(data[0].ptoemi, 3) + "-" + this.padLeft(data[0].numero_factura, 9);
  
      this.cod_identificacion = data[0].cod_identificacion;
      this.identificacion = data[0].identificacion;
      this.cod_proveedor = data[0].cod_proveedor;
      this.proveedor = data[0].proveedor;
      this.numero_identificacion = data[0].ruc;
      this.celular = data[0].celular;
      this.telefono = data[0].convencional;
      this.correo = data[0].correo;
      this.direccion = data[0].direccion;
      this.fecha_registro = data[0].fecha_hora;
      this.observacion = data[0].observacion_nota_credito_compra
      this.childdetallenotacredito.observacion = data[0].observacion;
      
      this.childdetallenotacredito.datosdetalles = [];

      data.forEach(element => {
        let descripcion = element.detalle;
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          inventario : element.inventario,
  
          cod_tarifa : 0,
          cantidad_tarifa : 1,
  
          porcentaje_ice : 0,
          porcentaje_iva : parseFloat(element.iva),
          
          precio_base_minimo : 0,
          precio_venta_minimo : 0,
  
          incremento : 0,//Incremento de porcentaje
  
          cantidad_comprar : element.cantidad_comprar,
          tarifa : "",
          descripcion : descripcion,
          cantidad_unidad : element.cantidad_unidad,

          costo_base_real : element.precio_real,
          costo_real : element.precio_venta_real,

          cantidad_unidad_fija : element.cantidad_unidad,
          cantidad_unidad_restada : 0,
  
          precio_base : parseFloat(element.precio),
  
          checked : false,//Ckeked de descuento por porcentaje
          
          descuento : 0,//Editable
          descuento_calculado : element.descuento,//Calculado
  
          total : redondeardecimales(element.total, 6),
          iva : redondeardecimales(element.total_iva, 2),
          //ice : redondeardecimales(element.total_ice, 2),
          ice : 0,

          codigo_iva : 0,
  
          total_final : redondeardecimales(element.total_final, 2),
          unidades_denominacion : element.unidades_denominacion,
          modificable : 0,
          id_detalle_compra : element.id_detalle_compra
        }
        this.childdetallenotacredito.datosdetalles.push(detalle);
      });
      
      this.childdetallenotacredito.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
      this.childdetallenotacredito.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
      this.childdetallenotacredito.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
      this.childdetallenotacredito.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
      this.childdetallenotacredito.totalconice = redondeardecimales(data[0].total_ice_general, 2);
      this.childdetallenotacredito.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
      this.childdetallenotacredito.importetotal = redondeardecimales(data[0].importetotal, 2);
      this.importetotal = this.childdetallenotacredito.importetotal;

      this.loading = false;
      

      this.habilitarFormulario();
      this.childdetallenotacredito.habilitarFormulario();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }
  
  listarSucursales()
  {    
    this.loading = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loading = false;
      
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarFacturaCompra()
  {
    this.loading = true;
    

    this.compraservice.buscarFactura(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.tipo_compra = data[0].tipo_compra;
      this.numero_factura = this.padLeft(data[0].numero_factura, 9);
  
      this.cod_identificacion = data[0].cod_identificacion;
      this.identificacion = data[0].identificacion;
      this.cod_proveedor = data[0].cod_proveedor;
      this.proveedor = data[0].proveedor;
      this.numero_identificacion = data[0].ruc;
      this.celular = data[0].celular;
      this.telefono = data[0].convencional;
      this.correo = data[0].correo;
      this.direccion = data[0].direccion;
      this.fecha_registro = data[0].fecha_hora;
      this.childdetallenotacredito.observacion = data[0].observacion;
      this.cod_sucursal_buscada = data[0].cod_sucursal;
      
      this.childdetallenotacredito.datosdetalles = [];
      
      data.forEach(element => {
        let descripcion = element.detalle;
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          inventario : element.inventario,
  
          cod_tarifa : 0,//cod_tarifa : element.cod_tarifa,
          cantidad_tarifa : 1,//cantidad_tarifa : element.cantidad_tarifa,
  
          porcentaje_ice : 0,//porcentaje_ice : element.ice,
          porcentaje_iva : element.iva,
          
          precio_base_minimo : element.precio_base_minimo,
          precio_venta_minimo : element.precio_venta_minimo,
  
          incremento : 0,//Incremento de porcentaje
  
          cantidad_comprar : element.cantidad_comprar,
          tarifa : element.tarifa,
          descripcion : descripcion,
          cantidad_unidad : element.cantidad_unidad,

          cantidad_unidad_fija : element.cantidad_unidad,
          cantidad_unidad_restada : 0,
  
          precio_base : element.precio,

          costo_base_real : element.precio_real,
          costo_real : element.precio_venta_real,

  
          checked : false,//Ckeked de descuento por porcentaje
          
          descuento : 0,//Editable
          descuento_calculado : element.descuento,//Calculado
  
          total : redondeardecimales(element.total, 6),
          iva : redondeardecimales(element.total_iva, 2),
          ice : 0,//ice : redondeardecimales(element.total_ice, 2),

          codigo_iva : 0,//codigo_iva : element.codigo_iva,
  
          total_final : redondeardecimales(element.total_final, 2),
          unidades_denominacion : element.unidades_denominacion,
          modificable : 0,
          id_detalle_compra : element.id_detalle_compra
        }
        this.childdetallenotacredito.datosdetalles.push(detalle);
      });

      this.childdetallenotacredito.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
      this.childdetallenotacredito.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
      this.childdetallenotacredito.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
      this.childdetallenotacredito.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
      this.childdetallenotacredito.totalconice = redondeardecimales(data[0].total_ice_general, 2);
      this.childdetallenotacredito.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
      this.childdetallenotacredito.importetotal = redondeardecimales(data[0].importetotal, 2);
      this.importetotal = this.childdetallenotacredito.importetotal;

      this.loading = false;
      
      this.buscarnotacreditoporfactura();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  buscarnotacreditoporfactura()
  {
    this.loading = true;
    

    this.notacreditocompraservice.buscarnotacreditoporfactura(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.cod_nota_credito_compra == false)
      {
        this.notacreditoexistente = "0";
        this.verificarRegistro();
        this.habilitarFormulario();
        this.childdetallenotacredito.habilitarFormulario();
      }
      else
      {
        this.notacreditoexistente = "1";
        this.deshabilitarFormulario();
        this.childdetallenotacredito.disabledtabladetalles = true;
        //this.childdetallenotacredito.deshabilitarFormulario();
      }

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  goBack(){
    this.location.back();
  }

}