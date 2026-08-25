import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from 'src/app/gym/services/plan.service';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from '../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-listado-planes-gym',
  templateUrl: './listado-planes-gym.component.html',
  styleUrls: ['./listado-planes-gym.component.css']
})
export class ListadoPlanesGymComponent implements OnInit {
  tarifas : string = "0";
  
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("txtfilterpost") txtfilterpost: ElementRef;

  datosproducto : any = [];
  datostarifasproducto : any = [];
  filterpost = "";

  chkimpuesto : boolean = true;

  metodolistado : Number = 0;//0 => Ingresos y Salidas 1 => Ventas
  cantidad_registros : Number = 0;

  loadinglistado : boolean = false;
  

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private planservice:PlanService, private productoservice:ProductoService, private usersession: UserSessionService) {}

  ngOnInit(): void {
    this.tarifas = this.usersession.getConfiguracion("tarifas");
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  /*******************VENTAS PLAN************************/
  /*******************VENTAS PLAN************************/
  /*******************VENTAS PLAN************************/

  listarPlanesPorSucursal(cod_sucursal : string, tipo_ruc : string)
  {
    this.metodolistado = 1; //Ventas
    this.loadinglistado = true;
    
  
    return new Promise((resolve, reject) => {
      this.planservice.listarPlanesActivos(cod_sucursal).subscribe( (data : any) =>
      {
        this.datosproducto = data;
        this.cantidad_registros = data.length;
        this.loadinglistado = false;
        if(tipo_ruc=="POPULAR")
        {
          data.forEach(item => {
            item.id_iva = 1;
            item.codigo_iva = 0;
            item.iva = 0;
            item.precio_base = item.precio_venta;
            item.precio_base_minimo = item.precio_venta_minimo;
          });
        }

        const result = this.listarTarifasProductosPorSucursal(cod_sucursal, tipo_ruc).then();
        result.then(() => { 
          resolve(true);
        }).catch(() => {
          reject(false);
        });

      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
        
        reject(false);
      });
    });
  }

  listarPlanesDiariosPorSucursal(cod_sucursal : string, tipo_ruc : string)
  {
    this.metodolistado = 1; //Ventas
    this.loadinglistado = true;
    
  
    return new Promise((resolve, reject) => {
      this.planservice.listarPlanesDiariosActivos(cod_sucursal).subscribe( (data : any) =>
      {
        this.datosproducto = data;
        this.cantidad_registros = data.length;
        this.loadinglistado = false;
        
        if(tipo_ruc=="POPULAR")
        {
          data.forEach(item => {
            item.id_iva = 1;
            item.codigo_iva = 0;
            item.iva = 0;
            item.precio_base = item.precio_venta;
            item.precio_base_minimo = item.precio_venta_minimo;
          });
        }

        const result = this.listarTarifasProductosPorSucursal(cod_sucursal, tipo_ruc).then();
        result.then(() => { 
          resolve(true);
        }).catch(() => {
          reject(false);
        });

      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
        
        reject(false);
      });
    });

  }

  listarTarifasProductosPorSucursal(cod_sucursal : string, tipo_ruc : string)
  {
    this.loadinglistado = true;
    
    return new Promise((resolve, reject) => {
      this.productoservice.listarTarifasProductosPorSucursal(cod_sucursal).subscribe( (data : any) =>
      {
        this.datostarifasproducto = data;
        this.loadinglistado = false;
        
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

       if(resultado.restar_stock_tarifa==1)
       {
            this.datostarifasproducto.find( (valor : any) =>
            {
                  if(valor.cod_producto === resultado.cod_producto)
                  {
                      valor.existencia = parseFloat(valor.existencia) - 1;
                  }
                }
            );
       }

      this.calcularventas(resultado, resultado.determinacion_mensual, "NORMAL");
      this.toastr.success(resultado.descripcion, "AGREGADO SATISFACTORIAMENTE",
        { "positionClass" : "toast-top-left"}
      );
  }

  buscarcodigoproductoventas(codigo_barra : string)
  {
      try
      {
        const resultado = this.datosproducto.find( (valor : any) =>
        {
          if(valor.codigo === codigo_barra)
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

       if(resultado.restar_stock_tarifa==1)
       {
            this.datostarifasproducto.find( (valor : any) =>
            {
                  if(valor.cod_producto === resultado.cod_producto)
                  {
                      valor.existencia = parseFloat(valor.existencia) - 1;
                  }
                }
            );
       }
       
        if(resultado.estado_stock == 1)
        {
          this.calcularventas(resultado, resultado.determinacion_mensual, "NORMAL");
        }
        else
        {
          this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la venta", "INFORMACIÓN DEL SISTEMA");
        }
      }
      catch(e)
      {
        if(this.tarifas=="1")
        {
          try
          {
            const resultado = this.datostarifasproducto.find( (valor : any) =>
            {
              if(valor.codigo === codigo_barra)
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

  buscarCodSubCategoriaProductoVentas(cod_subcategoria : number)
  {
      try
      {
        const resultado = this.datosproducto.find( (valor : any) =>
        {
          if(valor.cod_subcategoria == cod_subcategoria)
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
       
       if(resultado.restar_stock_tarifa==1)
       {
            this.datostarifasproducto.find( (valor : any) =>
            {
                  if(valor.cod_producto === resultado.cod_producto)
                  {
                      valor.existencia = parseFloat(valor.existencia) - 1;
                  }
                }
            );
       }
       
        if(resultado.estado_stock == 1)
        {
          this.calcularventas(resultado, resultado.determinacion_mensual, "NORMAL");
        }
        else
        {
          this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la venta", "INFORMACIÓN DEL SISTEMA");
        }
      }
      catch(e)
      {
        if(this.tarifas=="1")
        {
          try
          {
            const resultado = this.datostarifasproducto.find( (valor : any) =>
            {
              if(valor.cod_subcategoria == cod_subcategoria)
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
    //console.log(resultado);
    let porcentaje_iva = parseFloat(resultado.iva);
    let porcentaje_ice = parseFloat(resultado.ice);
    let total = 1 * parseFloat(resultado.precio_base);

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
    }

    let detalle = {
        fila_error : false,//Para marcar la fila editada con rojo
        cod_producto : resultado.cod_producto,
        inventario : resultado.inventario,
        ctp : 1,

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

        precio_base : resultado.precio_base,
        precio_venta : resultado.precio_venta,

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
        modificable : 0,
        id_detalle_venta : 0,
        cod_subcategoria : resultado.cod_subcategoria,
        lunes : resultado.lunes,
        martes : resultado.martes,
        miercoles : resultado.miercoles,
        jueves : resultado.jueves,
        viernes : resultado.viernes,
        sabado : resultado.sabado,
        domingo : resultado.domingo,
        hora_inicio : resultado.hora_inicio,
        hora_fin : resultado.hora_fin,
        horario_completo : resultado.horario + " (" + resultado.jornada + ")",
        grupal : resultado.grupal,
        cantidad_grupo : resultado.cantidad_grupo,
        compartido : resultado.compartido,
        actividad : resultado.actividad
    }
    
    this.datosenviar.emit(detalle);
  }
  /*******************VENTAS PLAN************************/
  /*******************VENTAS PLAN************************/
  /*******************VENTAS PLAN************************/

  handlePageChange(event: number): void {
    this.page = event;
  }


}