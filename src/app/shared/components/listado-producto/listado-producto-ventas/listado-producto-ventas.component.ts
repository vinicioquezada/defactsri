import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../../shared/js/decimales.js';
import { ListadoTarifasComponent } from '../../listado-tarifas/listado-tarifas.component';
import { ListadoExistenciasSucursalComponent } from '../../listado-existencias-sucursal/listado-existencias-sucursal.component';
import { UserSessionService } from '../../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-listado-producto-ventas',
  templateUrl: './listado-producto-ventas.component.html',
  styleUrls: ['./listado-producto-ventas.component.css']
})
export class ListadoProductoVentasComponent implements OnInit {
  tarifas : string = "0";
  cargartarifasconfigurables : string = "0";
  tarifasenlista : string = "0";
  codigosproducto : string = "0";
  multisucursal : string = "0";

  @ViewChild(ListadoTarifasComponent) childlistadotarifas: any;
  @ViewChild(ListadoExistenciasSucursalComponent) childlistadoexistenciassucursal: any;
  
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("txtfilterpost") txtfilterpost: ElementRef;

  datosproducto : any = [];
  datostarifasproducto : any = [];
  datoscodigosproducto : any = [];
  datostarifasproductopromociones : any = [];
  filterpost = "";

  chkimpuesto : boolean = true;

  cantidad_registros : Number = 0;

  loadinglistado : boolean = false;

  descripcion : string = "";
  rpv1 : string = "0";
  pv1 : string = "0";
  rpv2 : string = "0";
  pv2 : string = "0";
  rpv3 : string = "0";
  pv3 : string = "0";
  rpv4 : string = "0";
  pv4 : string = "0";
  rpv5 : string = "0";
  pv5 : string = "0";
  rpv6 : string = "0";
  pv6 : string = "0";


  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private productoservice:ProductoService, private usersession: UserSessionService) {}

  ngOnInit(): void {
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.cargartarifasconfigurables = this.usersession.getConfiguracion("cargartarifasconfigurables");
    this.codigosproducto = this.usersession.getConfiguracion("codigosproducto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.tarifasenlista = this.usersession.getConfiguracion("tarifasenlista");
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  /*******************VENTAS************************/
  /*******************VENTAS************************/
  /*******************VENTAS************************/
  
  listarProductosPorSucursalSinInventario(cod_sucursal : string, tipo_ruc : string)
  {
    this.loadinglistado = true;
    
    /*LISTADO EN PEDIDOS Y PROFORMAS*/
    /*LISTADO EN PEDIDOS Y PROFORMAS*/
    /*LISTADO EN PEDIDOS Y PROFORMAS*/
    return new Promise((resolve, reject) => {
      this.productoservice.listarProductosVentasPorSucursal(cod_sucursal).subscribe( (data : any) =>
      {
        if(tipo_ruc=="POPULAR")
        {
          data.forEach(item => {
            item.id_iva = 1;
            item.codigo_iva = 0;
            item.iva = 0;
            item.precio_base = item.precio_venta;
            item.precio_base_minimo = item.precio_venta_minimo;
            item.inventario = 0;
            item.bpv1 = item.pv1;
            item.bpv2 = item.pv2;
            item.bpv3 = item.pv3;
            item.bpv4 = item.pv4;
            item.bpv5 = item.pv5;
            item.bpv6 = item.pv6;
          });
        }
        else
        {
          data.forEach(item => item.inventario = 0);
        }

        this.datosproducto = data;
        this.cantidad_registros = data.length;
        this.loadinglistado = false;

        if(this.cargartarifasconfigurables=="1")
        {
          const result = this.listarTarifasProductosPorSucursalSinInventario(cod_sucursal, tipo_ruc).then();
          result.then(() => { 
            resolve(true);
          }).catch(() => {
            reject(false);
          });
        }
        else
        {
          resolve(true);
        }

      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
        
        reject(false);
      });
    });

  }

  listarTarifasProductosPorSucursalSinInventario(cod_sucursal : string, tipo_ruc : string)
  {
    this.loadinglistado = true;
    
    return new Promise((resolve, reject) => {
      this.productoservice.listarTarifasProductosPorSucursal(cod_sucursal).subscribe( (data : any) =>
      {

        if(tipo_ruc=="POPULAR")
        {
          data.forEach(item => {
            item.id_iva = 1;
            //item.codigo_iva = 0;
            item.iva = 0;
            item.precio_base = item.precio_venta;
            item.precio_base_minimo = item.precio_venta_minimo;
            item.inventario = 0;
          });
        }
        else
        {
          data.forEach(item => item.inventario = 0);
        }


        this.datostarifasproducto = data;
        this.loadinglistado = false;
        
        resolve(true);
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
        
        reject(false);
      });
    });
  }
  /*LISTADO EN PEDIDOS Y PROFORMAS*/
  /*LISTADO EN PEDIDOS Y PROFORMAS*/
  /*LISTADO EN PEDIDOS Y PROFORMAS*/
  listarProductosVentasPorSucursal(cod_sucursal: string, tipo_ruc: string) {
    this.loadinglistado = true;
  
    return new Promise((resolve, reject) => {
      this.productoservice.listarProductosVentasPorSucursal(cod_sucursal).subscribe(
        (data: any) => {
          //console.log(tipo_ruc);
          if(tipo_ruc=="POPULAR")
          {
            data.forEach(item => {
              item.id_iva = 1;
              item.codigo_iva = 0;
              item.iva = 0;
              item.precio_base = item.precio_venta;
              item.precio_base_minimo = item.precio_venta_minimo;
              item.bpv1 = item.pv1;
              item.bpv2 = item.pv2;
              item.bpv3 = item.pv3;
              item.bpv4 = item.pv4;
              item.bpv5 = item.pv5;
              item.bpv6 = item.pv6;
            });
          }

          this.datosproducto = data;
          this.cantidad_registros = data.length;
          this.loadinglistado = false;
  
          const promesas: Promise<any>[] = [];
  
          if (this.cargartarifasconfigurables == "1") {
            promesas.push(this.listarTarifasProductosPorSucursal(cod_sucursal));
          }
  
          if (this.codigosproducto == "1") {
            promesas.push(this.listarCodigosProductos(cod_sucursal));
          }
  
          if (promesas.length > 0) {
            Promise.all(promesas)
              .then(() => {
                resolve(true);
              })
              .catch(() => {
                reject(false);
              });
          } else {
            resolve(true); // No hay promesas que ejecutar
          }
        },
        err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadinglistado = false;
          reject(false);
        }
      );
    });
  }

  listarCodigosProductos(cod_sucursal : string)
  {
    this.loadinglistado = true;
    return new Promise((resolve, reject) => {
      this.productoservice.listarCodigosProductos(cod_sucursal).subscribe( (data : any) =>
      {
        this.loadinglistado = false;
        this.datoscodigosproducto = data;
        resolve(true);
      }, err => {
        this.loadinglistado = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        reject(false);
      });
    });
  }

  listarTarifasProductosPorSucursal(cod_sucursal : string)
  {
    this.loadinglistado = true;
    
    return new Promise((resolve, reject) => {
      this.productoservice.listarTarifasProductosPorSucursal(cod_sucursal).subscribe( (data : any) =>
      {
        this.datostarifasproducto = data;
        this.loadinglistado = false;
        
        resolve(true);
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
        
        reject(false);
      });
    });
  }

  agregarventas(codigo : String)
  {
      const resultado = this.datosproducto.find( (valor : any) =>
          {
            if(valor.cod_producto === codigo)
            {
              if(valor.inventario == 1)
              {
                valor.restar_stock_tarifa = 1;
                valor.existencia = parseFloat(valor.existencia) - 1;
                return valor;
              }
              else
              {
                valor.restar_stock_tarifa = 0;
                return valor;
              }
            }
          }
       );

        if(this.cargartarifasconfigurables=="1")
        {
            if(resultado.restar_stock_tarifa==1)
            {
                  this.datostarifasproducto.find( (valor : any) =>
                  {
                        //Forma Tarifa 0 NO APLICA
                        if(valor.cod_producto === resultado.cod_producto && valor.codigo != "" && valor.cod_forma_tarifa == 0)
                        {
                            valor.existencia = parseFloat(valor.existencia) - 1;
                        }
                      }
                  );
            }
        }

      this.calcularventas(resultado, 1, "NORMAL");
      this.monstrarMensaje(resultado.descripcion);
  }

  buscarcodigoproductoventas(codigo_barra : string)
  {
      try
      {
        if (this.codigosproducto == "1") {
        const resultadocodigoproducto = this.datoscodigosproducto.find( (valor : any) =>
          {
            if(valor.codigo_producto === codigo_barra)
            {
                return valor;
            }
          }
          );

          if(resultadocodigoproducto != undefined)
          {
          codigo_barra = resultadocodigoproducto.codigo;
          }
        }

        const resultado = this.datosproducto.find( (valor : any) =>
        {
          if(valor.codigo === codigo_barra || valor.codigo_adicional === codigo_barra)
          {
            if(valor.inventario == 1)
            {
              if(valor.existencia > 0)
              {
                valor.existencia = parseFloat(valor.existencia) - 1;
                valor.restar_stock_tarifa = 1;
                valor.estado_stock = 1;
                return valor;
              }
              else
              {
                valor.restar_stock_tarifa = 0;
                valor.estado_stock = 0;
                return valor;
              }
            }
            else
            {
              valor.restar_stock_tarifa = 0;
              valor.estado_stock = 1;
              return valor;
            }
          }
        }
       );

       if(this.cargartarifasconfigurables=="1")
       {
          if(resultado.restar_stock_tarifa==1)
          {
              this.datostarifasproducto.find( (valor : any) =>
              {
                    //Forma Tarifa 0 NO APLICA 
                    if(valor.cod_producto === resultado.cod_producto && valor.codigo != "" && valor.cod_forma_tarifa == 0)
                    {
                        valor.existencia = parseFloat(valor.existencia) - 1;
                    }
                  }
              );
          }
       }
       
        if(resultado.estado_stock == 1)
        {
          this.calcularventas(resultado, 1, "NORMAL");
        }
        else
        {
          this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la venta", "INFORMACIÓN DEL SISTEMA");
        }
      }
      catch(e)
      {
        if(this.cargartarifasconfigurables=="1")
        {
          try
          {
            const resultado = this.datostarifasproducto.find( (valor : any) =>
            {
              //Forma Tarifa 0 NO APLICA 
              if(valor.codigo === codigo_barra && valor.cod_forma_tarifa == 0)
              {
                if(valor.inventario == 1)
                {
                  if(valor.existencia >= valor.cantidad_unidad)
                  {
                    valor.existencia = parseFloat(valor.existencia) - parseFloat(valor.cantidad_unidad);
                    valor.restar_stock = 1;
                    valor.estado_stock = 1;
                    return valor;
                  }
                  else
                  {
                    valor.restar_stock = 0;
                    valor.estado_stock = 0;
                    return valor;
                  }
                }
                else
                {
                  valor.restar_stock = 0;
                  valor.estado_stock = 1;
                  return valor;
                }
              }
            }
          );
            
          //if(resultado.cantidad_unidad <= resultado.existencia || resultado.inventario == 0)

            if(resultado.restar_stock == 1)
            {
                this.datosproducto.find( (valor : any) =>
                {
                      if(valor.cod_producto === resultado.cod_producto)
                      {
                          valor.existencia = parseFloat(valor.existencia) - parseFloat(resultado.cantidad_unidad);
                      }
                    }
                );
            }

            if(resultado.estado_stock == 1)
            {
              this.calcularventas(resultado, resultado.cantidad_unidad, resultado.tipo_tarifa);
            }
            else
            {
              this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la venta", "INFORMACIÓN DEL SISTEMA");
            }
          }
          catch(e)
          {
            this.toastr.warning("No se encontr\u00F3 producto con el c\u00F3digo ingresado, revise que este ingresado cantidad en existencias en sucursal", "INFORMACIÓN DEL SISTEMA");
          }
        }
        else
        {
          this.toastr.warning("No se encontr\u00F3 producto con el c\u00F3digo ingresado, revise que este ingresado cantidad en existencias en sucursal", "INFORMACIÓN DEL SISTEMA");
        }
      }
  }

  calcularventas(resultado, cantidad_unidad, tarifa)
  {
    let porcentaje_iva = parseFloat(resultado.iva);
    let porcentaje_ice = parseFloat(resultado.ice);
    let total = 1 * parseFloat(resultado.precio_base);
    let precio_venta = resultado.precio_venta;

    let ice = 1 * porcentaje_ice;
          
    let totalfinal = 0;						
    let iva = 0;
    let descuento = 0;

    
    if(this.chkimpuesto)
    {
      if(porcentaje_iva == 0)
      {
        totalfinal = total;
      }
      else
      {
        iva = (total * porcentaje_iva)/100;
        totalfinal = total + iva;
      }
    }
    else
    {
      porcentaje_iva=0;
      totalfinal = total;
      precio_venta = resultado.precio_base;
    }

    let detalle = {
        fila_error : false,
        cod_producto : resultado.cod_producto,
        inventario : resultado.inventario,
        ctp : resultado.ctp,

        cod_tarifa : 0,
        cantidad_tarifa : cantidad_unidad,

        porcentaje_ice : porcentaje_ice,
        porcentaje_iva : porcentaje_iva,
        
        precio_base_minimo : resultado.precio_base_minimo,
        precio_venta_minimo : resultado.precio_venta_minimo,

        incremento : 0,//Incremento de porcentaje

        cantidad_comprar : 1,
        tarifa : tarifa,
        descripcion : resultado.descripcion,
        cantidad_unidad : cantidad_unidad,
        cantidad_unidad_pedido : cantidad_unidad,

        precio_base : resultado.precio_base,
        precio_base_original : resultado.precio_base,//Se utiliza para Tarifa
        precio_venta : precio_venta,//resultado.precio_venta,

        checked : false,//Ckeked de descuento por porcentaje
        
        descuento : descuento,//Editable
        descuento_calculado : descuento,//Calculado

        total : redondeardecimales(total, 6),
        iva : redondeardecimales(iva, 2),
        ice : redondeardecimales(ice, 2),

        codigo_iva : resultado.codigo_iva,

        total_final : redondeardecimales(totalfinal, 2),
        unidades_denominacion : resultado.unidades_denominacion,
        cantidad_antigua : cantidad_unidad,
        saltar : 0,
        modificable : 0,
        id_detalle_venta : 0,

        rpv1: resultado.rpv1,
        bpv1: resultado.bpv1,
        pv1: resultado.pv1,
        apv1: resultado.apv1,

        rpv2: resultado.rpv2,
        bpv2: resultado.bpv2,
        pv2: resultado.pv2,
        apv2: resultado.apv2,

        rpv3: resultado.rpv3,
        bpv3: resultado.bpv3,
        pv3: resultado.pv3,
        apv3: resultado.apv3,

        rpv4: resultado.rpv4,
        bpv4: resultado.bpv4,
        pv4: resultado.pv4,
        apv4: resultado.apv4,

        rpv5: resultado.rpv5,
        bpv5: resultado.bpv5,
        pv5: resultado.pv5,
        apv5: resultado.apv5,

        rpv6: resultado.rpv6,
        bpv6: resultado.bpv6,
        pv6: resultado.pv6,
        apv6: resultado.apv6,

        iva_original: parseFloat(resultado.iva_original)
    }
    //console.log(detalle);
    this.datosenviar.emit(detalle);
  }
  /*******************VENTAS************************/
  /*******************VENTAS************************/
  /*******************VENTAS************************/


  verTarifas(cod_producto : string, descripcion: string)
  {
    if(this.tarifasenlista=="1")
    {
      $("#mymodallistadotarifa").modal("show");
      this.childlistadotarifas.listarTarifas(cod_producto, descripcion);
    }
  }

  verTarifasNormal(item: any)
  {
    this.descripcion = item.descripcion;
    this.rpv1 = item.rpv1;
    this.pv1 = item.pv1;
    this.rpv2 = item.rpv2;
    this.pv2 = item.pv2;
    this.rpv3 = item.rpv3;
    this.pv3 = item.pv3;
    this.rpv4 = item.rpv4;
    this.pv4 = item.pv4;
    this.rpv5 = item.rpv5;
    this.pv5 = item.pv5;
    this.rpv6 = item.rpv6;
    this.pv6 = item.pv6;
    $("#mymodallistadotarifanormal").modal("show");
  }

  verExistenciasSucursales(cod_producto : string, descripcion: string)
  {
    $("#mymodallistadoexistenciassucursales").modal("show");
    this.childlistadoexistenciassucursal.listarExistenciasProductoSucursales(cod_producto, descripcion);
  }

  monstrarMensaje(descripcion) {

    this.toastr.success(descripcion, "AGREGADO SATISFACTORIAMENTE",
      {
        "positionClass" : "toast-top-left",
        "timeOut": 1000
      }
    );
  }

  cerrarModal() {
    $("#mymodallistadotarifanormal").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}