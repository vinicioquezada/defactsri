import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ListadoClienteVentaComponent } from 'src/app/shared/components/venta/listado-cliente-venta/listado-cliente-venta.component';
import { ClienteFormComponent } from '../cliente/cliente-form/cliente-form.component';
declare var $:any;
import { DetalleVentaComponent } from 'src/app/shared/components/detalle-venta/detalle-venta.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';

import { ClienteService } from '../../services/cliente.service';
import { FacturaVentaDTO } from '../../models/factura-venta.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { RegistroAbonoVentaComponent } from 'src/app/shared/components/registro-abono-venta/registro-abono-venta.component';
import { PedidoPanaderiaComponent } from 'src/app/shared/components/venta/pedido-panaderia/pedido-panaderia.component';
import { FormaPagoComponent } from 'src/app/shared/components/forma-pago/forma-pago.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RecargoFacturaComponent } from 'src/app/shared/components/recargo-factura/recargo-factura.component';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { lastValueFrom } from 'rxjs';
import { ListadoProductoVentasComponent } from 'src/app/shared/components/listado-producto/listado-producto-ventas/listado-producto-ventas.component';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  
  opcionesprivilegios : any;
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  defecto_venta : string = "";
  numeracion_automatica : string = "";
  comision_venta : string = "";
  kardex : string = "";
  afiliacion_cliente : string = "0";
  @ViewChild(ListadoClienteVentaComponent) childlistadocliente!: ListadoClienteVentaComponent;
  @ViewChild(ListadoProductoVentasComponent) childlistadoproductoventas!: ListadoProductoVentasComponent;
  @ViewChild(ClienteFormComponent) clienteformcomponent: any;
  @ViewChild(DetalleVentaComponent) childdetalleventa: any;
  @ViewChild(RegistroAbonoVentaComponent) childregistroabonoventa: any;
  @ViewChild(FormaPagoComponent) childformapago: any;
  @ViewChild(RecargoFacturaComponent) childrecargofactura: any;
  @ViewChild(PedidoPanaderiaComponent) childpedidopanaderia: any;

  @ViewChild("txtcodigobarra") txtcodigobarra: ElementRef;

  datosrucempresa : any;
  datosempleados : any;

  datostipoventa : any;

  disabledbtnnuevo : boolean = false;
  disabledbtncambio : boolean = true;
  disabledbtnguardar: boolean = true;
  disabledbtnimprimir : boolean = true;

  disabledbtnlistarcliente : boolean = true;
  disabledbtnagregarcliente : boolean = true;

  chkimpuesto : boolean = true;
  disabledchkimpuesto : boolean = true;
  disabledtxtcodigobarra : boolean = true;
  disabledbtnlistarproducto : boolean = true;

  disabledcmbtipoventa : boolean = true;
  disabledtxtnfactura : boolean = true;
  disabledtxtfecha : boolean = true;
  disabledcmbrecargo : boolean = true;
  disabledformapago : boolean = true;
  chkcontado : boolean = true;
  disabledchkcontado : boolean = true;
  disabledbtncalcular : boolean = true;
  
  facturaventa: FacturaVentaDTO = new FacturaVentaDTO;

  colormensaje : string = "";
  textomensaje : string = "";

  cliente: ClienteDTO = new ClienteDTO;
  rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

  codigo_barra : string = "";

  //formapago: FormaPagoDTO = new FormaPagoDTO;
  //recargo: RecargoDTO = new RecargoDTO;

  flagformapago : boolean = false;

  loading : boolean = false;

  loadingalmacenar : boolean = false;

  disabledcmbempleado : boolean = true;
  flagempleado : boolean = false;

  arr_factura_venta : any;

  datosproducto : any = [];
  datostarifasproducto : any = [];

  flagtextoafiliar: boolean = false;
  flagbotonafiliar: boolean = false;
  cantidad_compras : number = 0;

  tipo_formulario: string = "";

  disabledbtnmodificar : boolean = false;
  disabledbtnactualizar: boolean = true;
  detallesactualizar : any = [];

  estado_pedido : number = 0;
  cod_pedido : any = [];
  excluir : number = 0;

  firmasruc: string = "";
  cod_sucursal_estable: string = "";
  sucursal_estable: string = "";

  recaudador: string = "";

  fecha_registro_anterior: string = "";



  constructor(private location: Location, private ventaservice : VentaService, private toastr : ToastrService, private error : ErrorService, private rucempresaservice : RucEmpresaService, private empleadoservice : EmpleadoService, private clienteservice:ClienteService, private rutaActiva: ActivatedRoute, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;

    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.numeracion_automatica = this.usersession.getConfiguracion("numeracion_automatica");
    this.comision_venta = this.usersession.getConfiguracion("comision_venta");
    this.datosrucempresa = [];
    this.rucempresa.cod_ruc = this.usersession.getConfiguracion("cod_sucursal");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.afiliacion_cliente = this.usersession.getConfiguracion("afiliacion_cliente");
    this.facturaventa.iva = Number(this.usersession.getConfiguracion("iva"));
    this.facturaventa.codigo_iva = Number(this.usersession.getConfiguracion("codigo_iva"));
    this.recaudador = this.usersession.getConfiguracion("recaudador");

    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.cod_sucursal_estable = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal_estable = this.usersession.getConfiguracion("sucursal");

    //this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0;
    this.disabledcmbrecargo = true;
    this.disabledchkcontado = true;
    this.facturaventa.pedido = 1;
    this.chkcontado = false;
    this.facturaventa.deudor=1;
    this.facturaventa.tipo_credito=1;
    this.facturaventa.diferencia="";
    this.facturaventa.diferenciavalor="";
    this.facturaventa.recibido="";
    this.facturaventa.recibidoabono="0";
    this.disabledbtncalcular = true;

    this.cargaInicioPedidos();
    
  }

  async cargaInicioPedidos()
  {
    this.datostipoventa = [];

    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro")
    {
      await this.listarTipoVenta();
      
      this.defecto_venta = this.datostipoventa[0].cod_tipo_venta;
      this.facturaventa.tipo_venta = this.defecto_venta;

      this.estado_pedido = 0;
      this.cod_pedido = [];
      this.excluir = 0;
    }
  
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.listarSucursales();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.listarEmpleados();
        this.formularioNormal();
      }
    }
    this.bodyStyleService.resetBodyStyles();
    
  }

  ngAfterViewInit(): void {
    //this.childformapago.formularioNormal();
    //this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0;
  }

  clickNuevo()
  {
    if(this.datosrucempresa.length>0)
    {
      this.loading = true;
      
      
        const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
        result.then(() => { 
          this.formularioNormal();
          this.habilitarFormulario();
  
          this.childdetalleventa.datosdetalles = [];

          this.verificarRegistro();
         
          this.datosproducto = this.childlistadoproductoventas.datosproducto;
          this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
          this.loading = false;
          
        }).catch(() => {
          this.loading = false;
          
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickModificar()
  {


    if(this.facturaventa.tipo_venta=="PEDIDO RESERVADO" || this.facturaventa.tipo_venta=="PEDIDO CON SALIDA")
    {
      this.disabledchkcontado = true;
    }
    else
    {
      if(this.childrecargofactura.recargo.cod_transaccion_tarjeta==0)
      {
        this.disabledchkcontado = false;
        this.disabledbtncalcular = false;
      }
      else
      {
        this.disabledchkcontado = true;
        this.disabledbtncalcular = true;
      }
    }

    if(this.facturaventa.tipo_venta=="PEDIDO RESERVADO" || this.facturaventa.tipo_venta=="PEDIDO CON SALIDA" ||  this.facturaventa.tipo_venta=="PEDIDO ACUMULATIVO")
    {
      this.loading = true;
      const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => { 
        this.habilitarFormulario();
        this.childlistadocliente.listarClientes();
        this.datosproducto = this.childlistadoproductoventas.datosproducto;
        this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
    }
    else
    {
      this.loading = true;
      const result = this.childlistadoproductoventas.listarProductosPorSucursalSinInventario(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => { 
        this.habilitarFormulario();
        this.childlistadocliente.listarClientes();
        this.datosproducto = this.childlistadoproductoventas.datosproducto;
        this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
    }


      
  }
  
  changeEmpleado(event: any): void {
    const elemento = event.target.value;
    this.facturaventa.cod_empleado = elemento;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.rucempresa.cod_ruc = elemento;
    this.buscarRuc();
    this.loading = true;
    this.datosproducto = [];
    this.datostarifasproducto = [];
    const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();


    result.then(() => {      
      this.datosproducto = this.childlistadoproductoventas.datosproducto;
      this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
      this.loading = false;
      this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
    }).catch(() => {
      this.loading = false;
      this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
    });
  }

  buscarRuc()
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
    this.rucempresa.tipo_ruc = resultado.tipo_ruc;
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

  sendChangeRecargo(valor: any) {
    this.facturaventa.deudor = 0;
    this.chkcontado = true;
    this.disabledchkcontado = valor.disabledchkcontado;
    this.disabledbtncalcular = valor.disabledbtncalcular;
    this.childdetalleventa.reiniciarPorcentajeTarifa();
    this.facturaventa.diferencia = "";
    this.facturaventa.diferenciavalor="";
    this.facturaventa.recibido = "";
    this.facturaventa.recibidoabono = "0";
    //this.formapago = valor.formapago;
  }

  sendChangeTarjetaTarifa(tarifa_recargo: number) {
    this.childdetalleventa.reiniciarPorcentajeTarifa();
    //this.formapago = formapago;
    this.childdetalleventa.aplicarPorcentajeTarifa(tarifa_recargo);
  }
  
  /*
  changeChkImpuesto()
  {
    if(this.chkimpuesto==true){
      this.chkimpuesto = false;
      this.childlistadoproductoventas.chkimpuesto = false;
    }else{
      this.chkimpuesto = true;
      this.childlistadoproductoventas.chkimpuesto = true;
    }
  }
  */
  
  clickVerificar()
  {
    if(this.cliente.cod_cliente == "1")
    {
      this.toastr.warning("Debe seleccionar un cliente para el registro del Pedido", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.facturaventa.fecha_registro.length == 0)
      {
        this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        if (this.facturaventa.importetotal == 0)
        {
          this.toastr.warning("El total a cobrar está en 0, no se puede guardar o actualizar comprobantes en valores 0", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          let importesumadoformapago = this.childformapago.datosformapagoseleccion.reduce((suma, item) => suma + parseFloat(item.valor), 0);
          if(importesumadoformapago == this.facturaventa.importetotal)
          {
            let numeracionautomatica = parseInt( this.numeracion_automatica );
            if(numeracionautomatica==1)
            {
              if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
              {
                this.verificarPedidoPanaderia();
              }
              else
              {
                this.verificaDetalles();
              }
            }
            else
            {
              if (this.facturaventa.numero_factura.length == 0)
              {
                this.toastr.warning("Ingrese Numero de Factura por favor.", "INFORMACIÓN DEL SISTEMA");
              }
              else
              {
                if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
                {
                  this.verificarPedidoPanaderia();
                }
                else
                {
                  this.verificaDetalles();
                }
              }
            }
         }
         else
         {
          this.toastr.warning("Los valores de la forma pago deben surmarse y ser igual al importe total", "INFORMACIÓN DEL SISTEMA");
         }
        }
      }
    }
  }

  verificarPedidoPanaderia()
  {
      this.verificaDetalles();
  }

  changeTipoVenta(event: any): void {
    const elemento = event.target.value;
    this.facturaventa.tipo_venta = elemento;

    this.childdetalleventa.datosdetalles = [];
    this.childdetalleventa.formularioNormal();
    this.childformapago.formularioNormal();
    this.facturaventa.importetotal = 0;

    this.arr_factura_venta = {};

    if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA") {
      this.childlistadoproductoventas.page = 1;
      this.childlistadoproductoventas.filterpost="";
      const result = this.childlistadoproductoventas.listarProductosPorSucursalSinInventario(this.cod_sucursal_estable,this.rucempresa.tipo_ruc).then();
      result.then(() => {      
        this.datosproducto = this.childlistadoproductoventas.datosproducto;
        this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
        this.loading = false;
        this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
    }
    else
    {
      const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => {      
        this.datosproducto = this.childlistadoproductoventas.datosproducto;
        this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
        this.loading = false;
        this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
    }
    
    if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
    {
      this.childpedidopanaderia.formularioNormal("nuevo", this.facturaventa.cod_factura_venta);
    }

    if(this.facturaventa.tipo_venta=="PEDIDO RESERVADO" || this.facturaventa.tipo_venta == "PEDIDO PANADERIA" || this.facturaventa.tipo_venta == "PEDIDO CON SALIDA" || this.facturaventa.tipo_venta=="PEDIDO ACUMULATIVO") {
      this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0;
      this.disabledcmbrecargo = true;
      this.disabledchkcontado = true;
      this.facturaventa.pedido = 1;
      this.chkcontado = false;
      this.facturaventa.deudor=1;
      this.facturaventa.tipo_credito=1;
      this.facturaventa.diferencia="";
      this.facturaventa.diferenciavalor="";
      this.facturaventa.recibido="";
      this.facturaventa.recibidoabono="0";
      this.toastr.warning("Se registrara como cuenta por cobrar el documento.", "INFORMACIÓN DEL SISTEMA");
      this.childdetalleventa.observacion = "";
      this.disabledbtncalcular = true;
    }
  }

  buscarNFactura()
  {
    this.loading = true;
    

    this.ventaservice.buscarNumeroFactura(this.facturaventa.numero_factura).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.warning("El Numero de Factura Ingresado ya existe, cambiar el número por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.verificaDetalles();
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  verificaDetalles()
  {
    let fila_error = false;
    for (let c = 0; c< this.childdetalleventa.datosdetalles.length; c++)
    {
      if(this.childdetalleventa.datosdetalles[c].fila_error == true)
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
            title: 'Guardar Registro de Pedido',
            text: '¿Estás seguro de almacenar registro?',
            icon: 'info',//'warning'
            showCancelButton: true,
            confirmButtonText: 'Si, Almacenar',
            cancelButtonText: 'No, Cerrar'
          }).then((result) => {
            if (result.value) {
              if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA" && this.childpedidopanaderia.selectedimagefile != null)
              {
                this.subirImagenPedido("guardar");
              }
              else
              {
                this.guardar();
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              
            }
          });
        }
        else
        {
          if(this.tipo_formulario == "actualizarregistro")
          {
            Swal.fire({
              title: 'Actualizar Registro de Pedido',
              text: '¿Estás seguro de actualizar registro?',
              icon: 'info',//'warning'
              showCancelButton: true,
              confirmButtonText: 'Si, Actualizar',
              cancelButtonText: 'No, Cerrar'
            }).then((result) => {
              if (result.value) {
                if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
                {
                  if(this.childpedidopanaderia.selectedImageBase64 == this.childpedidopanaderia.selectedImageBase64anterior)
                  {
                    this.actualizar();
                  }
                  else
                  {
                    if(this.childpedidopanaderia.selectedimagefile == null)
                    {
                      this.eliminarImagenPedido("actualizar");
                    }
                    else
                    {
                      this.subirImagenPedido("actualizar");
                    }
                  }
                }
                else
                {
                  this.actualizar();
                }
                
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                
              }
            });
          }
        }

      
    }
  }

  subirImagenPedido(opcion: string) {
    this.loadingalmacenar = true;
    let formImage = new FormData();
    formImage.append("imagen", this.childpedidopanaderia.selectedimagefile);
    formImage.append("codigo_imagen", String(this.facturaventa.cod_factura_venta));
    formImage.append("archivo_anterior", String(this.childpedidopanaderia.imagenanterior));
    this.ventaservice.subirImagenPedido(formImage).subscribe( (data : any) => {
      this.loadingalmacenar = false;
      if(data.estado) {
        this.childpedidopanaderia.imagen = data.nombre_archivo;
        if(opcion=="guardar")
        {
          this.guardar();
        }
        else
        {
          this.actualizar();
        }
        
      } else {
        this.toastr.error(data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadingalmacenar = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  eliminarImagenPedido(opcion: string) {
    this.loadingalmacenar = true;
    let formImage = new FormData();
    formImage.append("archivo_anterior", String(this.childpedidopanaderia.imagenanterior));
    this.ventaservice.eliminarImagenPedido(formImage).subscribe( (data : any) => {
      this.loadingalmacenar = false;
      if(data.estado) {
        this.childpedidopanaderia.imagen = "";
        this.actualizar();
      } else {
        this.toastr.error(data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadingalmacenar = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  guardar()
  {
    this.loadingalmacenar = true;

    let detalles = [];
    //console.log(this.childdetalleventa.datosdetalles);
      this.childdetalleventa.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'ice' : item.porcentaje_ice,
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'cantidad_unidad_pedido' : item.cantidad_unidad_pedido,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'precio' : item.precio_base,
          'precio_venta' : item.precio_venta,
          'chkporcentaje' : item.checked,
          'valorporcentaje' : item.descuento,
          'descuento' : item.descuento_calculado,
          'total' : item.total,
          'total_ice' : item.ice,
          'total_iva' : item.iva,
          'total_final' : item.total_final,
          "unidades_denominacion" : item.unidades_denominacion,
          'inventario' : item.inventario
        };
        detalles.push(detalle);
      });

      let pedidopanaderia = {};
      if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
      {
        pedidopanaderia = {
          'forma' : this.childpedidopanaderia.selectedItemForma,
          'pastel' : this.childpedidopanaderia.selectedItemsPastel.join(", "),
          'relleno' : this.childpedidopanaderia.selectedItemsRelleno.join(", "),
          'color' : this.childpedidopanaderia.color,
          'texto' : this.childpedidopanaderia.texto,
          'fecha_entrega' : this.childpedidopanaderia.fecha_entrega,
          'descripcion' : this.childpedidopanaderia.descripcion,
          'imagen' : this.childpedidopanaderia.imagen
        }
      }

      let factura_venta = {
        'cod_factura_venta' : this.facturaventa.cod_factura_venta,
        'n_factura_venta' : this.facturaventa.numero_factura,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
        "numeracion_automatica" : this.numeracion_automatica,
        "cod_empleado" : this.facturaventa.cod_empleado,
    
        'ruc' : this.rucempresa.ruc,
        'tipoambiente' : this.rucempresa.tipoambiente,
    
        'fecha_hora' : this.facturaventa.fecha_registro,
        'cod_cliente' : this.cliente.cod_cliente,
        'cod_transaccion_tarjeta' :  this.childrecargofactura.recargo.cod_transaccion_tarjeta,
        'subtotalconimpuesto' : this.childdetalleventa.subtotal12,
        'subtotalsinimpuesto' : this.childdetalleventa.subtotal0,
        'totalsinimpuestos' : this.childdetalleventa.totalsinimpuestos,
        'total_descuento' : this.childdetalleventa.totaldescuento,
        'total_iva' : this.childdetalleventa.totalconimpuestos,
        'total_ice' : this.childdetalleventa.totalconice,
        'importetotal' : this.childdetalleventa.importetotal,
        'recibido' : this.facturaventa.recibido,
        'diferencia' : this.facturaventa.diferenciavalor,
    
        'cod_sucursal' : this.cod_sucursal_estable,
        'tipo_venta' : this.facturaventa.tipo_venta,
        'deudor' : this.facturaventa.deudor,
        'tipo_credito' : this.facturaventa.tipo_credito,
        'abono' : this.facturaventa.recibidoabono,
        'id_forma_pago_abono' :  this.facturaventa.id_forma_pago_abono,
    
        'porcentaje_tarjeta' : this.childrecargofactura.recargo.tarifa_recargo,
        'observacion' : this.childdetalleventa.observacion,
        'kardex' : this.kardex,
        'estado_pedido' : this.estado_pedido,
        'cod_pedido' : this.cod_pedido,
        'excluir' : this.excluir,
        'controlestrictoventas' : this.opcionesprivilegios['controlestrictoventas'],
        'pedidopanaderia' : pedidopanaderia,
        'estado_recaudado' : "1",
        'detalles' : detalles,
        'formapago' : this.childformapago.datosformapagoseleccion,
        'pagonotacredito' : [],
        'transaccionbanco' : [],
        'excluir_general' : 0,
        'cod_venta_real' : '',
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      this.facturaventa.totalsinimpuestos = this.childdetalleventa.totalsinimpuestos;
      this.facturaventa.totaldescuento = this.childdetalleventa.totaldescuento;
      this.facturaventa.totalconimpuestos = this.childdetalleventa.totalconimpuestos;
      this.facturaventa.subtotal12 = this.childdetalleventa.subtotal12;
      this.facturaventa.subtotal0 = this.childdetalleventa.subtotal0;
      this.facturaventa.totalconice = this.childdetalleventa.totalconice;
      this.facturaventa.observacion = this.childdetalleventa.observacion;
      //console.log(factura_venta);

      this.ventaservice.guardar(factura_venta).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;

          if (data.estado == true)
          {
            this.facturaventa.numero_factura = data.n_factura;
            this.facturaventa.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
            this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

            this.facturaventa.deudor = 0;
            this.disabledbtnnuevo = false;
            this.disabledbtncambio = true;
            this.disabledbtnguardar = true;
            this.disabledbtnimprimir = false;
            
            this.deshabilitaCampos();
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Pedido registrada correctamente", "INFORMACIÓN DEL SISTEMA");

            this.visualizar(data.cod_abono);
          }
          else
          {
            this.toastr.error("Pedido de Venta no se pudo registrar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      });
  }

  actualizar()
  {
    this.loadingalmacenar = true;

    let detalles = [];
    //console.log(this.childdetalleventa.datosdetalles);
      if(this.facturaventa.estado!="AUTORIZADO")
      {
        this.facturaventa.estado = "CREADA";
      }
      
      this.childdetalleventa.datosdetalles.forEach(item => {
        let detalle = {
          'id_detalle_venta' : item.id_detalle_venta,
          'cod_producto' : item.cod_producto,
          'ice' : item.porcentaje_ice,
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'cantidad_unidad_pedido' : item.cantidad_unidad_pedido,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'precio' : item.precio_base,
          'precio_venta' : item.precio_venta,
          'chkporcentaje' : item.checked,
          'valorporcentaje' : item.descuento,
          'descuento' : item.descuento_calculado,
          'total' : item.total,
          'total_ice' : item.ice,
          'total_iva' : item.iva,
          'total_final' : item.total_final,
          "unidades_denominacion" : item.unidades_denominacion,
          'inventario' : item.inventario,
          'modificable' : item.modificable
        };
        detalles.push(detalle);
      });

      let pedidopanaderia = {};
      if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
      {
        pedidopanaderia = {
          'forma' : this.childpedidopanaderia.selectedItemForma,
          'pastel' : this.childpedidopanaderia.selectedItemsPastel.join(", "),
          'relleno' : this.childpedidopanaderia.selectedItemsRelleno.join(", "),
          'color' : this.childpedidopanaderia.color,
          'texto' : this.childpedidopanaderia.texto,
          'fecha_entrega' : this.childpedidopanaderia.fecha_entrega,
          'descripcion' : this.childpedidopanaderia.descripcion,
          'imagen' : this.childpedidopanaderia.imagen
        }
      }

      let factura_venta = {
        'cod_factura_venta' : this.facturaventa.cod_factura_venta,
        'n_factura_venta' : this.facturaventa.numero_factura,
        'claveacceso' : this.facturaventa.claveacceso,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
        'ruc' : this.rucempresa.ruc,
        "cod_empleado" : this.facturaventa.cod_empleado,
        'tipoambiente' : this.facturaventa.tipoambiente,
        'fecha_hora' : this.facturaventa.fecha_registro,
        'cod_cliente' : this.cliente.cod_cliente,
        'cod_transaccion_tarjeta' :  this.childrecargofactura.recargo.cod_transaccion_tarjeta,
        'subtotalconimpuesto' : this.childdetalleventa.subtotal12,
        'subtotalsinimpuesto' : this.childdetalleventa.subtotal0,
        'totalsinimpuestos' : this.childdetalleventa.totalsinimpuestos,
        'total_descuento' : this.childdetalleventa.totaldescuento,
        'total_iva' : this.childdetalleventa.totalconimpuestos,
        'total_ice' : this.childdetalleventa.totalconice,
        'importetotal' : this.childdetalleventa.importetotal,
        'recibido' : this.facturaventa.recibido,
        'diferencia' : this.facturaventa.diferenciavalor,
    
        'cod_sucursal' : this.cod_sucursal_estable,
        'cod_usuario' : this.facturaventa.cod_usuario,
        'tipo_venta' : this.facturaventa.tipo_venta,
        'deudor' : this.facturaventa.deudor,
        'tipo_credito' : this.facturaventa.tipo_credito,

        'estado' : this.facturaventa.estado,
        'envio' : this.facturaventa.envio,
    
        'porcentaje_tarjeta' : this.childrecargofactura.recargo.tarifa_recargo,
        'observacion' : this.childdetalleventa.observacion,
        'kardex' : this.kardex,
        'detalles' : detalles,
        'detallesactualizar' : this.detallesactualizar,
        'pedidopanaderia' : pedidopanaderia,
        'tipo_venta_anterior' : 0,
        'formapago' : this.childformapago.datosformapagoseleccion,
        'pagonotacredito' : [],
        'transaccionbanco' : [],
        'estado_recaudado' : "1",
        'excluir_general' : 0,
        'estado_recaudado_anterior' : "1",
        'fecha_registro_anterior' : this.fecha_registro_anterior,
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      //console.log(factura_venta);

      
      

      this.ventaservice.actualizar(factura_venta).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;
          

          if (data.estado == true)
          {
            this.facturaventa.numero_factura = data.n_factura;
            this.facturaventa.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;
            this.rucempresa.ptoemi = data.ptoemi;

            this.disabledbtnmodificar = false;
            this.disabledbtnactualizar = true;
            this.disabledbtnimprimir = false;
            
            this.deshabilitaCampos();

            
            if(this.facturaventa.deudor==1){
              this.chkcontado = false;      
            }else{
              this.chkcontado = true;
            }
            
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "ACTUALIZADA";

            this.toastr.success("Pedido registrada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.buscarFacturaVenta();
          }
          else
          {
            this.toastr.error("Pedido de Venta no se pudo actualizar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      });
  }

  sendVisualizar(cod_abono) {
    this.visualizar(cod_abono);
  }

  sendMensajeSri(mensaje: any) {
    this.colormensaje = mensaje.colormensaje;
    this.textomensaje = mensaje.textomensaje;
  }

  sendActualizar() {
    if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
    {
      if(this.childpedidopanaderia.selectedImageBase64 == this.childpedidopanaderia.selectedImageBase64anterior)
      {
        this.actualizar();
      }
      else
      {
        if(this.childpedidopanaderia.selectedimagefile == null)
        {
          this.eliminarImagenPedido("actualizar");
        }
        else
        {
          this.subirImagenPedido("actualizar");
        }
      }
    }
    else
    {
      this.actualizar();
    }
  }

  visualizar(cod_abono)
  {
    if(cod_abono==0)
    {
     if(this.facturaventa.tipo_venta=="PEDIDO RESERVADO" || this.facturaventa.tipo_venta=="PEDIDO CON SALIDA" ||this.facturaventa.tipo_venta=="PEDIDO ACUMULATIVO")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedido?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }

     if(this.facturaventa.tipo_venta=="PEDIDO PANADERIA")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedidopanaderia?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }
    }
    else
    {
      if(this.facturaventa.tipo_venta=="PEDIDO RESERVADO" || this.facturaventa.tipo_venta=="PEDIDO CON SALIDA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/cuentaspc/abonoventa?cod_abono_venta=" + cod_abono, "Abono", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }

      if(this.facturaventa.tipo_venta=="PEDIDO PANADERIA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedidopanaderia?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
    }
  }

  verificarRegistro()
  {
    this.loading = true;
    

    this.ventaservice.verificarRegistro().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.formularioNormal();
        this.deshabilitaCampos();
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.facturaventa.cod_factura_venta = data.codigo;
        this.facturaventa.numero_factura = data.n_comprobante;
        this.facturaventa.claveacceso = data.claveacceso;
        this.facturaventa.fecha_registro = moment(data.fecha).format('YYYY-MM-DD');
        let numeracionautomatica = parseInt(this.numeracion_automatica);
        if(numeracionautomatica==0)
        {
          this.facturaventa.numero_factura = "";
        }

        if(this.opcionesprivilegios['controlestrictoventas']==1)
        {
          this.registrarControlVenta();
        }
        
        this.txtcodigobarra.nativeElement.focus();
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  registrarControlVenta() {

    this.loading = true;

    const parametros = {
      'cod_factura_venta' : this.facturaventa.cod_factura_venta,
      'cod_sucursal' : this.cod_sucursal_estable
    };

    this.ventaservice.registrarControlVenta(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });
  }

  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  recibirDatosProducto(datosrecibidosproducto: any)
  {
    try
    {
      let ultimoindice = this.childdetalleventa.datosdetalles.length - 1;
      if(this.childdetalleventa.datosdetalles[ultimoindice].cod_producto == datosrecibidosproducto.cod_producto)
      {
        //console.log(this.childdetalleventa.datosdetalles[ultimoindice].saltar);
        if(this.childdetalleventa.datosdetalles[ultimoindice].saltar==0)//Sin salto de línea
        {
          let cantidadactual = parseFloat(this.childdetalleventa.datosdetalles[ultimoindice].cantidad_comprar) + 1;
          this.childdetalleventa.datosdetalles[ultimoindice].cantidad_comprar = cantidadactual;
          this.childdetalleventa.keySumar(ultimoindice);
        }
        else//Con salto de línea
        {
          this.childdetalleventa.enfocar = true;
          this.childdetalleventa.datosdetalles.push(datosrecibidosproducto);
          this.childdetalleventa.actualizarValores();
        }
      }
      else
      {
        this.childdetalleventa.enfocar = true;
        this.childdetalleventa.datosdetalles.push(datosrecibidosproducto);
        this.childdetalleventa.actualizarValores();
      }
    } catch (error) {
      this.childdetalleventa.enfocar = true;
      this.childdetalleventa.datosdetalles.push(datosrecibidosproducto);
      this.childdetalleventa.actualizarValores();
    }

  }

  actualizarListadoProducto()
  {
    this.childlistadoproductoventas.page = 1;
    this.childlistadoproductoventas.filterpost="";
    this.loading = true;
    this.datosproducto = [];
    this.datostarifasproducto = [];
    const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
    result.then(() => {      
      this.datosproducto = this.childlistadoproductoventas.datosproducto;
      this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
      this.loading = false;
      this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
    }).catch(() => {
      this.loading = false;
      this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
    });
  }

  buscarCodigoProducto()
  {
    let comodin = this.codigo_barra.substr(-1);
    if(comodin=="*")
    {
      this.childlistadoproductoventas.page = 1;
      this.childlistadoproductoventas.filterpost= this.codigo_barra.slice(0, -1);
      $("#mymodallistarproductos").modal("show");
      setTimeout(()=>{
        this.childlistadoproductoventas.txtfilterpost.nativeElement.focus();
      },500);
    }
    else
    {
      if(this.codigo_barra.length>0)
      {
        this.childlistadoproductoventas.buscarcodigoproductoventas(this.codigo_barra);
      }
    }
    this.codigo_barra = "";
  }

  clickListarProductos()
  {
    this.childlistadoproductoventas.page = 1;
    this.childlistadoproductoventas.filterpost="";
    $("#mymodallistarproductos").modal("show");
    setTimeout(()=>{
      this.childlistadoproductoventas.txtfilterpost.nativeElement.focus();
    },500);
  }
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/

  calcularRecibido()
  {
    if(parseFloat(this.facturaventa.recibido)>=this.facturaventa.importetotal)
    {
        this.facturaventa.diferenciavalor = redondeardecimales((parseFloat(this.facturaventa.recibido) - this.facturaventa.importetotal), 2);
        this.facturaventa.diferencia = "Cambio: " + this.facturaventa.diferenciavalor;
       
        Swal.fire({
          title: this.facturaventa.diferencia,
          text: "Recibido: " + this.facturaventa.recibido,
          confirmButtonText: 'OK'
        }).then( (result) => {
          if (result.value) {
            this.clickVerificar();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
           
          }
        });
    }
    else
    {
        this.toastr.warning("La cantidad recibida debe ser Mayor o Igual a la del Importe Total", "INFORMACIÓN DEL SISTEMA");
    }
  }

  recibirDatosDetalles(importetotal: number)
  {
    this.facturaventa.importetotal = importetotal;
    this.childformapago.agregarValorImporteFormaPago(importetotal);
    this.txtcodigobarra.nativeElement.focus();
  }

  clickNuevoCliente()
  {
    this.clienteformcomponent.nombreformulario="AGREGAR";
    this.clienteformcomponent.formularioNormal();
    $("#mymodalformcliente").modal("show");
  }

  clickListarCliente()
  {
    this.childlistadocliente.page = 1;
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  recibirDatosCliente(datosrecibidoscliente: any)
  {
    this.cliente.cod_identificacion = datosrecibidoscliente.cod_identificacion;
    this.cliente.identificacion = datosrecibidoscliente.identificacion;
    this.cliente.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.cliente.numero_identificacion = datosrecibidoscliente.cedula;
    this.cliente.celular = datosrecibidoscliente.celular;
    this.cliente.telefono = datosrecibidoscliente.telefono;
    this.cliente.correo = datosrecibidoscliente.correo;
    this.cliente.direccion = datosrecibidoscliente.direccion;

    

    if(this.afiliacion_cliente=="1")
    {
      this.cantidad_compras = 0;
      this.flagbotonafiliar = false;
      this.flagtextoafiliar = false;

      if(this.cliente.cod_cliente!="1")
      {
        if(datosrecibidoscliente.cod_tipo_cliente==1)
        {
          this.flagbotonafiliar = true;
          this.buscarCompras();
        }
        else
        {
          this.flagtextoafiliar = true;
        }
      }
    }  
      
    $("#mymodallistarclientes").modal("hide");
  }

  buscarCompras()
  {
    this.loading = true;
    this.clienteservice.buscarCompras(this.cliente.cod_cliente).subscribe( (data : any) =>
    {
      this.cantidad_compras = data.cantidad_compras;
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  afiliarCliente()
  {
    this.loading = true;
    const parametros = {
      'cod_cliente' : this.cliente.cod_cliente
    };
    this.clienteservice.afiliarCliente(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.estado == true)
      {
        this.cantidad_compras = 0;
        this.flagbotonafiliar = false;
        this.flagtextoafiliar = false;
        this.flagtextoafiliar = true;
        this.toastr.success("Cliente afiliado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Cliente no se pudo afiliar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });

  }

  recibirDatosNuevoCliente(datosrecibidoscliente: any)
  {
    this.cliente.cod_identificacion = datosrecibidoscliente.cod_identificacion;
    this.cliente.identificacion = datosrecibidoscliente.identificacion;
    this.cliente.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.cliente.numero_identificacion = datosrecibidoscliente.cedula;
    this.cliente.celular = datosrecibidoscliente.celular;
    this.cliente.telefono = datosrecibidoscliente.telefono;
    this.cliente.correo = datosrecibidoscliente.correo;
    this.cliente.direccion = datosrecibidoscliente.direccion;
    $("#mymodalformcliente").modal("hide");
  }

  formularioNormal()
  {
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.disabledbtnnuevo = false;
      this.disabledbtncambio = true;
      this.disabledbtnguardar = true;
      this.disabledbtnimprimir = true;

      this.facturaventa.cod_factura_venta = "";
      this.facturaventa.numero_factura = "";
      this.facturaventa.claveacceso = "0";

      this.colormensaje = "";
      this.textomensaje = "";

      this.cliente.cod_identificacion = "07";
      this.cliente.identificacion = "VENTA A CONSUMIDOR FINAL*";
      this.cliente.cod_cliente = "1";
      this.cliente.cliente = "CONSUMIDOR FINAL";
      this.cliente.numero_identificacion = "9999999999999";
      this.cliente.celular = "0000000000";
      this.cliente.telefono = "000-000";
      this.cliente.correo = "N";
      this.cliente.direccion = "N";

      this.facturaventa.cod_empleado = "0";


      this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0;
      this.childrecargofactura.recargo.tarifa_recargo = "0";

      this.loading = false;

      this.facturaventa.recibidoabono = "0";
      this.facturaventa.id_forma_pago_abono = "01";

      this.flagNormal();

      this.childdetalleventa.datosdetalles = [];
      this.childdetalleventa.formularioNormal();
      this.childformapago.formularioNormal();
      this.facturaventa.importetotal = 0;

      this.arr_factura_venta = {};

      this.facturaventa.tipo_venta = this.defecto_venta;

      this.cantidad_compras = 0;
      this.flagbotonafiliar = false;
      this.flagtextoafiliar = false;


      this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0;
      this.disabledcmbrecargo = true;
      this.disabledchkcontado = true;
      this.facturaventa.pedido = 1;
      this.chkcontado = false;
      this.facturaventa.deudor=1;
      this.facturaventa.tipo_credito=1;
      this.facturaventa.diferencia="";
      this.facturaventa.diferenciavalor="";
      this.facturaventa.recibido="";
      this.facturaventa.recibidoabono="0";
      this.childdetalleventa.observacion = "";
      this.disabledbtncalcular = true;
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.facturaventa.cod_factura_venta = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;

        this.disabledbtnmodificar = false;
        this.disabledbtnactualizar = true;
        this.disabledbtnimprimir = true;

        this.facturaventa.diferencia = "";
        this.facturaventa.recibido = "";

        this.buscarFacturaVenta();
      }
    }

  }

  deshabilitaCampos()
  {
    this.chkimpuesto = true;
    this.childlistadoproductoventas.chkimpuesto = true;
    this.disabledchkimpuesto = true;
    this.disabledtxtcodigobarra = true;
    this.disabledbtnlistarproducto = true;
    
    this.childdetalleventa.disabledtabladetalles = true;
    
    this.disabledbtnlistarcliente = true;
    this.disabledbtnagregarcliente = true;

    this.disabledcmbtipoventa = true;
    this.disabledtxtnfactura = true;
    this.disabledtxtfecha = true;
    this.disabledcmbrecargo = true;
    this.disabledformapago = true;
    this.chkcontado = true;
    this.disabledchkcontado = true;
    this.disabledbtncalcular = true;

    this.disabledcmbempleado = true;
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagformapago = false;

    /*
    if(this.formapago.forma_pago=="0")
    {
      this.flagformapago=true;
      valor=true;
    }
    */

    return valor;
  }

  flagNormal()
  {
    this.flagformapago = false;
  }

  habilitarFormulario()
  {
    this.disabledbtnnuevo = true;
    this.disabledbtncambio = false;
    this.disabledbtnguardar = false;
    this.disabledbtnmodificar = true;
    this.disabledbtnactualizar = false;

    this.disabledchkimpuesto = false;
    this.disabledtxtcodigobarra = false;
    this.disabledbtnlistarproducto = false;

    this.disabledbtnlistarcliente = false;
    this.disabledbtnagregarcliente = false;


    if(this.tipo_formulario == "nuevoregistro")
    {
      this.disabledcmbtipoventa = false;
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.disabledcmbtipoventa = true;
      }

    }

    this.disabledtxtnfactura = false;
    if(this.opcionesprivilegios["bloqueofechaventas"]==1)
    {
      this.disabledtxtfecha = true;
    }
    else
    {
      this.disabledtxtfecha = false;
    }
    this.disabledcmbrecargo = false;
    this.disabledformapago = false;

    this.disabledchkcontado = true;
    this.disabledbtncalcular = false;

    this.disabledcmbempleado = false;

    this.childdetalleventa.disabledtabladetalles = false;

    this.childdetalleventa.habilitarFormulario();
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.deshabilitaCampos();
  }

  listarSucursales()
  {    
    this.loading = true;
    

    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.datosrucempresa = data;
      this.loading = false;

      this.listarEmpleados();

      this.childlistadocliente.listarClientes();
 

      this.buscarRuc();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarEmpleados()
  {    
    this.loading = true;
    

    this.empleadoservice.listar().subscribe( (data : any) =>
    {
      this.datosempleados = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  clickAbonar()
  {
    this.childregistroabonoventa.formularioNormal();
    $("#mymodalregistroabono").modal("show");
  }

  sendAceptar(resultado: any) {
    this.facturaventa.recibidoabono = resultado.recibidoabono;
    this.facturaventa.id_forma_pago_abono = resultado.id_forma_pago_abono;
    $("#mymodalregistroabono").modal("hide");
  }

  async buscarFacturaVenta()
  {
    try
    {
    this.loading = true;
    
    await this.buscarFormasPagoVenta();

    let data: any = await lastValueFrom(this.ventaservice.buscarFactura(this.facturaventa.cod_factura_venta));
    
      //console.log(data);
      this.facturaventa.estado = data[0].estado;
      this.facturaventa.envio = data[0].envio;
      this.rucempresa.cod_ruc = data[0].cod_ruc;
      this.rucempresa.empresa = data[0].empresa;
      
      
      this.facturaventa.tipo_venta = data[0].tipo_venta;
      this.defecto_venta = data[0].tipo_venta;
      

      if(this.facturaventa.tipo_venta == "PEDIDO PANADERIA")
      {
        this.childpedidopanaderia.formularioNormal("modificar", this.facturaventa.cod_factura_venta);
      }

      this.facturaventa.cod_usuario = data[0].cod_usuario;

      this.facturaventa.numero_factura = this.padLeft(data[0].numero_factura, 9);
      this.facturaventa.claveacceso = data[0].claveacceso;
      this.rucempresa.serieestab = data[0].serieestab;
      this.rucempresa.ptoemi = data[0].ptoemi;
      this.rucempresa.ruc = data[0].ruc_sucursal;
      this.rucempresa.tipoambiente = data[0].tipo_ambiente;

      this.rucempresa.razon_social = data[0].razonsocial;
      this.rucempresa.nombre_comercial = data[0].nombrecomercial;
      this.rucempresa.direccion_matriz = data[0].direccion_matriz;
      this.rucempresa.direccion_establecimiento = data[0].direccion_establecimiento;
      this.rucempresa.tipo_contribuyente = data[0].tipo_contribuyente;
      this.rucempresa.contribuyente = data[0].contribuyente;
      this.rucempresa.contabilidad = data[0].contabilidad;
      this.rucempresa.leyenda = data[0].leyenda;
      
      this.rucempresa.firmap12 = data[0].firmap12;
      this.rucempresa.clavep12 = data[0].clavep12;
      this.rucempresa.pk12 = data[0].pk12;
      this.rucempresa.firmapublica = data[0].firmapublica;
      this.rucempresa.firmaprivada = data[0].firmaprivada;
      this.rucempresa.certificado = data[0].certificado;

      this.rucempresa.tipo_ruc = data[0].tipo_ruc;
  
      this.colormensaje = "";
      this.textomensaje = "";
  
      this.cliente.cod_identificacion = data[0].cod_identificacion;
      this.cliente.identificacion = data[0].identificacion;
      this.cliente.cod_cliente = data[0].cod_cliente;
      this.cliente.cliente = data[0].cliente;
      this.cliente.numero_identificacion = data[0].cedula;
      this.cliente.celular = data[0].celular;
      this.cliente.telefono = data[0].convencional;
      this.cliente.correo = data[0].correo;
      this.cliente.direccion = data[0].direccion;
  
      this.facturaventa.cod_empleado = data[0].cod_empleado;
  
      this.fecha_registro_anterior = data[0].fecha_registro;

      this.childrecargofactura.recargo.cod_transaccion_tarjeta = data[0].cod_transaccion_tarjeta;
      this.childrecargofactura.recargo.tarifa_recargo = data[0].porcentaje_tarjeta;

      
      this.rucempresa.facturaversion = data[0].facturaversion;
      this.facturaventa.iva = data[0].iva_general;
      
  
      this.facturaventa.diferencia = "";
      this.facturaventa.recibido = "";

      this.facturaventa.tipo_credito= data[0].tipo_credito;

      this.facturaventa.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD');
      
      this.childdetalleventa.datosdetalles = [];
      
      data.forEach(element => {
        let descripcion = element.detalle;

        let bpv1=0;
        let bpv2=0;
        let bpv3=0;
        let bpv4=0;
        let bpv5=0;
        let bpv6=0;
        if(this.rucempresa.tipo_ruc=="POPULAR")//SIN IVA EN AUTOMATICO
        {
          bpv1 = element.pv1;
          bpv2 = element.pv2;
          bpv3 = element.pv3;
          bpv4 = element.pv4;
          bpv5 = element.pv5;
          bpv6 = element.pv6;
        }
        else//CON IVA CON IVA EN AUTOMATICO
        {
          bpv1 = element.bpv1;
          bpv2 = element.bpv2;
          bpv3 = element.bpv3;
          bpv4 = element.bpv4;
          bpv5 = element.bpv5;
          bpv6 = element.bpv6;
        }
        
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          inventario : element.inventario,
          ctp : element.ctp,
  
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
          cantidad_unidad_pedido : element.cantidad_unidad,
  
          precio_base : parseFloat(element.precio),
          precio_venta : parseFloat(element.precio_venta),
  
          checked : element.chkporcentaje,
          descuento : element.valorporcentaje,
          descuento_calculado : parseFloat(element.descuento),//Calculado
  
          total : redondeardecimales(element.total, 6),
          iva : redondeardecimales(element.total_iva, 2),
          ice : redondeardecimales(element.total_ice, 2),

          codigo_iva : element.codigo_iva,
  
          total_final : redondeardecimales(element.total_final, 2),
          unidades_denominacion : element.unidades_denominacion,
          cantidad_antigua : element.cantidad_unidad,
          modificable : 0,
          id_detalle_venta : element.id_detalle_venta,

          precio_base_original: element.precio_base_original,
          rpv1: element.rpv1,
          bpv1: bpv1,
          pv1: element.pv1,
          apv1: element.apv1,

          rpv2: element.rpv2,
          bpv2: bpv2,
          pv2: element.pv2,
          apv2: element.apv2,

          rpv3: element.rpv3,
          bpv3: bpv3,
          pv3: element.pv3,
          apv3: element.apv3,

          rpv4: element.rpv4,
          bpv4: bpv4,
          pv4: element.pv4,
          apv4: element.apv4,

          rpv5: element.rpv5,
          bpv5: bpv5,
          pv5: element.pv5,
          apv5: element.apv5,

          rpv6: element.rpv6,
          bpv6: bpv6,
          pv6: element.pv6,
          apv6: element.apv6
        }
        this.childdetalleventa.datosdetalles.push(detalle);
      });

      this.detallesactualizar = [];
      this.childdetalleventa.datosdetalles.forEach(item => {
        let detalle = {
          'id_detalle_venta' : item.id_detalle_venta,
          'cod_producto' : item.cod_producto,
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
          'precio_venta' : item.precio_venta,
          'chkporcentaje' : item.checked,
          'valorporcentaje' : item.descuento,
          'descuento' : item.descuento_calculado,
          'total' : item.total,
          'total_ice' : item.ice,
          'total_iva' : item.iva,
          'total_final' : item.total_final,
          "unidades_denominacion" : item.unidades_denominacion,
          'inventario' : item.inventario
        };
        this.detallesactualizar.push(detalle);
      });
      
      this.childdetalleventa.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
      this.childdetalleventa.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
      this.childdetalleventa.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
      this.childdetalleventa.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
      this.childdetalleventa.totalconice = redondeardecimales(data[0].total_ice_general, 2);
      this.childdetalleventa.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
      this.childdetalleventa.importetotal = redondeardecimales(data[0].importetotal, 2);
      this.facturaventa.importetotal = this.childdetalleventa.importetotal;

      this.loading = false;
      
      this.deshabilitaCampos();

      this.facturaventa.deudor = data[0].deudor;
      if(this.facturaventa.deudor==1){
        this.chkcontado = false;      
      }else{
        this.chkcontado = true;
      }
      

      $("#mymodal").modal("show");
    } catch (err) {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  buscarFormasPagoVenta(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ventaservice.buscarFormasPagoVenta(this.facturaventa.cod_factura_venta).subscribe( (data: any) => {
          this.childformapago.datosformapagoseleccion = [];
          this.childformapago.datosformapagoseleccion = data;
          resolve(data);  
        },
        (err) => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          reject(err);
        }
      );
    });
  }

  listarTipoVenta(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ventaservice.listarTipoVenta().subscribe( (data: any) => {
          this.datostipoventa = data;
          resolve(data);  
        },
        (err) => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          reject(err);
        }
      );
    });
  }
  
  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  goBack(){
    this.location.back();
  }

}