import { Component, OnInit, ViewChild} from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { NotaCreditoService } from '../../services/nota-credito.service';
import { FormaPagoService } from '../../services/forma-pago.service';
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
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SriNotaCreditoService } from 'src/app/shared/services/sri-nota-credito.service';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { NotaCreditoDTO } from '../../models/nota-credito.dto';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-nota-credito',
  templateUrl: './nota-credito.component.html',
  styleUrls: ['./nota-credito.component.css']
})
export class NotaCreditoComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";
  kardex : string = "";
  @ViewChild(DetalleNotaCreditoComponent) childdetallenotacredito: any;

  datosrucempresa : any;
  datosformapago : any;

  disabledbtnguardar : boolean = true;
  disabledbtnactualizar : boolean = true;
  disabledbtnsrienviar : boolean = true;
  disabledbtnimprimir : boolean = true;

  notacreditoexistente : string = "0";

  arr_nota_credito : any;

  disabledcmbformapago : boolean = true;
  disabledtxtfecha : boolean = true;
  disabledtxtobservacion : boolean = true;

  colormensaje : string = "";
  textomensaje : string = "";

  flagformapago : boolean = false;

  loading : boolean = false;
  loadingalmacenar : boolean = false;

  tipo_formulario: string = "";

  datosreembolso: any [];

  cod_sucursal_estable: string = "";
  sucursal_estable: string = "";
  firmasruc: string = "";

  notacredito: NotaCreditoDTO = new NotaCreditoDTO;
  cliente: ClienteDTO = new ClienteDTO;
  rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

  constructor(private rutaActiva: ActivatedRoute, private notacreditoservice : NotaCreditoService, private toastr : ToastrService, private error : ErrorService, private formapagoservice : FormaPagoService, private rucempresaservice : RucEmpresaService, private ventaservice : VentaService, private location: Location, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private srinotacredito: SriNotaCreditoService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;

    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.datosrucempresa = [];
    this.rucempresa.cod_ruc = this.usersession.getConfiguracion("cod_ruc");

    this.cod_sucursal_estable = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal_estable = this.usersession.getConfiguracion("sucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    
    this.notacredito.tipo_venta = this.usersession.getConfiguracion("defecto_venta");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.notacredito.iva = Number(this.usersession.getConfiguracion("iva"));
    this.notacredito.codigo_iva = Number(this.usersession.getConfiguracion("codigo_iva"));

    this.datosreembolso = [
      {
        "cod_reembolso" : "T",
        "reembolso" : "SELECCIONE REEMBOLSO"
      },
      {
        "cod_reembolso" : "1",
        "reembolso" : "SI"
      },
      {
        "cod_reembolso" : "0",
        "reembolso" : "NO"
      }
    ];

    if(this.tipo_formulario == "nuevoregistro")
    {
      this.listarRucEmpresas();
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
    //this.childformapago.formularioNormal();
  }

  changeFecha() {
    if(this.tipo_formulario == "actualizarregistro")
    {
      this.originarClaveAcceso();
    }
  }

  originarClaveAcceso()
  {    
    this.loading = true;
    

    this.notacreditoservice.claveAccesoActualizar(this.notacredito.n_nota_credito, this.rucempresa.serieestab, this.rucempresa.ptoemi, this.notacredito.fecha_hora, this.rucempresa.ruc, this.rucempresa.tipoambiente).subscribe( (data : any) =>
    {
      this.notacredito.claveacceso = data.claveacceso;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarRucEmpresa()
  {
    const resultado = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.rucempresa.cod_ruc );
    this.rucempresa.empresa = resultado.empresa;
    this.rucempresa.serieestab = resultado.serieestab;
    this.rucempresa.ptoemi = resultado.ptoemi;
    this.rucempresa.ruc = resultado.ruc_sucursal;
    this.rucempresa.tipoambiente = resultado.tipo_ambiente;
    this.rucempresa.razon_social = resultado.razonsocial;
    this.rucempresa.nombre_comercial = resultado.nombrecomercial;
    this.rucempresa.contabilidad = resultado.contabilidad;
    this.rucempresa.direccion_matriz = resultado.direccion_matriz;
    this.rucempresa.direccion_establecimiento = resultado.direccion_establecimiento;
    this.rucempresa.tipo_contribuyente = resultado.tipo_contribuyente;
    this.rucempresa.contribuyente = resultado.contribuyente;
    this.rucempresa.leyenda = resultado.leyenda;
    this.rucempresa.firmap12 = resultado.firmap12;
    this.rucempresa.clavep12 = resultado.clavep12;
    this.rucempresa.pk12 = resultado.pk12;
    this.rucempresa.firmapublica = resultado.firmapublica;
    this.rucempresa.firmaprivada = resultado.firmaprivada;
    this.rucempresa.certificado = resultado.certificado;
    this.rucempresa.facturaversion = resultado.facturaversion;
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.notacredito.id_forma_pago = elemento;
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.notacredito.id_forma_pago );
    this.notacredito.forma_pago = resultado.forma_pago;
  }

  changeReembolsar(event: any): void {
    const elemento = event.target.value;
    this.notacredito.cod_reembolso = elemento;

    if(this.notacredito.cod_reembolso=="0" || this.notacredito.cod_reembolso=="T")
    {
      let formapago = [{
        "id_forma_pago": "0",
        "forma_pago": "NO APLICA"
      }];
      this.datosformapago = formapago;
      this.notacredito.id_forma_pago = "0";

      this.childdetallenotacredito.datostipoformadevolucion = [
      {
        "cod_tipo_forma_devolucion" : 1,
        "tipo_forma_devolucion" : "PRODUCTO"
      }];
      this.childdetallenotacredito.datosdetalles.forEach(detalle => {
        detalle.cod_tipo_forma_devolucion = 1;
      });
    }
    else
    {
      this.childdetallenotacredito.datostipoformadevolucion = [
      {
        "cod_tipo_forma_devolucion" : 0,
        "tipo_forma_devolucion" : "PRODUCTO Y DINERO"
      },
      {
        "cod_tipo_forma_devolucion" : 2,
        "tipo_forma_devolucion" : "DINERO"
      }];
      this.childdetallenotacredito.datosdetalles.forEach(detalle => {
        detalle.cod_tipo_forma_devolucion = 0;
      });

      this.listarFormaPagos2();
      this.notacredito.id_forma_pago = "01";
    }
    
  }
  q
  clickVerificarDetalles()
  {
    if(this.notacredito.fecha_hora.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.notacredito.cod_reembolso=="T")
      {
        Swal.fire({
          title: "Reembolso de Nota de Crédito",
          html: `
            <div class="container text-left">
              <div class="row mb-2">
                <div class="col text-center">
                  <h3 class="mb-0">Seleccione <strong>SI Reembolsar</strong> si va devolver el producto y dinero al cliente, Seleccione <strong>NO Reembolsar</strong> si el dinero no lo va a devolver el cliente para usarlo en una compra posterior</h3>
                </div>
              </div>
            </div>
          `,
          confirmButtonText: 'OK'
        }).then( (result) => {
          if (result.value) {
           
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          
          }
        });
      }
      else
      {
        if (this.notacredito.importetotal == 0 || this.notacredito.id_forma_pago.length == 0)
        {
          this.toastr.warning("Verifique forma de Pago, No hay nada que facturar, realice la factura por favor", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {    
          this.verificaDetalles();
        }
      }
    }
  }

  async clickVerificarEncabezado()
  {
    if(this.notacredito.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      Swal.fire({
        title: 'Actualizar Encabezado de Nota de Crédito',
        text: '¿Estás seguro de actualizar registro?',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Actualizar',
        cancelButtonText: 'No, Cerrar'
      }).then( async (result) => {
        if (result.value) {

          if(this.notacredito.tipo_venta=="ELECTRONICA")
          {
            await this.iniciarProcesoFacturacion();
          }
          else
          {
            this.actualizarEncabezado();
          }

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
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

  async guardar()
  {
    let detalles = [];
    
      this.childdetallenotacredito.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'id_detalle_venta' : item.id_detalle_venta,
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
          'unidades_denominacion' : item.unidades_denominacion,
          'inventario' : item.inventario,
          'cantidad_unidad_restada' : item.cantidad_unidad_restada,
          'cod_tipo_forma_devolucion' : item.cod_tipo_forma_devolucion
        };
        detalles.push(detalle);
      });

      let nota_credito = {
        'cod_nota_credito' : this.notacredito.cod_nota_credito,
        'id_forma_pago' : this.notacredito.id_forma_pago,
        'n_nota_credito' : this.notacredito.n_nota_credito,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
    
        'ruc' :this.rucempresa.ruc,
        'tipoambiente' : this.rucempresa.tipoambiente,
    
        'fecha_hora' : this.notacredito.fecha_hora,
        'fecha_emision_factura' : this.notacredito.fecha_emision_factura,

        'cod_factura_venta' : this.notacredito.cod_factura_venta,
        'comprobante' : "FACTURA",
        'numero_factura' : this.notacredito.numero_factura,
        
        'cod_cliente' : this.cliente.cod_cliente,
    
        'subtotalconimpuesto' : this.childdetallenotacredito.subtotal12,
        'subtotalsinimpuesto' : this.childdetallenotacredito.subtotal0,
        'totalsinimpuestos' : this.childdetallenotacredito.totalsinimpuestos,
        'total_descuento' : this.childdetallenotacredito.totaldescuento,
        'total_iva' : this.childdetallenotacredito.totalconimpuestos,
        'total_ice' : this.childdetallenotacredito.totalconice,
        'importetotal' : this.childdetallenotacredito.importetotal,
    
        'cod_sucursal' : this.cod_sucursal_estable,
        'tipo_venta' : this.notacredito.tipo_venta,
    
        'motivo' : this.notacredito.razon_modificacion,
    
        'observacion' : this.notacredito.observacion,
        'kardex' : this.kardex,
        'reembolso' : this.notacredito.cod_reembolso,
        'detalles' : detalles,
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      this.notacredito.totalsinimpuestos = this.childdetallenotacredito.totalsinimpuestos;
      this.notacredito.totaldescuento = this.childdetallenotacredito.totaldescuento;
      this.notacredito.totalconimpuestos = this.childdetallenotacredito.totalconimpuestos;
      this.notacredito.subtotal12 = this.childdetallenotacredito.subtotal12;
      this.notacredito.subtotal0 = this.childdetallenotacredito.subtotal0;
      this.notacredito.totalconice = this.childdetallenotacredito.totalconice;
      this.notacredito.observacion = this.childdetallenotacredito.observacion;
      
      this.loadingalmacenar = true;

      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.guardar(nota_credito));

          this.loadingalmacenar = false;  

          if (data.estado == true)
          {
            this.notacredito.n_nota_credito = data.n_nota_credito;
            this.notacredito.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
            this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

            this.notacredito.fecha_hora = moment(data.fecha_hora).format('YYYY-MM-DD');//data.fecha_hora

            this.disabledbtnguardar = true;
            this.disabledbtnimprimir = false;
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Nota de Crédito registrada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.deshabilitarFormulario();
            this.childdetallenotacredito.disabledtabladetalles = true;
            //this.childdetallenotacredito.deshabilitarFormulario();
            
            if(this.notacredito.tipo_venta=="ELECTRONICA")
            {
              await this.iniciarProcesoFacturacion();
              this.visualizar();
            }
            else
            {
              this.visualizar();
            }
          }
          else
          {
            this.toastr.error("Nota de Crédito no se pudo registrar, error inesperado: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
      }
      catch (err) {
        this.loadingalmacenar = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }

  visualizar()
  {	 
     if(this.notacredito.tipo_venta=="FACTURA" || this.notacredito.tipo_venta=="ELECTRONICA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/notacredito?codnotacredito=" + this.notacredito.cod_nota_credito, "Devolución Venta", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
      
     if(this.notacredito.tipo_venta=="RECIBO")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/devolucionrecibo?codnotacredito=" + this.notacredito.cod_nota_credito, "Devolución Nota de Venta", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }
  }

  async actualizar()
  {
    let detalles = [];
    
      this.childdetallenotacredito.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'id_detalle_venta' : item.id_detalle_venta,
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
          'cod_tipo_forma_devolucion' : item.cod_tipo_forma_devolucion
        };
        detalles.push(detalle);
      });

      let nota_credito = {
        'cod_nota_credito' : this.notacredito.cod_nota_credito,
        'n_nota_credito' : this.notacredito.n_nota_credito,
		    'claveacceso' : this.notacredito.claveacceso,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
        'cod_usuario' : this.notacredito.cod_usuario,//El backend lo ubica

        'id_forma_pago' : this.notacredito.id_forma_pago,
    
        'ruc' :this.rucempresa.ruc,
        'tipoambiente' : this.rucempresa.tipoambiente,
    
        'fecha_hora' : this.notacredito.fecha_hora,
        'fecha_registro' : this.notacredito.fecha_registro,
        'fecha_emision_factura' : this.notacredito.fecha_emision_factura,
    
        'cod_factura_venta' : this.notacredito.cod_factura_venta,
        'comprobante' : "FACTURA",
        'numero_factura' : this.notacredito.numero_factura,
        'cod_cliente' : this.cliente.cod_cliente,
    
        'subtotalconimpuesto' : this.childdetallenotacredito.subtotal12,
        'subtotalsinimpuesto' : this.childdetallenotacredito.subtotal0,
        'totalsinimpuestos' : this.childdetallenotacredito.totalsinimpuestos,
        'total_descuento' : this.childdetallenotacredito.totaldescuento,
        'total_iva' : this.childdetallenotacredito.totalconimpuestos,
        'total_ice' : this.childdetallenotacredito.totalconice,
        'importetotal' : this.childdetallenotacredito.importetotal,
    
        'cod_sucursal' : this.notacredito.cod_sucursal,
        'tipo_venta' : this.notacredito.tipo_venta,
    
        'motivo' : this.notacredito.razon_modificacion,
    
        'observacion' : this.notacredito.observacion,
        'kardex' : this.kardex,
        'detalles' : detalles,
        'reembolso' : this.notacredito.cod_reembolso,
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      this.notacredito.totalsinimpuestos = this.childdetallenotacredito.totalsinimpuestos;
      this.notacredito.totaldescuento = this.childdetallenotacredito.totaldescuento;
      this.notacredito.totalconimpuestos = this.childdetallenotacredito.totalconimpuestos;
      this.notacredito.subtotal12 = this.childdetallenotacredito.subtotal12;
      this.notacredito.subtotal0 = this.childdetallenotacredito.subtotal0;
      this.notacredito.totalconice = this.childdetallenotacredito.totalconice;
      this.notacredito.observacion = this.childdetallenotacredito.observacion;
      
      this.loadingalmacenar = true;
      
      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.actualizar(nota_credito));

          this.loadingalmacenar = false;
          

          if (data.estado == true)
          {
            this.notacredito.n_nota_credito = data.n_nota_credito;
            this.notacredito.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
            this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

            this.notacredito.fecha_hora = moment(data.fecha_hora).format('YYYY-MM-DD');//data.fecha_hora

            if(this.notacredito.tipo_venta=="ELECTRONICA")
            {
              this.notacredito.totalsinimpuestos = this.childdetallenotacredito.totalsinimpuestos;
              this.notacredito.totaldescuento = this.childdetallenotacredito.totaldescuento;
              this.notacredito.totalconimpuestos = this.childdetallenotacredito.totalconimpuestos;
              this.notacredito.subtotal12 = this.childdetallenotacredito.subtotal12;
              this.notacredito.subtotal0 = this.childdetallenotacredito.subtotal0;
              this.notacredito.totalconice = this.childdetallenotacredito.totalconice;
              this.notacredito.observacion = this.childdetallenotacredito.observacion;
              await this.iniciarProcesoFacturacion();
            }
            else
            {
              this.visualizar();
            }

            this.disabledbtnimprimir = false;
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Nota de Crédito actualizada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.deshabilitarFormulario();
          }
          else
          {
            this.toastr.error("Nota de Crédito no se pudo actualizar, error inesperado: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
      }
      catch (err) {
        this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }

  actualizarEncabezado()
  {
    let detalles = [];
    
      let nota_credito = {
        'cod_nota_credito' : this.notacredito.cod_nota_credito,
        'n_nota_credito' : this.notacredito.n_nota_credito,
		    'claveacceso' : this.notacredito.claveacceso,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
        'cod_usuario' : "",//El backend lo ubica

        'id_forma_pago' : this.notacredito.id_forma_pago,
    
        'ruc' :this.rucempresa.ruc,
        'tipoambiente' : this.rucempresa.tipoambiente,
    
        'fecha_hora' : this.notacredito.fecha_hora,
        'fecha_emision_factura' : this.notacredito.fecha_emision_factura,
    
        'cod_factura_venta' : this.notacredito.cod_factura_venta,
        'comprobante' : "FACTURA",
        'numero_factura' : this.notacredito.numero_factura,
        
        'cod_cliente' : this.cliente.cod_cliente,
    
        'subtotalconimpuesto' : this.childdetallenotacredito.subtotal12,
        'subtotalsinimpuesto' : this.childdetallenotacredito.subtotal0,
        'totalsinimpuestos' : this.childdetallenotacredito.totalsinimpuestos,
        'total_descuento' : this.childdetallenotacredito.totaldescuento,
        'total_iva' : this.childdetallenotacredito.totalconimpuestos,
        'total_ice' : this.childdetallenotacredito.totalconice,
        'importetotal' : this.childdetallenotacredito.importetotal,
    
        'cod_sucursal' : this.notacredito.cod_sucursal,
        'tipo_venta' : this.notacredito.tipo_venta,
    
        'motivo' : this.notacredito.razon_modificacion,
    
        'observacion' : this.notacredito.observacion,
        'kardex' : this.kardex,
        'detalles' : detalles,
        'reembolso' : this.notacredito.cod_reembolso
      };

      
      this.loadingalmacenar = true;
      

      this.notacreditoservice.actualizarEncabezado(nota_credito).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;
          

          if (data.estado == true)
          {
            this.notacredito.n_nota_credito = data.n_nota_credito;
            this.notacredito.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
            this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

            this.disabledbtnimprimir = false;
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Nota de Crédito actualizada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.deshabilitarFormulario();
          }
          else
          {
            this.toastr.error("Nota de Crédito no se pudo actualizar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      });
  }

  verificarRegistro()
  {
    this.loading = true;
    

    this.notacreditoservice.verificarRegistro().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.notacredito.cod_nota_credito = data.codigo;
        this.notacredito.n_nota_credito = data.n_comprobante;
        this.notacredito.claveacceso = data.claveacceso;
        this.notacredito.fecha_hora = moment(data.fecha).format('YYYY-MM-DD');
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  recibirDatosDetalles(importetotal: number)
  {
    this.notacredito.importetotal = importetotal;
  }



  formularioNormal()
  {
    this.notacreditoexistente = "0";

    this.notacredito.cod_nota_credito = "";
    this.notacredito.n_nota_credito = "";
    this.notacredito.razon_modificacion = "DEVOLUCION";
    this.notacredito.claveacceso = "0";
    this.notacredito.fecha_hora = moment().format('YYYY-MM-DD');
    this.notacredito.observacion = "";

    this.colormensaje = "";
    this.textomensaje = "";

    this.notacredito.id_forma_pago = "01";
    this.notacredito.forma_pago = "SIN UTILIZACION DEL SISTEMA FINANCIERO";
    this.datosformapago = [];
   
    this.loading = false;
    

    this.flagNormal();

    this.arr_nota_credito = {};

    this.notacredito.cod_factura_venta = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
   
    this.listarFormaPagos();

    this.notacredito.cod_reembolso = "T";
     
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagformapago = false;


    if(this.notacredito.forma_pago=="0")
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
        this.buscarFacturaVenta();
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

  listarFormaPagos2()
  {    
    this.loading = true;
    this.formapagoservice.listarFormaPagos().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosformapago = data;
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  buscarFacturaNotaCredito()
  {
    this.loading = true;
    

    this.notacreditoservice.buscarFacturaNotaCredito(this.notacredito.cod_factura_venta).subscribe( (data : any) =>
    {
      if(data[0].estado=="ANULADA")
      {
        Swal.fire({
          title: "Control del Sistema",
          text: "Este documento ya esta anulado, retroceda y seleccione otro",
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
        //this.notacredito.cod_reembolso = data[0].reembolso;
        
        this.notacredito.cod_nota_credito = data[0].cod_nota_credito;
        this.rucempresa.cod_ruc = data[0].cod_ruc;
        this.rucempresa.empresa = data[0].empresa;
        this.notacredito.cod_usuario = data[0].cod_usuario;
  
        this.notacredito.n_nota_credito = this.padLeft(data[0].numero_nota_credito, 9);
        this.notacredito.claveacceso = data[0].claveacceso;
        this.rucempresa.serieestab = data[0].serieestab;
        this.rucempresa.ptoemi = data[0].ptoemi;
        this.rucempresa.ruc = data[0].ruc_sucursal;
        this.rucempresa.tipoambiente = data[0].tipo_ambiente;

        this.notacredito.fecha_hora = moment(data[0]["fecha_hora_nota_credito"]).format('YYYY-MM-DD');
        this.notacredito.fecha_registro = data[0].fecha_registro;
        this.notacredito.fecha_emision_factura = data[0].fecha_hora;//Fecha hora de la factura

        this.notacredito.razon_modificacion = data[0].motivo;
        this.notacredito.id_forma_pago = data[0].id_forma_pago;

        this.notacredito.cod_sucursal = data[0].cod_sucursal;
  
        this.notacredito.iva = data[0].iva;
  
        this.rucempresa.razon_social = data[0].razonsocial;
        this.rucempresa.nombre_comercial = data[0].nombrecomercial;
        this.rucempresa.direccion_matriz = data[0].direccion_matriz;
        this.rucempresa.direccion_establecimiento = data[0].direccion_establecimiento;
        this.rucempresa.tipo_contribuyente = data[0].tipo_contribuyente;
        this.rucempresa.contribuyente = data[0].contribuyente;
        this.rucempresa.contabilidad = data[0].contabilidad;
        this.rucempresa.leyenda = data[0].leyenda;
        
        this.rucempresa.facturaversion = data[0].facturaversion;
  
        this.rucempresa.firmap12 = data[0].firmap12;
        this.rucempresa.clavep12 = data[0].clavep12;
        this.rucempresa.pk12 = data[0].pk12;
        this.rucempresa.firmapublica = data[0].firmapublica;
        this.rucempresa.firmaprivada = data[0].firmaprivada;
        this.rucempresa.certificado = data[0].certificado;
  
        this.notacredito.tipo_venta = data[0].tipo_venta;
        this.notacredito.numero_factura = this.padLeft(data[0].serieestab, 3) + "-" + this.padLeft(data[0].ptoemi, 3) + "-" + this.padLeft(data[0].numero_factura, 9);
    
        this.cliente.cod_identificacion = data[0].cod_identificacion;
        this.cliente.identificacion = data[0].identificacion;
        this.cliente.cod_cliente = data[0].cod_cliente;
        this.cliente.cliente = data[0].cliente;
        this.cliente.numero_identificacion = data[0].cedula;
        this.cliente.celular = data[0].celular;
        this.cliente.telefono = data[0].convencional;
        this.cliente.correo = data[0].correo;
        this.cliente.direccion = data[0].direccion;
        this.notacredito.observacion = data[0].observacion_nota_credito
        this.childdetallenotacredito.observacion = data[0].observacion;

        if(data[0].reembolso=="0")
        {
          this.datosformapago = [];
          let formapago = [{
            "id_forma_pago": "0",
            "forma_pago": "NO APLICA"
          }];
          this.datosformapago = formapago;
        }

        /* La actualización de Nota de Crédito no aplica este codigo, es como crear otra vez
        if(data[0].reembolso=="0" || data[0].reembolso=="T")
        {
          let formapago = [{
            "id_forma_pago": "0",
            "forma_pago": "NO APLICA"
          }];
          this.datosformapago = formapago;
          
          this.childdetallenotacredito.datostipoformadevolucion = [
          {
            "cod_tipo_forma_devolucion" : 1,
            "tipo_forma_devolucion" : "PRODUCTO"
          }];
        }
        else
        {
          this.childdetallenotacredito.datostipoformadevolucion = [
          {
            "cod_tipo_forma_devolucion" : 0,
            "tipo_forma_devolucion" : "PRODUCTO Y DINERO"
          },
          {
            "cod_tipo_forma_devolucion" : 2,
            "tipo_forma_devolucion" : "DINERO"
          }];
        }

        this.notacredito.id_forma_pago = data[0].id_forma_pago;
        this.notacredito.cod_reembolso = data[0].reembolso;
        */
        
        this.childdetallenotacredito.datosdetalles = [];
  
        data.forEach(element => {
          let descripcion = element.detalle;
          let detalle = {
            fila_error : false,//Para marcar la fila editada con rojo
            cod_producto : element.cod_producto,
            inventario : element.inventario,
    
            cod_tarifa : element.cod_tarifa,
            cantidad_tarifa : element.cantidad_tarifa,
    
            porcentaje_ice : parseFloat(element.ice),
            porcentaje_iva : parseFloat(element.iva),
            
            precio_base_minimo : parseFloat(element.precio_base_minimo),
            precio_venta_minimo : parseFloat(element.precio_venta_minimo),
    
            incremento : 0,//Incremento de porcentaje
    
            cantidad_comprar : element.cantidad_comprar,
            tarifa : element.tarifa,
            descripcion : descripcion,
            cantidad_unidad : element.cantidad_unidad,
  
            cantidad_unidad_fija : element.cantidad_unidad,
            cantidad_unidad_restada : 0,
    
            precio_base : parseFloat(element.precio),
    
            checked : false,//Ckeked de descuento por porcentaje
            
            descuento : 0,//Editable
            descuento_calculado : element.descuento,//Calculado
    
            total : redondeardecimales(element.total, 6),
            iva : redondeardecimales(element.total_iva, 2),
            ice : redondeardecimales(element.total_ice, 2),
  
            codigo_iva : element.codigo_iva,
    
            total_final : redondeardecimales(element.total_final, 2),
            unidades_denominacion : element.unidades_denominacion,
            modificable : 0,
            id_detalle_venta : element.id_detalle_venta
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
        this.notacredito.importetotal = this.childdetallenotacredito.importetotal;
  
        this.loading = false;
        
  
        this.habilitarFormulario();
        
        /*
        if(this.kardex=="1")
        {
          this.childdetallenotacredito.deshabilitarFormulario();
        }
        else
        {
        */
          this.childdetallenotacredito.habilitarFormulario();
        /*
        }
        */
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }
  
  listarRucEmpresas()
  {    
    this.loading = true;
    

    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.datosrucempresa = data;
      this.loading = false;
      
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarFacturaVenta()
  {
    this.loading = true;

    this.ventaservice.buscarFactura(this.notacredito.cod_factura_venta).subscribe( (data : any) =>
    {
      if(data[0].estado=="ANULADA")
      {
        Swal.fire({
          title: "Control del Sistema",
          text: "La factura de venta ya esta anulada, retroceda y seleccione otro",
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
        this.rucempresa.cod_ruc = data[0].cod_ruc;
        this.buscarRucEmpresa();

        this.notacredito.tipo_venta = data[0].tipo_venta;
        this.notacredito.numero_factura = this.padLeft(data[0].serieestab, 3) + "-" + this.padLeft(data[0].ptoemi, 3) + "-" + this.padLeft(data[0].numero_factura, 9);
    
        this.cliente.cod_identificacion = data[0].cod_identificacion;
        this.cliente.identificacion = data[0].identificacion;
        this.cliente.cod_cliente = data[0].cod_cliente;
        this.cliente.cliente = data[0].cliente;
        this.cliente.numero_identificacion = data[0].cedula;
        this.cliente.celular = data[0].celular;
        this.cliente.telefono = data[0].convencional;
        this.cliente.correo = data[0].correo;
        this.cliente.direccion = data[0].direccion;

        this.notacredito.fecha_emision_factura = data[0].fecha_hora;//Fecha hora de la factura
        
        this.notacredito.cod_sucursal = data[0].cod_sucursal;
        this.childdetallenotacredito.observacion = data[0].observacion;
        
        this.childdetallenotacredito.datosdetalles = [];
  
        data.forEach(element => {
          let descripcion = element.detalle;
          let detalle = {
            fila_error : false,//Para marcar la fila editada con rojo
            cod_producto : element.cod_producto,
            inventario : element.inventario,
    
            cod_tarifa : element.cod_tarifa,
            cantidad_tarifa : element.cantidad_tarifa,
    
            porcentaje_ice : element.ice,
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
    
            checked : false,//Ckeked de descuento por porcentaje
            
            descuento : 0,//Editable
            descuento_calculado : element.descuento,//Calculado
    
            total : redondeardecimales(element.total, 6),
            iva : redondeardecimales(element.total_iva, 2),
            ice : redondeardecimales(element.total_ice, 2),
  
            codigo_iva : element.codigo_iva,
    
            total_final : redondeardecimales(element.total_final, 2),
            unidades_denominacion : element.unidades_denominacion,
            modificable : 0,
            id_detalle_venta : element.id_detalle_venta
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
        this.notacredito.importetotal = this.childdetallenotacredito.importetotal;
  
        this.loading = false;
        
        $("#mymodal").modal("show");
        this.buscarnotacreditoporfactura();
      }
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
    

    this.notacreditoservice.buscarnotacreditoporfactura(this.notacredito.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.cod_nota_credito == false)
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

  clickNuevo() {
    this.notacreditoexistente = "0";
    this.verificarRegistro();
    //this.habilitarFormulario();
    //this.childdetallenotacredito.habilitarFormulario();
  }

  goBack(){
    this.location.back();
  }

  async iniciarProcesoFacturacion()
  {
      this.iniciarLoading();
      try
      {
        this.disabledbtnsrienviar = false;
        let arrnotacredito = await this.srinotacredito.crearFirmarXml2(this.cod_proyecto, this.cliente, this.rucempresa, this.notacredito, this.childdetallenotacredito.datosdetalles);
        
        /*Ya no pregunta si desea enviar mas tarde*/
        const resultado = await this.srinotacredito.enviarSri(this.cod_proyecto, this.notacredito);
        if (resultado.estado == "RECIBIDA")
        {
          const resultadocomprobacionsri = await this.srinotacredito.comprobarSri(this.cod_proyecto, this.notacredito);
          const data = resultadocomprobacionsri.data;
          if(resultadocomprobacionsri.estado)
          {
            if(data.estadomensaje=="AUTORIZADO")
            {
              this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.srinotacredito.actualizarEstado(this.notacredito.cod_nota_credito, this.notacredito.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
              await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO");
              arrnotacredito.fechaautorizacion = data.fechaautorizacion;
              const resultadoride = await this.srinotacredito.crearRide(arrnotacredito, this.cliente);
              if(resultadoride)
              {
                const resultadoenviocorreo = await this.srinotacredito.enviarCorreo(this.cod_proyecto, this.notacredito, this.cliente, this.rucempresa);
                if(resultadoenviocorreo)
                {
                  this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                  await this.srinotacredito.actualizarEstadoCorreo(this.notacredito.cod_nota_credito);
                }
              }
            }

            if(data.estadomensaje=="EN PROCESO")
            {
              this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.srinotacredito.actualizarEstado(this.notacredito.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
              await this.informacionActualizarEstado(resultadoestado, "EN PROCESO");
            }

            if(data.estadomensaje=="NO AUTORIZADO")
            {
              this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.srinotacredito.actualizarEstado(this.notacredito.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
              await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO");
            }
          }
          else
          {
            if(data.identificador=="0")
            {
              this.toastr.warning("Comprobante en Proceso", "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.srinotacredito.actualizarEstado(this.notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
              await this.informacionActualizarEstado(resultadoestado, "EN PROCESO");
            }
          }
        }
        else
        {
          if(resultado.estado=="EN PROCESO")//En procesamiento debe esperar 24 Horas
          {
            this.toastr.warning("Comprobante en Proceso " + resultado.data.mensaje, "INFORMACIÓN DEL SISTEMA");
            const resultadoestado = await this.srinotacredito.actualizarEstado(this.notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
            await this.informacionActualizarEstado(resultadoestado, "EN PROCESO");
          }
          else
          {
            if(resultado.estado=="DEVUELTA")
            {
              this.toastr.error("Comprobante devuelto: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.srinotacredito.actualizarEstado(this.notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "DEVUELTA", resultado.data.fechaautorizacion);
              await this.informacionActualizarEstado(resultadoestado, "DEVUELTA");
            }
            else//ERROR CONEXION
            {
              this.toastr.error("Se Origino un error en el sistema de recepción de SRI: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.srinotacredito.actualizarEstadoError(this.notacredito.cod_nota_credito, resultado.data.identificador, resultado.data.mensaje, resultado.data.informacionadicional, "CREADA");
            }
          }
        }
        
      } catch (err) {
        this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
      } finally {
        Swal.close();
      }
      
  }

  async informacionActualizarEstado(data: any, estado: string)
  {
      if(estado=="AUTORIZADO")
      {
          this.disabledbtnsrienviar = true;
          this.colormensaje = "#0000FF";
          this.textomensaje = "AUTORIZADO";
      }

      if(estado=="EN PROCESO")
      {
          this.disabledbtnsrienviar = true;
          this.colormensaje = "#ffc107";
          this.textomensaje = "EN PROCESO";    
      }

      if(estado=="DEVUELTA")
      {
          this.colormensaje = "#FF0000";
          this.textomensaje = "DEVUELTA";
      }

      if(estado=="NO AUTORIZADO")
      {
          this.colormensaje = "#FF0000";
          this.textomensaje = "NO AUTORIZADO";
      }
  }

  iniciarLoading()
  {
    Swal.fire({
      title: 'Procesando con el SRI...',
      html: `<div class="spinner-border text-primary" style="width: 3rem; height: 3rem; margin-top: 1rem; margin-bottom: 1rem;"></div>`,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      customClass: {
        popup: 'swal2-loading-popup'
      }
    });
  }

}