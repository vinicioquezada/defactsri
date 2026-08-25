import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ActivatedRoute } from '@angular/router';
import { IngresoMercaderiaService } from 'src/app/almacen/services/ingreso-mercaderia.service';
import { ErrorService } from '../../services/error.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { KardexService } from 'src/app/kardex/services/kardex.service';
import { UserSessionService } from '../../services/user-session.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-detalle-productos',
  templateUrl: './detalle-productos.component.html',
  styleUrls: ['./detalle-productos.component.css']
})
export class DetalleProductosComponent implements OnInit {
  kardex : string = "";
  @ViewChild("scrolly") scrolly: ElementRef;
  enfocar : boolean = true;
  datosdetalles : any = [];
  tipo_formulario: string = "";
  cod_ingreso_mercaderia: string = "";
  
  constructor(private toastr: ToastrService, private rutaActiva: ActivatedRoute, private ingresomercaderiaservice:IngresoMercaderiaService, private error:ErrorService, private kardexservice: KardexService, private usersession: UserSessionService, private loader: LoaderService) { }

  ngOnInit(): void {
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;
  }

  keyPendiente(index: number): void {
    this.datosdetalles[index].fila_error = true;
  }

  keySumar(index: number): void {
    if(this.datosdetalles[index].cantidad_comprar.length==0 || this.datosdetalles[index].cantidad_paquete.length==0 || this.datosdetalles[index].cantidad_ajuste.length==0)
    {
      this.toastr.error("No puede dejar un valor vacio para calcular", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.datosdetalles[index].fila_error = false;
      this.datosdetalles[index].modificable = 1;
      this.datosdetalles[index].cantidad_unidad = (parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_paquete)) + parseFloat(this.datosdetalles[index].cantidad_ajuste);
    }
  }

  keyCalcularCi(index: number): void {
    this.datosdetalles[index].fila_error = false;
    this.datosdetalles[index].modificable = 1;
    let iva = (parseFloat(this.datosdetalles[index].costo_base) * parseFloat(this.datosdetalles[index].porcentaje_iva)) / 100;
    this.datosdetalles[index].costo = redondeardecimales((parseFloat(this.datosdetalles[index].costo_base) + iva), 2);
}

  keyCalcularCb(index: number): void
  {
    this.datosdetalles[index].fila_error = false;
    this.datosdetalles[index].modificable = 1;
		this.datosdetalles[index].costo_base = parseFloat(this.datosdetalles[index].costo) / ((parseFloat(this.datosdetalles[index].porcentaje_iva) / 100)+1);
  }

  ultimaFila(index : number)
  {
    if(this.enfocar==true)
    {
      if(index==4)
      {
        this.scrolly.nativeElement.style.height = "300px";
      }

      if(this.scrolly.nativeElement.scrollHeight>300)
      {
        this.scrolly.nativeElement.scrollTop=this.scrolly.nativeElement.scrollHeight;
        this.enfocar=false;
      }
      else
      {
      }
    }
    return "";
  }

  borrar(index)
  {
      try
      {
        this.datosdetalles.splice(index, 1);

        if(this.datosdetalles.length==4)
        {
          this.scrolly.nativeElement.removeAttribute("style");
        }
      }
      catch(e)
      {
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }

  clickActualizarCostoKardex(item: any, index: number)
  {
    Swal.fire({
      title: 'Desea actualizar los costos del inventario en todo los movimienos realizados del producto seleccionado',
      text: '¿Estás seguro de actualizae costos?',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Actualizar',
      cancelButtonText: 'No, Cerrar'
    }).then((result) => {
      if (result.value) {
        this.actualizarCostoIngresoMercaderiaKardex(item, index);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  clickActualizarIngresoKardex(item: any, index: number)
  {
    Swal.fire({
      title: 'Desea actualizar stock del inventario del producto seleccionado',
      text: '¿Estás seguro de actualizar el stock del inventario?',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Actualizar',
      cancelButtonText: 'No, Cerrar'
    }).then((result) => {
      if (result.value) {
        this.actualizarStockIngresoMercaderiaKardex(item, index);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  actualizarStockIngresoMercaderiaKardex(item: any, index: number)
  {
    this.loader.iniciarLoader();
    const parametros = {
      'cod_ingreso_mercaderia' : this.cod_ingreso_mercaderia,
      'id_detalle_ingreso_mercaderia' : item.id_detalle_ingreso_mercaderia,
      'cantidad_comprar' : item.cantidad_comprar,
      'cantidad_empaque' : item.cantidad_paquete,
      'cantidad_ajuste' : item.cantidad_ajuste,
      'cantidad_unidad' : item.cantidad_unidad,
      'descripcion' : item.descripcion,
      'formula' : item.formula,
      'index' : index
    };
    this.ingresomercaderiaservice.actualizarStockIngresoMercaderiaKardex(parametros).subscribe( (data : any) =>
    {
      this.loader.cerrarLoader();
      if (data.estado == true)
      {
        this.toastr.success("Registro actualizado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        try
        {
          if(this.datosdetalles.length==4)
          {
            this.scrolly.nativeElement.removeAttribute("style");
          }
        }
        catch(e)
        {
        this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
        }
      }
      else
      {
        this.toastr.error(data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loader.cerrarLoader();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  eliminarIngresoKardex(item: any, index: number)
  {
    this.loader.iniciarLoader();
    const parametros = {
      'id_detalle_ingreso_mercaderia' : item.id_detalle_ingreso_mercaderia
    };

    this.ingresomercaderiaservice.eliminarIngresoKardex(parametros).subscribe( (data : any) =>
    {
      this.loader.cerrarLoader();
      if (data.estado == true)
      {
        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        try
        {
          this.datosdetalles.splice(index, 1);
          if(this.datosdetalles.length==4)
          {
            this.scrolly.nativeElement.removeAttribute("style");
          }
        }
        catch(e)
        {
        this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
        }
      }
      else
      {
        this.toastr.error(data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loader.cerrarLoader();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  clickEliminarIngresosKardex(item: any, index: number)
  {
    Swal.fire({
      title: 'Desea eliminar el ingreso de mercadería del producto seleccionado',
      text: '¿Estás seguro de eliminar ingreso?',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cerrar'
    }).then((result) => {
      if (result.value) {
        this.verificarSalidasKardex(item, index);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  verificarSalidasKardex(item: any, index: number)
  {
    this.loader.iniciarLoader();

    this.kardexservice.verificarSalidasKardex(this.cod_ingreso_mercaderia, "INGRESO", item.id_detalle_ingreso_mercaderia).subscribe( (data : any) =>
    {
      this.loader.cerrarLoader();
      
      if (data.estado == true)
      {
        if(data.diferencias == 0)
        {
          this.eliminarIngresoKardex(item, index);
        }
        else
        {
          this.toastr.error("No es posible anular el ingreso de mercadería de ese producto porque ya existen movimientos de salida, en ese caso debe modificar unicamente el registro de ingreso del producto o ajustar el kardex", "INFORMACIÓN DEL SISTEMA");
        }
      }
      else
      {
        this.toastr.error("No se pudo consultar en el kardex el movimiento, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      
    }, err => {
      this.loader.cerrarLoader();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  actualizarCostoIngresoMercaderiaKardex(item: any, index: number)
  {
    this.loader.iniciarLoader();
    const parametros = {
      'cod_ingreso_mercaderia' : this.cod_ingreso_mercaderia,
      'id_detalle_ingreso_mercaderia' : item.id_detalle_ingreso_mercaderia,
      'costo_base' : item.costo_base,
      'costo' : item.costo
    };
    this.ingresomercaderiaservice.actualizarCostoIngresoMercaderiaKardex(parametros).subscribe( (data : any) =>
    {
      this.loader.cerrarLoader();
      if (data.estado == true)
      {
        this.toastr.success("Registro actualizado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        try
        {
          if(this.datosdetalles.length==4)
          {
            this.scrolly.nativeElement.removeAttribute("style");
          }
        }
        catch(e)
        {
        this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
        }
      }
      else
      {
        this.toastr.error(data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loader.cerrarLoader();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }
}
