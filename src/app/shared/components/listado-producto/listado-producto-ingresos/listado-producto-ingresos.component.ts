import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ListadoExistenciasSucursalComponent } from '../../listado-existencias-sucursal/listado-existencias-sucursal.component';
import { UserSessionService } from '../../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-listado-producto-ingresos',
  templateUrl: './listado-producto-ingresos.component.html',
  styleUrls: ['./listado-producto-ingresos.component.css']
})
export class ListadoProductoIngresosComponent implements OnInit {
  codigosproducto : string = "0";
  multisucursal : string = "0";

  @ViewChild(ListadoExistenciasSucursalComponent) childlistadoexistenciassucursal: any;
  
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("txtfilterpost") txtfilterpost: ElementRef;

  datosproducto : any = [];
  datoscodigosproducto : any = [];

  filterpost = "";

  cantidad_registros : Number = 0;

  loadinglistado : boolean = false;

  descripcion : string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private productoservice:ProductoService, private usersession: UserSessionService) {}

  ngOnInit(): void {
    this.codigosproducto = this.usersession.getConfiguracion("codigosproducto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  /*******************INGRESOS************************/
  /*******************INGRESOS************************/
  /*******************INGRESOS************************/
  listarProductosIngresos(cod_sucursal: string) {
    this.loadinglistado = true;
  
    return new Promise((resolve, reject) => {
      this.productoservice.listarProductosInventarios(cod_sucursal).subscribe(
        (data: any) => {
          this.loadinglistado = false;
          this.datosproducto = data;
          this.cantidad_registros = data.length;
          if(this.codigosproducto=="1")
          {
              const result = this.listarCodigosProductos(cod_sucursal).then();
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
        },
        err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadinglistado = false;
          reject(false);
        }
      );
    });
  }

  agregaringresos(codigo : String)
  {
      const resultado = this.datosproducto.find( (valor : any) => valor.cod_producto === codigo );
      this.calcularingresos(resultado);
      this.monstrarMensaje(resultado.descripcion);
  }

  buscarcodigoproductoingresos(codigo_barra : string)
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

        const resultado = this.datosproducto.find( (valor : any) => valor.codigo === codigo_barra || valor.codigo_adicional === codigo_barra );
        this.calcularingresos(resultado);
      }
      catch(e)
      {
       this.toastr.warning("No se encontr\u00F3 producto con el c\u00F3digo ingresado, revise que este ingresado cantidad en existencias en sucursal", "INFORMACIÓN DEL SISTEMA");
      }
  }

  calcularingresos(resultado)
  {
    let porcentaje_iva = parseFloat(resultado.iva_compra);
    let porcentaje_ice = parseFloat(resultado.ice);

    let detalle = {
        fila_error : false,//Para marcar la fila editada con rojo
        cod_producto : resultado.cod_producto,
        //inventario : resultado.inventario,//No es necesario ya que solo lista los que estan e inventario si
        cantidad_comprar : 1,
        cantidad_paquete : 1,
        cantidad_ajuste : 0,
        descripcion : resultado.descripcion,
        cantidad_unidad : 1,

        porcentaje_ice : porcentaje_ice,
        porcentaje_iva : porcentaje_iva,

        costo_base : resultado.costo_base,//Solo se cambia aquí
        costo : resultado.costo,

        unidades_denominacion : resultado.unidades_denominacion,
        modificable : 0,
        id_detalle_ingreso_mercaderia : 0,
        formula: resultado.formula
    }
    
    this.datosenviar.emit(detalle);
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
  /*******************INGRESOS************************/
  /*******************INGRESOS************************/
  /*******************INGRESOS************************/

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