import { Component, OnInit, ViewChild} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CompraService } from '../../services/compra.service';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ListadoProveedorComponent } from 'src/app/shared/components/listado-proveedor/listado-proveedor.component';
import { ProveedorFormComponent } from '../proveedor/proveedor-form/proveedor-form.component';
declare var $:any;
import { DetalleCompraComponent } from 'src/app/shared/components/detalle-compra/detalle-compra.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RegistroAbonoVentaComponent } from 'src/app/shared/components/registro-abono-venta/registro-abono-venta.component';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { FormaPagoComponent } from 'src/app/shared/components/forma-pago/forma-pago.component';
import { ListadoProductoComprasComponent } from 'src/app/shared/components/listado-producto/listado-producto-compras/listado-producto-compras.component';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  tipo_compra : string = "";
  kardex : string = "";
  @ViewChild(ListadoProveedorComponent) childlistadoproveedor: any;
  @ViewChild(ListadoProductoComprasComponent) childlistadoproductocompras!: ListadoProductoComprasComponent;
  @ViewChild(ProveedorFormComponent) childproveedorform: any;
  @ViewChild(DetalleCompraComponent) childdetallecompra: any;
  @ViewChild(RegistroAbonoVentaComponent) childregistroabonoventa: any;
  @ViewChild(FormaPagoComponent) childformapago: any;

  datossucursal : any;

  disabledbtnnuevo : boolean = false;
  disabledbtnmodificar : boolean = false;
  disabledbtnguardar : boolean = true;
  disabledbtnactualizar : boolean = true;
  disabledbtnimprimir : boolean = true;

  disabledbtnlistarproveedor : boolean = true;
  disabledbtnagregarproveedor : boolean = true;

  chkimpuesto : boolean = true;
  disabledchkimpuesto : boolean = true;
  disabledtxtcodigobarra : boolean = true;
  disabledbtnlistarproducto : boolean = true;

  disabledcmbtipocompra : boolean = true;
  disabledtxtnmerocompraproveedor : boolean = true;
  disabledtxtfecha : boolean = true;
  disabledcmbformapago : boolean = true;
  chkcontado : boolean = true;
  disabledchkcontado : boolean = true;
  disabledtxtrecibido : boolean = true;
  disabledbtncalcular : boolean = true;
  
  cod_factura_compra : string = "";
  numero_factura : string = "";
  numerocompraproveedor : string = "0";

  diferenciavalor: string = "";
  recibidoabono: string = "0";
  id_forma_pago_abono : string = "";

  colormensaje : string = "";
  textomensaje : string = "";

  cod_identificacion : string = "";
  identificacion : string = "";
  cod_proveedor : string = "";
  proveedor : string = "";
  numero_identificacion : string = "";
  celular : string = "";
  telefono : string = "";
  correo : string = "";
  direccion : string = "";

  cod_sucursal : string = "";
  cod_sucursal_buscada : string = "";
  sucursal : string = "";

  codigo_barra : string = "";

  fecha_hora : string = "";
  fecha_registro : string = "";

  diferencia : string = "";
  recibido : string = "";

  claveacceso : string = "";

  deudor : number =0;

  flagformapago : boolean = false;

  loading : boolean = false;
  loadingalmacenar : boolean = false;

  importetotal : number = 0.00;

  tipo_formulario: string = "";

  detallesactualizar : any = [];
  inventario : number = 1;
  cod_usuario : string = "";

  codigo_iva : number = 0;

  buscarproveedor: number = 0;

  disabledformapago : boolean = true;
  loadingprincipal : boolean = false;

  constructor(private location: Location, private router : Router, private rutaActiva: ActivatedRoute, private compraservice : CompraService, private toastr : ToastrService, private error : ErrorService, private formapagoservice : FormaPagoService, private sucursalesservice : SucursalesService, private empleadoservice : EmpleadoService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;

    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.codigo_iva = Number(this.usersession.getConfiguracion("codigo_iva"));

    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrogastos")
    {
      this.listarSucursales();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "actualizarregistrogastos")
      {
        this.formularioNormal();
      }
    }

    if(this.tipo_formulario == "nuevoregistro")
    {
      this.inventario = 1;
    }

    if(this.tipo_formulario == "nuevoregistrogastos")
    {
      this.inventario = 0;
    }

    this.bodyStyleService.resetBodyStyles();
  }

   ngAfterViewInit(): void {

  }

  clickNuevo()
  {

    if(this.datossucursal.length>0)
    {
      this.tipo_compra =  "FACTURA";

      this.formularioNormal();
      this.habilitarFormulario();
      this.childdetallecompra.datosdetalles = [];

      if(this.tipo_formulario == "nuevoregistro")
      {
        this.loading = true;
        const result = this.childlistadoproductocompras.listarProductosComprasPorSucursal(this.cod_sucursal).then();
        result.then(() => {
          this.loading = false;
          this.originarCodigo();
        }).catch(() => {
          this.loading = false;
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
      }

      if(this.tipo_formulario == "nuevoregistrogastos")
      {
        this.loading = true;
        const result = this.childlistadoproductocompras.listarProductosComprasGastosPorSucursal(this.cod_sucursal).then();
        result.then(() => {
          this.loading = false;
          this.originarCodigo();
        }).catch(() => {
          this.loading = false;
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
      }
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickModificar()
  {
      this.habilitarFormulario();
      this.childlistadoproveedor.listarProveedores();
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.loading = true;
        const result = this.childlistadoproductocompras.listarProductosComprasPorSucursal(this.cod_sucursal).then();
        result.then(() => {
          this.loading = false;
        }).catch(() => {
          this.loading = false;
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
      }

      if(this.tipo_formulario == "actualizarregistrogastos")
      {
        this.loading = true;
        const result = this.childlistadoproductocompras.listarProductosComprasGastosPorSucursal(this.cod_sucursal).then();
        result.then(() => {
          this.loading = false;
        }).catch(() => {
          this.loading = false;
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
      }
  }

  /*
  changeChkImpuesto()
  {
    if(this.chkimpuesto==true){
      this.chkimpuesto = false;
      this.childlistadoproductocompras.chkimpuesto = false;
    }else{
      this.chkimpuesto = true;
      this.childlistadoproductocompras.chkimpuesto = true;
    }
  }
  */

  changeChkContado()
  {
    if(this.chkcontado==true){
      this.chkcontado = false;
      this.deudor=1;
      this.diferencia="";
      this.diferenciavalor="";
      this.recibido="";
      this.recibidoabono="0";
      this.toastr.warning("Se registrara como cuenta por pagar el documento.", "INFORMACIÓN DEL SISTEMA");
      this.childdetallecompra.observacion = "COMPRA A CREDITO";
      this.disabledbtncalcular = true;
      this.disabledtxtrecibido = true;
      this.childformapago.ubicarFormaPagoDeudor();
    }else{
      this.chkcontado = true;
      this.deudor=0;
      this.diferencia="";
      this.diferenciavalor="";
      this.recibido="";
      this.recibidoabono="0";
      this.disabledbtncalcular = false;
      this.disabledtxtrecibido = false;
    }
  }
  
  clickVerificar()
  {
    if(this.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de compra de factura de proveedor para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.numerocompraproveedor.length!=15)
      {
        this.toastr.warning("El numero de la factura de compra debe tener 15 digitos omitiendo los guiones.", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        if(this.cod_proveedor.length==0)
        {
          this.toastr.warning("seleccione un proveedor para registrar la factura de compra", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          if (this.importetotal == 0)
          {
            this.toastr.warning("El total a cobrar está en 0, no se puede guardar o actualizar comprobantes en valores 0", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            let importesumadoformapago = redondeardecimales(this.childformapago.datosformapagoseleccion.reduce((suma, item) => suma + parseFloat(item.valor), 0), 2);
            if(importesumadoformapago == this.importetotal)
            {
              if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrogastos")
              {
                this.buscarNFacturaCompraProveedor();
              }
              else
              {
                if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "actualizarregistrogastos")
                {
                  this.verificaDetalles();
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
  }

  changeTipoCompra(event: any): void {
    const elemento = event.target.value;
    this.tipo_compra = elemento;
  }

  verificaDetalles()
  {
    let fila_error = false;
    for (let c = 0; c< this.childdetallecompra.datosdetalles.length; c++)
    {
      if(this.childdetallecompra.datosdetalles[c].fila_error == true)
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
      if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrogastos")
      {
        let fila_emparejar = false;
        for (let c = 0; c< this.childdetallecompra.datosdetalles.length; c++)
        {
          if(this.childdetallecompra.datosdetalles[c].cod_producto == "")
          {
            fila_emparejar = true;
            break;
          }
        }
        
        if( fila_emparejar)
        {
          this.toastr.warning("Hay una o más filas de producto no emparejados con los productos del sistema", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          Swal.fire({
            title: 'Guardar Registro de Factura de Compra',
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
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "actualizarregistrogastos")
        {
          Swal.fire({
            title: 'Actualizar Registro de Factura de Compra',
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
    //console.log(this.childdetallecompra.datosdetalles);
      this.childdetallecompra.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'ice' : item.porcentaje_ice,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_empaque' : item.cantidad_paquete,
          'cantidad_ajuste' : item.cantidad_ajuste,
          'cantidad_unidad' : item.cantidad_unidad,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'costo_base' : item.precio_base,
          'costo' : item.precio_venta,
          'costo_base_real' : item.precio_real,
          'costo_real' : item.precio_venta_real,
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

      let factura_compra = {
        'cod_factura_compra' : this.cod_factura_compra,
        'cod_proveedor' : this.cod_proveedor,
        'subtotalconimpuesto' : this.childdetallecompra.subtotal12,
        'subtotalsinimpuesto' : this.childdetallecompra.subtotal0,
        'totalsinimpuestos' : this.childdetallecompra.totalsinimpuestos,
        'total_descuento' : this.childdetallecompra.totaldescuento,
        'total_iva' : this.childdetallecompra.totalconimpuestos,
        'total_ice' : this.childdetallecompra.totalconice,
        'importetotal' : this.childdetallecompra.importetotal,
        'codigo' : this.numerocompraproveedor,
        'fecha_emision' : this.fecha_registro,
        'deudor' : this.deudor,
        'inventario' : this.inventario,//1 Si inventario y 0 Compras Gastos Compras Retención
        'tipo_compra' : this.tipo_compra,
        'cod_sucursal' : this.cod_sucursal,
        'observacion' : this.childdetallecompra.observacion,
        'kardex' : this.kardex,
        'claveacceso' : this.claveacceso,
        'abono' : this.recibidoabono,
        'id_forma_pago_abono' :  this.id_forma_pago_abono,
        'formapago' : this.childformapago.datosformapagoseleccion,
        'detalles' : detalles
      };

      //console.log(factura_compra);
      
      this.loadingalmacenar = true;  

      this.compraservice.guardar(factura_compra).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;

          if (data.estado == true)
          {
            this.disabledbtnnuevo = false;
            this.disabledbtnmodificar = false;
            this.disabledbtnguardar = true;
            this.disabledbtnactualizar = true;
            this.disabledbtnimprimir = false;
            
            this.deshabilitaCampos();
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Factura de Venta registrada correctamente", "INFORMACIÓN DEL SISTEMA");

            this.visualizar();
          }
          else
          {
            this.toastr.error("Compra no se pudo registrar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      });
  }

  actualizar()
  {
    let detalles = [];
    //console.log(this.childdetallecompra.datosdetalles);
      this.childdetallecompra.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          "id_detalle_compra" : item.id_detalle_compra,
          'ice' : item.porcentaje_ice,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_empaque' : item.cantidad_paquete,
          'cantidad_ajuste' : item.cantidad_ajuste,
          'cantidad_unidad' : item.cantidad_unidad,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'costo_base' : item.precio_base,
          'costo' : item.precio_venta,
          'costo_base_real' : item.precio_real,
          'costo_real' : item.precio_venta_real,
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

      let factura_compra = {
        'cod_factura_compra' : this.cod_factura_compra,
        'numero_factura' : this.numero_factura,
        'cod_proveedor' : this.cod_proveedor,
        'subtotalconimpuesto' : this.childdetallecompra.subtotal12,
        'subtotalsinimpuesto' : this.childdetallecompra.subtotal0,
        'totalsinimpuestos' : this.childdetallecompra.totalsinimpuestos,
        'total_descuento' : this.childdetallecompra.totaldescuento,
        'total_iva' : this.childdetallecompra.totalconimpuestos,
        'total_ice' : this.childdetallecompra.totalconice,
        'importetotal' : this.childdetallecompra.importetotal,
        'codigo' : this.numerocompraproveedor,
        'fecha_emision' : this.fecha_registro,
        'deudor' : this.deudor,
        'inventario' : this.inventario,//1 Si inventario y 0 Compras Retención
        'tipo_compra' : this.tipo_compra,
        'cod_sucursal' : this.cod_sucursal_buscada,
        'observacion' : this.childdetallecompra.observacion,
        'kardex' : this.kardex,
        'claveacceso' : this.claveacceso,
        'detalles' : detalles,
        'detallesactualizar' : this.detallesactualizar,
        'formapago' : this.childformapago.datosformapagoseleccion,
      };

      //console.log(factura_compra);
      
      this.loading = true;
      

      this.compraservice.actualizar(factura_compra).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if (data.estado == true)
          {
            this.disabledbtnnuevo = false;
            this.disabledbtnmodificar = false;
            this.disabledbtnguardar = true;
            this.disabledbtnactualizar = true;
            this.disabledbtnimprimir = false;
            
            this.deshabilitaCampos();
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "ACTUALIZADA";

            this.toastr.success("Factura de Compra actualizada correctamente", "INFORMACIÓN DEL SISTEMA");

            this.visualizar();
          }
          else
          {
            this.toastr.error("Factura de Compra no se pudo actualizar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  visualizar()
  {	 
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/compras/facturacompra?codfacturacompra=" + this.cod_factura_compra, "", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
  }

  originarCodigo()
  {
    this.loading = true;
    

    this.compraservice.originarCodigo().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.formularioNormal();
        this.deshabilitaCampos();
        this.toastr.error("Error al originar código, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_factura_compra = data.codigo;
        //console.log(this.cod_factura_compra);
        this.numero_factura = data.n_factura;
        this.fecha_hora = moment(data.fecha).format('YYYY-MM-DD');
        this.fecha_registro = moment(data.fecha).format('YYYY-MM-DD');
      }

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
    this.childdetallecompra.enfocar = true;
    this.childdetallecompra.datosdetalles.push(datosrecibidosproducto);
    this.childdetallecompra.actualizarValores();
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductocompras.page = 1;
    this.childlistadoproductocompras.filterpost="";
    this.loading = true;
    const result = this.childlistadoproductocompras.listarProductosComprasPorSucursal(this.cod_sucursal).then();
      result.then(() => {
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
      this.childlistadoproductocompras.page = 1;
      this.childlistadoproductocompras.filterpost= this.codigo_barra.slice(0, -1);
      $("#mymodallistarproductos").modal("show");
      setTimeout(()=>{
        this.childlistadoproductocompras.txtfilterpost.nativeElement.focus();
      },500);
    }
    else
    {
      this.childlistadoproductocompras.buscarcodigoproductocompras(this.codigo_barra);
    }
    this.codigo_barra = "";
  }

  clickListarProductos()
  {
    this.childlistadoproductocompras.page = 1;
    this.childlistadoproductocompras.filterpost="";
    $("#mymodallistarproductos").modal("show");
  }
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/

  recibirDatosDetalles(importetotal: number)
  {
    this.importetotal = importetotal;
    this.childformapago.agregarValorImporteFormaPago(importetotal);
  }

  clickNuevoProveedor()
  {
    this.childproveedorform.nombreformulario="AGREGAR";

    if(this.buscarproveedor != 2)
    {
      this.childproveedorform.formularioNormal();
      $("#mymodalformproveedor").modal("show");
    }
    else
    {
      this.childproveedorform.formularioNormal();
      $("#mymodalformproveedor").modal("show");
      this.childproveedorform.cod_identificacion = "0";
      this.childproveedorform.identificacion = "0";
      this.childproveedorform.ruc = this.numero_identificacion;
      this.childproveedorform.razon_social = this.proveedor;
      this.childproveedorform.nombre_comercial = "";
      this.childproveedorform.direccion = this.direccion;
      this.childproveedorform.convencional = this.telefono;
      this.childproveedorform.celular = this.celular;
      this.childproveedorform.correo = this.correo;
    }
  }

  clickListarProveedor()
  {
    this.childlistadoproveedor.page = 1;
    this.childlistadoproveedor.filterpost="";
    $("#mymodallistarproveedores").modal("show");
  }
  
  recibirDatosProveedor(datosrecibidosproveedor: any)
  {
      this.cod_identificacion = datosrecibidosproveedor.cod_identificacion;
      this.identificacion = datosrecibidosproveedor.identificacion;
      this.cod_proveedor = datosrecibidosproveedor.cod_proveedor;
      this.proveedor = datosrecibidosproveedor.razon_social + " " + datosrecibidosproveedor.nombre_comercial;
      this.numero_identificacion = datosrecibidosproveedor.ruc;
      this.celular = datosrecibidosproveedor.celular;
      this.telefono = datosrecibidosproveedor.telefono;
      this.correo = datosrecibidosproveedor.correo;
      this.direccion = datosrecibidosproveedor.direccion;
      $("#mymodallistarproveedores").modal("hide");
  }

  recibirDatosNuevoProveedor(datosrecibidosproveedor: any)
  {
    this.cod_identificacion = datosrecibidosproveedor.cod_identificacion;
    this.identificacion = datosrecibidosproveedor.identificacion;
    this.cod_proveedor = datosrecibidosproveedor.cod_proveedor;
    this.proveedor = datosrecibidosproveedor.razon_social + " " + datosrecibidosproveedor.nombre_comercial;
    this.numero_identificacion = datosrecibidosproveedor.ruc;
    this.celular = datosrecibidosproveedor.celular;
    this.telefono = datosrecibidosproveedor.telefono;
    this.correo = datosrecibidosproveedor.correo;
    this.direccion = datosrecibidosproveedor.direccion;
    $("#mymodalformproveedor").modal("hide");
  }

  formularioNormal(): void
  {
    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrogastos")
    {
      this.disabledbtnnuevo = false;
      this.disabledbtnmodificar = false;
      this.disabledbtnguardar = true;
      this.disabledbtnactualizar = true;
      this.disabledbtnimprimir = true;

      this.cod_factura_compra = "";
      this.numero_factura = "";
      this.numerocompraproveedor = "";

      this.colormensaje = "";
      this.textomensaje = "";

      this.cod_identificacion = "";
      this.identificacion = "-----------------";
      this.cod_proveedor = "";
      this.proveedor = "-----------------";
      this.numero_identificacion = "-----------------";
      this.celular = "-----------------";
      this.telefono = "-----------------";
      this.correo = "-----------------";
      this.direccion = "-----------------";

      this.loading = false;

      this.diferencia = "";
      this.diferenciavalor="";
      this.recibido = "";
      this.recibidoabono = "0";
      this.id_forma_pago_abono = "01";

      this.fecha_hora = "";
      this.claveacceso = "";

      this.deudor=0;

      this.flagNormal();

      this.childdetallecompra.datosdetalles = [];
      this.childdetallecompra.formularioNormal();
      this.childformapago.formularioNormal();
      this.importetotal = 0;
      this.buscarproveedor = 0;
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "actualizarregistrogastos")
      {
        this.buscarproveedor = 0;

        this.cod_factura_compra = this.rutaActiva.snapshot.paramMap.get("cod_factura_compra")!;

        this.disabledbtnnuevo = false;
        this.disabledbtnmodificar = false;
        this.disabledbtnguardar = true;
        this.disabledbtnactualizar = true;
        this.disabledbtnimprimir = true;
    
        this.diferencia = "";
        this.recibido = "";

        this.buscarFacturaCompra();
      }
    }
    
  }

  buscarFacturaCompra()
  {
    this.loading = true;
    

    this.compraservice.buscarFactura(this.cod_factura_compra).subscribe( (data : any) =>
    {
      //console.log(data);

      this.cod_sucursal_buscada = data[0].cod_sucursal;
      this.sucursal = data[0].sucursal;
      this.numerocompraproveedor = data[0].codigo;
      this.inventario = data[0].inventario_factura;
      this.tipo_compra = data[0].tipo_compra;
      this.cod_usuario = data[0].cod_usuario;
      this.numero_factura = this.padLeft(data[0].numero_factura, 9);
      this.claveacceso = data[0].claveacceso;
      this.colormensaje = "";
      this.textomensaje = "";
  
      this.cod_identificacion = data[0].cod_identificacion;
      this.identificacion = data[0].identificacion;
      this.cod_proveedor = data[0].cod_proveedor;
      this.proveedor = data[0].proveedor;
      this.numero_identificacion = data[0].cedula;
      this.celular = data[0].celular;
      this.telefono = data[0].convencional;
      this.correo = data[0].correo;
      this.direccion = data[0].direccion;
  
      this.diferencia = "";
      this.recibido = "";
  
      this.deudor = data[0].deudor;

      if(this.deudor==1){
        this.chkcontado = false;        
      }else{
        this.chkcontado = true;
      }

      this.fecha_hora = moment(data[0].fecha_hora).format('YYYY-MM-DD HH:mm:ss');
      this.fecha_registro = moment(data[0].fecha_emision).format('YYYY-MM-DD');
      
      this.childdetallecompra.datosdetalles = [];

      this.childdetallecompra.inventario = data[0].inventario;
      
      this.buscarFormasPagoCompra();

      data.forEach(element => {
        let descripcion = element.detalle;
        
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          inventario : element.inventario,
  
          cod_tarifa : 0,
          cantidad_tarifa : 1,
  
          porcentaje_ice : 0,
          porcentaje_iva : element.iva,
          
          precio_base_minimo : 0,
          precio_venta_minimo : 0,
  
          incremento : 0,//Incremento de porcentaje
  
          cantidad_comprar : element.cantidad_comprar,
          tarifa : element.tarifa,
          descripcion : descripcion,
          descripcionopcional : "",
          cantidad_unidad : element.cantidad_unidad,
  
          precio_base : element.precio,
          precio_venta : element.precio_venta,
  
          checked : element.chkporcentaje,
          descuento : element.valorporcentaje,
          descuento_calculado : parseFloat(element.descuento),
  
          total : redondeardecimales(element.total, 6),
          iva : redondeardecimales(element.total_iva, 2),
          ice : 0,//redondeardecimales(element.total_ice, 2),
  
          total_final : redondeardecimales(element.total_final, 2),
          unidades_denominacion : element.unidades_denominacion,
          
          cantidad_paquete : element.cantidad_empaque,
          cantidad_ajuste : element.cantidad_ajuste,
          precio_real : element.precio_real,
          precio_venta_real : element.precio_venta_real,
          modificable : 0,
          id_detalle_compra : element.id_detalle_compra
        }
        this.childdetallecompra.datosdetalles.push(detalle);
      });

      this.detallesactualizar = [];
      this.childdetallecompra.datosdetalles.forEach(item => {
        let detalle = {
          "id_detalle_compra" : item.id_detalle_compra,
          'cod_producto' : item.cod_producto,
          'ice' : item.porcentaje_ice,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_empaque' : item.cantidad_paquete,
          'cantidad_ajuste' : item.cantidad_ajuste,
          'cantidad_unidad' : item.cantidad_unidad,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'costo_base' : item.precio_base,
          'costo' : item.precio_venta,
          'costo_base_real' : item.precio_real,
          'costo_real' : item.precio_venta_real,
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
      
      this.childdetallecompra.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
      this.childdetallecompra.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
      this.childdetallecompra.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
      this.childdetallecompra.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
      this.childdetallecompra.totalconice = 0;//redondeardecimales(data[0].total_ice_general, 2);
      this.childdetallecompra.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
      this.childdetallecompra.importetotal = redondeardecimales(data[0].importetotal, 2);
      this.childformapago.importetotal = this.importetotal;
      this.importetotal = this.childdetallecompra.importetotal;

      this.childdetallecompra.cod_factura_compra = this.cod_factura_compra;

      this.loading = false;
      
      this.deshabilitaCampos();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  deshabilitaCampos(): void
  {
    this.chkimpuesto = true;
    this.childlistadoproductocompras.chkimpuesto = true;
    this.disabledchkimpuesto = true;
    this.disabledtxtcodigobarra = true;
    this.disabledbtnlistarproducto = true;
    
    this.childdetallecompra.disabledtabladetalles = true;
    
    this.disabledbtnlistarproveedor = true;
    this.disabledbtnagregarproveedor = true;

    this.disabledcmbtipocompra = true;
    this.disabledtxtnmerocompraproveedor = true;
    this.disabledtxtfecha = true;
    this.disabledcmbformapago = true;
    this.chkcontado = true;
    this.disabledchkcontado = true;
    this.disabledtxtrecibido = true;
    this.disabledbtncalcular = true;

    this.disabledformapago = true;
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagformapago = false;

    return valor;
  }

  flagNormal()
  {
    this.flagformapago = false;
  }

  habilitarFormulario(): void
  {
    this.disabledbtnnuevo = true;
    this.disabledbtnmodificar = true;
    this.disabledbtnguardar = false;
    this.disabledbtnactualizar = false;

    this.disabledchkimpuesto = false;
    this.disabledtxtcodigobarra = false;
    this.disabledbtnlistarproducto = false;

    this.disabledbtnlistarproveedor = false;
    this.disabledbtnagregarproveedor = false;

    this.disabledcmbtipocompra = false;
    this.disabledtxtnmerocompraproveedor = false;
    this.disabledtxtfecha = false;
    this.disabledcmbformapago = false;

    this.disabledchkcontado = false;
    this.disabledtxtrecibido = false;
    this.disabledbtncalcular = false;

    this.childdetallecompra.disabledtabladetalles = false;

    this.childdetallecompra.habilitarFormulario();

    this.disabledformapago = false;
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.deshabilitaCampos();
  }

  listarSucursales()
  {    
    this.loading = true;
    

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loading = false;
      this.childlistadoproveedor.listarProveedores();
      this.buscarSucursal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarSucursal()
  {
    const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = resultado.sucursal;
  }

  buscarNFacturaCompraProveedor()
  {
    this.loading = true;
    

    this.compraservice.buscarNFacturaCompraProveedor(this.cod_proveedor, this.numerocompraproveedor).subscribe( (data : any) =>
    {
      if(data.cod_factura_compra==false)
      {
        this.verificaDetalles();
      }
      else
      {
        this.toastr.error("La Factura del Proveedor ya esta registrada, verifique bien el numero por favor.", "INFORMACIÓN DEL SISTEMA");
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarCompraPorClaveAcceso()
  {
    this.childdetallecompra.listarProductosComprasPorSucursal(this.cod_sucursal);
    //console.log(this.childdetallecompra.datosdetalles);

      let parametros = {
          'claveacceso' : this.claveacceso
        };
      
      this.loading = true;
      this.compraservice.verificarComprobanteCompraSri(parametros).subscribe( (data : any) =>
      {
          this.loading = false;
          if (data.estado == true)
          {
            if(data.estadomensaje=="AUTORIZADO")
            {
              this.toastr.success("Comprobante de Proveedor está Autorizado", "INFORMACIÓN DEL SISTEMA");
              this.cod_identificacion = "04";
              this.identificacion = "RUC";
              this.cod_proveedor = "";
              this.proveedor = data.comprobante.infoTributaria.razonSocial;
              this.numero_identificacion = data.comprobante.infoTributaria.ruc;
              this.celular = "0";
              this.telefono = "0";
              this.correo = "0";
              this.direccion = data.comprobante.infoTributaria.dirMatriz;

              this.childproveedorform.ruc = this.numero_identificacion;
              this.childproveedorform.buscarProveedor();

              this.numerocompraproveedor = data.comprobante.infoTributaria.estab + data.comprobante.infoTributaria.ptoEmi + data.comprobante.infoTributaria.secuencial;
              let formatteddate = moment(data.comprobante.infoFactura.fechaEmision, "DD/MM/YYYY").format("YYYY-MM-DD");
              this.fecha_registro = moment(formatteddate).format('YYYY-MM-DD');

              this.childdetallecompra.busquedaporclave = true;
              this.buscarproveedor = 1;
              try
              {
                data.comprobante.detalles.detalle.forEach(element => {
                  this.llenarDetalles(element);
                });
  
                this.childdetallecompra.actualizarValores();
              }
              catch (error)
              {
                  const element = data.comprobante.detalles.detalle;
                  this.llenarDetalles(element);
                  this.childdetallecompra.actualizarValores();
              }

              this.childformapago.datosformapagoseleccion = [];
              try
              {
                data.comprobante.infoFactura.pagos.pago.forEach(element => {
                  let itemformapago = this.childformapago.datosformapago.find( (valor : any) => valor.id_forma_pago == element.formaPago );
                  let formapago = {
                    id_forma_pago : element.formaPago,
                    forma_pago : itemformapago.forma_pago,
                    valor : element.total,
                    plazo: element.plazo ?? 0, 
                    tiempo: element.unidadTiempo ?? "meses"
                  };
                  this.childformapago.datosformapagoseleccion.push(formapago);
                });
              }
              catch (error)
              {
                const element = data.comprobante.infoFactura.pagos.pago;
                let itemformapago = this.childformapago.datosformapago.find( (valor : any) => valor.id_forma_pago == element.formaPago );
                let formapago = {
                  id_forma_pago : element.formaPago,
                  forma_pago : itemformapago.forma_pago,
                  valor : element.total,
                  plazo: element.plazo ?? 0, 
                    tiempo: element.unidadTiempo ?? "meses"
                };
                this.childformapago.datosformapagoseleccion.push(formapago);
              }

            }
            else
            {
              this.childdetallecompra.busquedaporclave = false;
              this.toastr.error("El Comprobante no está autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
            }
          }
          else
          {
            this.childdetallecompra.busquedaporclave = false;
            this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
          }
          
          
        }, err => {
          this.loading = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      });
  
  }

  llenarDetalles(element: any)
  {
    let emparejar = true;
    let descripcion = "";
    let descripcionopcional = "";
    let cod_producto = "";

    if(this.tipo_formulario == "nuevoregistrogastos")
    {
      cod_producto = "1";
      descripcion = element.descripcion;
      emparejar = false;
    }
    else
    {
      descripcionopcional = element.descripcion;
    }
  
    let codigoporcentaje = element.impuestos.impuesto.codigoPorcentaje;

    let porcentaje_iva = 0;
    let precio_base = parseFloat(element.precioUnitario);
    let precio_venta = parseFloat(element.precioUnitario);
    let total = parseFloat(element.precioTotalSinImpuesto);
    let total_iva = 0;
    let total_final = 0;

    if(codigoporcentaje==0)
    {
      total_final = total;
    }
    
    if(codigoporcentaje==this.codigo_iva)
    {
      if(this.tipo_formulario == "nuevoregistrogastos")
      {
        cod_producto = "2";
      }
      porcentaje_iva = element.impuestos.impuesto.tarifa;
      precio_venta = redondeardecimales(precio_base + ((precio_base * porcentaje_iva) / 100), 2);
      total_iva = parseFloat(element.impuestos.impuesto.valor);

      total_final = total + total_iva;
    }
    
    let detalle = {
      fila_error : false,//Para marcar la fila editada con rojo
      emparejar : emparejar,
      cod_producto : cod_producto,//element.cod_producto,
      inventario : "",//element.inventario,

      cod_tarifa : 0,
      cantidad_tarifa : 1,

      porcentaje_ice : 0,
      porcentaje_iva : porcentaje_iva,
      
      precio_base_minimo : 0,
      precio_venta_minimo : 0,

      incremento : 0,//Incremento de porcentaje

      cantidad_comprar : element.cantidad,
      tarifa : "NORMAL",
      descripcion : descripcion,
      descripcionopcional : descripcionopcional,
      cantidad_unidad : element.cantidad,

      precio_base : precio_base,
      precio_venta : precio_venta,

      checked : false,//Ckeked de descuento por porcentaje
      
      descuento : 0,//Editable
      descuento_calculado : element.descuento,//Calculado

      total : redondeardecimales(total, 6),
      iva : redondeardecimales(total_iva, 2),
      ice : 0,//redondeardecimales(element.total_ice, 2),

      total_final : redondeardecimales(total_final, 2),
      unidades_denominacion : 0,
      
      cantidad_paquete : 1,
      cantidad_ajuste : 0,
      precio_real : element.precioUnitario,
      precio_venta_real : precio_venta,
      modificable : 0,
      id_detalle_compra : element.id_detalle_compra,

      codigoporcentaje : codigoporcentaje,
      codigoprincipal : element.codigoPrincipal
    }
    this.childdetallecompra.datosdetalles.push(detalle);
  }

  recibirDatosProveedorExistente(datosrecibidosproveedor: any)
  {
    if(datosrecibidosproveedor.estado_existente)
    {
      this.cod_identificacion = datosrecibidosproveedor.cod_identificacion;
      this.identificacion = datosrecibidosproveedor.identificacion;
      this.cod_proveedor = datosrecibidosproveedor.cod_proveedor;
      this.proveedor = datosrecibidosproveedor.razon_social + " " + datosrecibidosproveedor.nombre_comercial;
      this.numero_identificacion = datosrecibidosproveedor.ruc;
      this.celular = datosrecibidosproveedor.celular;
      this.telefono = datosrecibidosproveedor.telefono;
      this.correo = datosrecibidosproveedor.correo;
      this.direccion = datosrecibidosproveedor.direccion;
    }
    else
    {
      this.buscarproveedor = 2;
    }
  }

  clickAbonar()
  {
    this.childregistroabonoventa.formularioNormal();
    $("#mymodalregistroabono").modal("show");
  }

  sendAceptar(resultado: any) {
    this.recibidoabono = resultado.recibidoabono;
    this.id_forma_pago_abono = resultado.id_forma_pago_abono;
    $("#mymodalregistroabono").modal("hide");
  }

  clickVerificarEncabezado()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        Swal.fire({
          title: 'Actualizar Registro de Encabezado de Compra de Mercadería',
          text: '¿Estás seguro de actualizar registro?',
          icon: 'info',//'warning'
          showCancelButton: true,
          confirmButtonText: 'Si, Actualizar',
          cancelButtonText: 'No, Cerrar'
        }).then((result) => {
          if (result.value) {
            this.actualizarEncabezado();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
    }
  }

  actualizarEncabezado()
  {
      let factura_compra = {
        'cod_factura_compra' : this.cod_factura_compra,
        'numero_factura' : this.numero_factura,
        'cod_proveedor' : this.cod_proveedor,
        'subtotalconimpuesto' : this.childdetallecompra.subtotal12,
        'subtotalsinimpuesto' : this.childdetallecompra.subtotal0,
        'totalsinimpuestos' : this.childdetallecompra.totalsinimpuestos,
        'total_descuento' : this.childdetallecompra.totaldescuento,
        'total_iva' : this.childdetallecompra.totalconimpuestos,
        'total_ice' : this.childdetallecompra.totalconice,
        'importetotal' : this.childdetallecompra.importetotal,
        'codigo' : this.numerocompraproveedor,
        'fecha_emision' : this.fecha_registro,
        'deudor' : this.deudor,
        'tipo_compra' : this.tipo_compra,
        'cod_sucursal' : this.cod_sucursal_buscada,
        'observacion' : this.childdetallecompra.observacion,
        'claveacceso' : this.claveacceso,
        'formapago' : this.childformapago.datosformapagoseleccion
      };
      
      this.loading = true;
      

      this.compraservice.actualizarEncabezado(factura_compra).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if (data.estado == true)
          {
            this.disabledbtnnuevo = false;
            this.disabledbtnmodificar = false;
            this.disabledbtnguardar = true;
            this.disabledbtnactualizar = true;
            this.disabledbtnimprimir = false;
            
            this.deshabilitaCampos();
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "ACTUALIZADA";

            this.toastr.success("Factura de Compra actualizada correctamente", "INFORMACIÓN DEL SISTEMA");

            this.visualizar();
          }
          else
          {
            this.toastr.error("Factura de Compra no se pudo actualizar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  clickAgregarConIva()
  {
    this.childlistadoproductocompras.buscarcodigoproductocompras("I");
  }

  clickAgregarSinIva()
  {
    this.childlistadoproductocompras.buscarcodigoproductocompras("S");
  }

  buscarFormasPagoCompra() : void
  {
    this.loadingprincipal = true;
    this.compraservice.buscarFormasPagoCompra(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.loadingprincipal = false;
      this.childformapago.datosformapagoseleccion = [];
      this.childformapago.datosformapagoseleccion = data;
    }, err => {
      this.loadingprincipal = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  goBack(){
    this.location.back();
  }
}