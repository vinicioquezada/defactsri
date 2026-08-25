import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../../shared/js/decimales.js';

@Component({
  selector: 'app-datos-ventas',
  templateUrl: './datos-ventas.component.html',
  styleUrls: ['./datos-ventas.component.css']
})
export class DatosVentasComponent implements OnInit {
  datosdetalles : any = [];
  loading : boolean = false;

  total_retenido : number = 0.00;

  disabledbtn : boolean = true;

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
      /*
      this.datosdetalles[index].total = total.toFixed(6);
      this.datosdetalles[index].iva = redondeardecimales(variva, 2);
      this.datosdetalles[index].precio_base = varprecio.toFixed(6);
      this.datosdetalles[index].precio_venta = varprecioventa.toFixed(2);
      this.datosdetalles[index].descuento = 0;
      this.datosdetalles[index].descuento_calculado = 0;
    */
  }

  borrar(index)
  {
      try
      {
        this.datosdetalles.splice(index, 1);
        this.actualizarValores();
      }
      catch(e)
      {
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }

  actualizarValores()
  {
	  let totalretenido = 0.00;
    
    this.datosdetalles.forEach(
        element => {
            totalretenido = totalretenido + parseFloat(element.valor_retenido);
        }
    );
    
    this.total_retenido = redondeardecimales(totalretenido, 6);
  }

  formularioNormal()
  {
    this.datosdetalles = [];
    this.total_retenido = 0;
    this.disabledbtn = true;
  }

  habilitarFormulario()
  {
    this.disabledbtn = false;
  }

  deshabilitarFormulario()
  {
    this.disabledbtn = true;
  }

  agregarDetalle(detalleretencion: any)
  {
    //console.log(detalleretencion);
    const resultado = this.datosdetalles.some(element => element.cod_codigo_retencion == detalleretencion.cod_codigo_retencion);
    //console.log(resultado);
    if(resultado)
    {
      this.datosdetalles.forEach(element => {
        if(element.cod_codigo_retencion == detalleretencion.cod_codigo_retencion)
        {
          element.base_imponible = element.base_imponible + detalleretencion.base_imponible;
          element.valor_retenido = (parseFloat(element.valor_retenido) + parseFloat(detalleretencion.valor_retenido)).toFixed(6);
        }
      });
    }
    else
    {
      this.datosdetalles.push(detalleretencion);
    }
    this.actualizarValores();
    //console.log(this.datosdetalles);
  }

}