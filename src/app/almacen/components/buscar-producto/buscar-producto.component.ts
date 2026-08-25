import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { TarifaService } from '../../services/tarifa.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ProductoService } from '../../services/producto.service';
import { ListadoProductoGeneralComponent } from 'src/app/shared/components/listado-producto/listado-producto-general/listado-producto-general.component';
declare var $:any;
import * as moment from 'moment';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.component.html',
  styleUrls: ['./buscar-producto.component.css']
})
export class BuscarProductoComponent implements OnInit {
  datostarifa : any;

  multisucursal : string = "0";
  datossucursal : any;
  cod_sucursal : string = "";

  codigo_barra : string = "";

  cod_producto : string = "";
  descripcion : string = "";
  precio_base : number = 0;
  precio_venta : number = 0;
  tarifa : string = "";
  existencia : number = 0;

  /*Precio de Mayor*/
  rpv1 : any = 0;
  bpv1 : any = 0;
  upv1 : any = 0;
  pv1 : any = 0;
  apv1 : any = 0;
  /*Precio de Mayor*/

  /*Precio de Docena*/
  rpv2 : any = 0;
  bpv2 : any = 0;
  upv2 : any = 0;
  pv2 : any = 0;
  apv2 : any = 0;
  /*Precio de Docena*/

  /*Precio de Bulto*/
  rpv3 : any = 0;
  bpv3 : any = 0;
  upv3 : any = 0;
  pv3 : any = 0;
  apv3 : any = 0;
  /*Precio de Bulto*/


   /*Precio de Mayor*/
   rpv4 : any = 0;
   bpv4 : any = 0;
   upv4 : any = 0;
   pv4 : any = 0;
   apv4 : any = 0;
   /*Precio de Mayor*/
 
   /*Precio de Docena*/
   rpv5 : any = 0;
   bpv5 : any = 0;
   upv5 : any = 0;
   pv5 : any = 0;
   apv5: any = 0;
   /*Precio de Docena*/
 
   /*Precio de Bulto*/
   rpv6 : any = 0;
   bpv6 : any = 0;
   upv6 : any = 0;
   pv6 : any = 0;
   apv6 : any = 0;
   /*Precio de Bulto*/

  loadinglistado : boolean = false;

  stock_anterior: number = 0;
  stock_actual: number = 0;

  unidades_ingreso: number = 0;
  unidades_compra: number = 0;
  unidades_salida: number = 0;
  unidades_venta: number = 0;
  unidades_movimiento_entrada: number = 0;
  unidades_movimiento_salida: number = 0;
  unidades_devolucion_compra: number = 0;
  unidades_devolucion_venta: number = 0;
  
  existencia_ingreso: number = 0;
  existencia_compra: number = 0;
  existencia_salida: number = 0;
  existencia_venta: number = 0;
  existencia_movimiento_entrada: number = 0;
  existencia_movimiento_salida: number = 0;
  existencia_notacreditoventa: number = 0;
  existencia_notacreditocompra: number = 0;
  existencia_devolucion_compra: number = 0;
  existencia_devolucion_venta: number = 0;
  
  @ViewChild(ListadoProductoGeneralComponent) childlistadoproductogeneral!: ListadoProductoGeneralComponent;

  tarifas : string = "0";
  precios_completos : string = "0";

  selectedImageBase64: string | ArrayBuffer | null = null;

  id_detalle_ingreso_mercaderia: string = "";
  id_detalle_compra: string = "";

  constructor(private toastr : ToastrService, private error : ErrorService, private sucursalesservice : SucursalesService, private tarifaservice:TarifaService, private usersession: UserSessionService, private configService: ConfigService, private swalservice: SwalService, private productoservice:ProductoService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.precios_completos = this.usersession.getConfiguracion("precios_completos");
    this.selectedImageBase64 = this.configService.settings.baseUrl + "/productos/defecto.png";
    this.listarSucursales();
  }

  clickDeshacer()
  {
    this.codigo_barra = "";
    this.cod_producto = "";
    this.descripcion = "";
    this.precio_base = 0;
    this.precio_venta = 0;
    this.tarifa = "";
    this.existencia = 0;

    /*Precio de Mayor*/
    this.rpv1 = 0;
    this.bpv1 = 0;
    this.upv1 = 0;
    this.pv1 = 0;
    this.apv1 = 0;
    /*Precio de Mayor*/

    /*Precio de Docena*/
    this.rpv2 = 0;
    this.bpv2 = 0;
    this.upv2 = 0;
    this.pv2 = 0;
    this.apv2 = 0;
    /*Precio de Docena*/

    /*Precio de Bulto*/
    this.rpv3 = 0;
    this.bpv3 = 0;
    this.upv3 = 0;
    this.pv3 = 0;
    this.apv3 = 0;
    /*Precio de Bulto*/


    /*Precio de Mayor*/
    this.rpv4 = 0;
    this.bpv4 = 0;
    this.upv4 = 0;
    this.pv4 = 0;
    this.apv4 = 0;
    /*Precio de Mayor*/
  
    /*Precio de Docena*/
    this.rpv5 = 0;
    this.bpv5 = 0;
    this.upv5 = 0;
    this.pv5 = 0;
    this.apv5= 0;
    /*Precio de Docena*/
  
    /*Precio de Bulto*/
    this.rpv6 = 0;
    this.bpv6 = 0;
    this.upv6 = 0;
    this.pv6 = 0;
    this.apv6 = 0;
   /*Precio de Bulto*/

    this.stock_anterior = 0;
    this.stock_actual = 0;

    this.unidades_ingreso = 0;
    this.unidades_compra = 0;
    this.unidades_salida = 0;
    this.unidades_venta = 0;
    this.unidades_movimiento_entrada = 0;
    this.unidades_movimiento_salida = 0;
    this.unidades_devolucion_compra = 0;
    this.unidades_devolucion_venta = 0;
    
    this.existencia_ingreso = 0;
    this.existencia_compra = 0;
    this.existencia_salida = 0;
    this.existencia_venta = 0;
    this.existencia_movimiento_entrada = 0;
    this.existencia_movimiento_salida = 0;
    this.existencia_notacreditoventa = 0;
    this.existencia_notacreditocompra = 0;
    this.existencia_devolucion_compra = 0;
    this.existencia_devolucion_venta = 0;

    this.id_detalle_ingreso_mercaderia = "";
    this.id_detalle_compra = "";



    this.datostarifa = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal = elemento;
    this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
  }

  listarSucursales()
  {    
    this.loadinglistado = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
        

      this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  recibirDatosProducto(datosrecibidosproducto: any)
  {
    $("#mymodallistarproductos").modal("hide");
    if(datosrecibidosproducto.tarifa=="NA")
    {
      this.cod_producto = datosrecibidosproducto.cod_producto;
      this.descripcion = datosrecibidosproducto.descripcion;
      this.precio_base = datosrecibidosproducto.precio_base;
      this.precio_venta = datosrecibidosproducto.precio_venta;
      this.tarifa = datosrecibidosproducto.tarifa;
      this.existencia = datosrecibidosproducto.existencia;
      this.listarTarifas();
    }
    else
    {
      this.descripcion = datosrecibidosproducto.descripcion;
      this.precio_base = datosrecibidosproducto.precio_base;
      this.precio_venta = datosrecibidosproducto.precio_venta;
      this.tarifa = datosrecibidosproducto.tarifa;
      this.existencia = datosrecibidosproducto.existencia;

      /*Precio de Mayor*/
      this.rpv1 = datosrecibidosproducto.rpv1;
      this.bpv1 = datosrecibidosproducto.bpv1;
      this.pv1 = datosrecibidosproducto.pv1;
      this.apv1 = parseInt(datosrecibidosproducto.apv1);
      /*Precio de Mayor*/

      /*Precio de Docena*/
      this.rpv2 = datosrecibidosproducto.rpv2;
      this.bpv2 = datosrecibidosproducto.bpv2;
      this.pv2 = datosrecibidosproducto.pv2;
      this.apv2 = parseInt(datosrecibidosproducto.apv2);
      /*Precio de Docena*/

      /*Precio de Bulto*/
      this.rpv3 = datosrecibidosproducto.rpv3;
      this.bpv3 = datosrecibidosproducto.bpv3;
      this.pv3 = datosrecibidosproducto.pv3;
      this.apv3 = parseInt(datosrecibidosproducto.apv3);
      /*Precio de Bulto*/

      /*Precio de Mayor*/
      this.rpv4 = datosrecibidosproducto.rpv4;
      this.bpv4 = datosrecibidosproducto.bpv4;
      this.pv4 = datosrecibidosproducto.pv4;
      this.apv4 = parseInt(datosrecibidosproducto.apv4);
      /*Precio de Mayor*/

      /*Precio de Mayor*/
      this.rpv5 = datosrecibidosproducto.rpv5;
      this.bpv5 = datosrecibidosproducto.bpv5;
      this.pv5 = datosrecibidosproducto.pv5;
      this.apv5 = parseInt(datosrecibidosproducto.apv5);
      /*Precio de Mayor*/

      /*Precio de Mayor*/
      this.rpv6 = datosrecibidosproducto.rpv6;
      this.bpv6 = datosrecibidosproducto.bpv6;
      this.pv6 = datosrecibidosproducto.pv6;
      this.apv6 = parseInt(datosrecibidosproducto.apv6);
      /*Precio de Mayor*/
    }
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    this.loadinglistado = true;
    const result = this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal).then();
    result.then(() => {
      this.loadinglistado = false;   
      this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
    }).catch(() => {
      this.loadinglistado = false;
      this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
    });
  }

  buscarCodigoProducto()
  {
    this.childlistadoproductogeneral.buscarcodigoproducto(this.codigo_barra);
    this.codigo_barra = "";
  }

  clickListarProductos()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    $("#mymodallistarproductos").modal("show");
  }
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/

  listarTarifas()
  {    
    this.loadinglistado = true;
    

    this.tarifaservice.listarTarifas(this.cod_producto).subscribe( (data : any) =>
    {
      this.datostarifa = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  clickBuscarDetalleIngresoPorId()
  {
    if(this.id_detalle_ingreso_mercaderia=="")
    {
      this.swalservice.alertCloseOk({
        title: "Control del Sistema",
        text: "Debe ingresar un identificador del ingreso de mercadería",
        icon: "info"
      });
    }
    else
    {
      this.buscarDetalleIngresoPorId();
    }
  }

  clickBuscarDetalleCompraPorId()
  {
    if(this.id_detalle_compra=="")
    {
      this.swalservice.alertCloseOk({
        title: "Control del Sistema",
        text: "Debe ingresar un identificador de la compra de mercadería",
        icon: "info"
      });
    }
    else
    {
      this.buscarDetalleCompraPorId();
    }
  }

  buscarDetalleIngresoPorId()
  {
    this.swalservice.iniciarLoading("Verificando...");
    
    this.productoservice.buscarDetalleIngresoPorId(this.id_detalle_ingreso_mercaderia, this.cod_producto).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.id_detalle_ingreso_mercaderia == false)//No existe
      {
          this.swalservice.alertCloseOk({
            title: "Control del Sistema",
            text: "El identificador de ingreso de mercadería no corresponde al producto a buscar",
            icon: "info"
          });
      }
      else
      {
          this.stock_anterior = data.stock_anterior;
          this.stock_actual = data.stock_actual;
          this.buscarMovimientosGeneralesProductos(data.fecha_hora);
      }


    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  buscarDetalleCompraPorId()
  {
    this.swalservice.iniciarLoading("Verificando...");
    
    this.productoservice.buscarDetalleCompraPorId(this.id_detalle_compra, this.cod_producto).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.id_detalle_compra == false)//No existe
      {
          this.swalservice.alertCloseOk({
            title: "Control del Sistema",
            text: "El identificador de ingreso de mercadería no corresponde al producto a buscar",
            icon: "info"
          });
      }
      else
      {
          this.stock_anterior = data.stock_anterior;
          this.stock_actual = data.stock_actual;
          this.buscarMovimientosGeneralesProductos(data.fecha_hora);
      }


    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  buscarMovimientosGeneralesProductos(fechadesde: string)
  {
    this.swalservice.iniciarLoading("Verificando...");
    
    this.productoservice.buscarMovimientosGeneralesProductos(fechadesde, this.cod_producto, this.cod_sucursal).subscribe( (data : any) =>
    {
      this.swalservice.close();
      
      this.unidades_ingreso = data.unidades_ingreso;
      this.unidades_compra = data.unidades_compra;
      this.unidades_devolucion_venta = data.unidades_devolucion_venta;
      this.unidades_movimiento_entrada = data.unidades_movimiento_entrada;

      this.unidades_salida = data.unidades_salida;
      this.unidades_venta = data.unidades_venta;
      this.unidades_devolucion_compra = data.unidades_devolucion_compra;
      this.unidades_movimiento_salida = data.unidades_movimiento_salida;

      this.existencia_ingreso = this.stock_actual + this.unidades_ingreso;
      this.existencia_compra = this.existencia_ingreso + this.unidades_compra;
      this.existencia_devolucion_venta = this.existencia_compra + this.unidades_devolucion_venta;
      this.existencia_movimiento_entrada = this.existencia_devolucion_venta + this.unidades_movimiento_entrada;

      this.existencia_salida = this.existencia_movimiento_entrada - this.unidades_salida;
      this.existencia_venta = this.existencia_salida - this.unidades_venta;
      this.existencia_devolucion_compra = this.existencia_venta - this.unidades_devolucion_compra;
      this.existencia_movimiento_salida = this.existencia_devolucion_compra - this.unidades_movimiento_salida;

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }
}