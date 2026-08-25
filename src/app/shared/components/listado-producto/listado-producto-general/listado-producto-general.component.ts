import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ListadoExistenciasSucursalComponent } from '../../listado-existencias-sucursal/listado-existencias-sucursal.component';
import { UserSessionService } from '../../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-listado-producto-general',
  templateUrl: './listado-producto-general.component.html',
  styleUrls: ['./listado-producto-general.component.css']
})
export class ListadoProductoGeneralComponent implements OnInit {
  tarifas : string = "0";
  cargartarifasconfigurables : string = "0";
  codigosproducto : string = "0";
  multisucursal : string = "0";

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

  metodolistado : Number = 0;//0 => Ingresos y Salidas 1 => Ventas
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
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  /*******************PRODUCTOS************************/
  /*******************PRODUCTOS************************/
  /*******************PRODUCTOS************************/
  //Buscar Producto
   listarProductosPorSucursal(cod_sucursal : string)
  {
    this.loadinglistado = true;
    this.metodolistado = 0;

    return new Promise((resolve, reject) => {
      this.productoservice.listarProductosPorSucursal(cod_sucursal).subscribe( (data : any) =>
      {
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
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
        
        reject(false);
      });
    });
  }

  agregar(codigo : String)
  {
      const resultado = this.datosproducto.find( (valor : any) => valor.cod_producto === codigo );
      this.calcularproducto(resultado, 1, "NA");
      this.monstrarMensaje(resultado.descripcion);
  }

  buscarcodigoproducto(codigo_barra : string)
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
      
      this.datosenviar.emit(resultado);
    }
    catch(e)
    {
      if(this.cargartarifasconfigurables=="1")
      {
        try
        {
          const resultado = this.datostarifasproducto.find( (valor : any) => valor.codigo === codigo_barra );
          this.calcularproducto(resultado, resultado.cantidad_unidad, resultado.tipo_tarifa);
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
  
  calcularproducto(resultado, cantidad_unidad, tarifa)
  {
    let detalle = {
        cod_producto : resultado.cod_producto,
        tarifa : tarifa,
        descripcion : resultado.descripcion,
        precio_base : resultado.precio_base,
        precio_venta : resultado.precio_venta,
        cantidad_unidad : cantidad_unidad,
        existencia : resultado.existencia
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
  /*******************PRODUCTOS************************/
  /*******************PRODUCTOS************************/
  /*******************PRODUCTOS************************/

  verExistenciasSucursales(cod_producto : string, descripcion: string)
  {
    $("#mymodallistadoexistenciassucursales").modal("show");
    this.childlistadoexistenciassucursal.listarExistenciasProductoSucursales(cod_producto, descripcion);
  }

  monstrarMensaje(descripcion) {
    /*
    Swal.fire({
      text: descripcion + " AGREGADO SATISFACTORIAMENTE",
      icon: "success",
      timer: 1000,
      showConfirmButton: false
    });
    */
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