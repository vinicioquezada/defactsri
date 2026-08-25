import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../../shared/js/decimales.js';
import { ListadoTarifasComponent } from 'src/app/shared/components/listado-tarifas/listado-tarifas.component';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-listado-producto-emparejar',
  templateUrl: './listado-producto-emparejar.component.html',
  styleUrls: ['./listado-producto-emparejar.component.css']
})
export class ListadoProductoEmparejarComponent implements OnInit {
  tarifas : string = "0";

  @ViewChild(ListadoTarifasComponent) childlistadotarifas: any;
  
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("txtfilterpost") txtfilterpost: ElementRef;

  datosproducto : any = [];
  datostarifasproducto : any = [];
  datostarifasproductopromociones : any = [];
  filterpost = "";

  chkimpuesto : boolean = true;

  metodolistado : Number = 0;//0 => Ingresos y Salidas 1 => Ventas
  cantidad_registros : Number = 0;

  loadinglistado : boolean = false;
  

  tarifasenlista : string = "0";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private productoservice:ProductoService, private usersession: UserSessionService) {}

  ngOnInit(): void {
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.tarifasenlista = this.usersession.getConfiguracion("tarifasenlista");
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  /*******************COMPRAS************************/
  /*******************COMPRAS************************/
  /*******************COMPRAS************************/
  listarProductosComprasPorSucursal(cod_sucursal : string)
  {
    this.metodolistado = 2; //Compras
    this.loadinglistado = true;
    
    this.productoservice.listarProductosComprasPorSucursal(cod_sucursal).subscribe( (data : any) =>
    {
      this.datosproducto = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  agregarcompras(codigo : String)
  {
      const resultado = this.datosproducto.find( (valor : any) => valor.cod_producto === codigo );
      this.calcularcompras(resultado);
      this.monstrarMensaje(resultado.descripcion);
  }

  calcularcompras(resultado)
  {
    //console.log(resultado);
    let porcentaje_iva = parseFloat(resultado.iva_compra);//Solo se cambia aquí
    let porcentaje_ice = parseFloat(resultado.ice);//Solo se cambia aquí
    let total = 1 * parseFloat(resultado.costo_base);//Solo se cambia aquí

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
        emparejar : true,
        cod_producto : resultado.cod_producto,
        inventario : resultado.inventario,

        cod_tarifa : 0,
        cantidad_tarifa : 1,

        porcentaje_ice : porcentaje_ice,
        porcentaje_iva : porcentaje_iva,
        
        precio_base_minimo : 0,
        precio_venta_minimo : 0,

        incremento : 0,//Incremento de porcentaje

        cantidad_comprar : 1,
        tarifa : "NORMAL",
        descripcion : resultado.descripcion,
        cantidad_unidad : 1,

        precio_base : resultado.costo_base,//Solo se cambia aquí
        precio_venta : resultado.costo,

        checked : false,//Ckeked de descuento por porcentaje
        
        descuento : descuento,//Editable
        descuento_calculado : descuento,//Calculado

        total : redondeardecimales(total, 6),
        iva : redondeardecimales(iva, 2),
        ice : redondeardecimales(ice, 2),

        total_final : redondeardecimales(totalfinal, 2),
        unidades_denominacion : resultado.unidades_denominacion,

        cantidad_paquete : 1,
        cantidad_ajuste : 0,
        precio_real : resultado.costo_base,
        precio_venta_real : resultado.costo,
        modificable : 0,
        id_detalle_compra : 0
    }
    
    this.datosenviar.emit(detalle);
  }

  /*******************COMPRAS************************/
  /*******************COMPRAS************************/
  /*******************COMPRAS************************/

  monstrarMensaje(descripcion) {
    this.toastr.success(descripcion, "AGREGADO SATISFACTORIAMENTE",
      {
        "positionClass" : "toast-top-left",
        "timeOut": 1000
      }
    );
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}