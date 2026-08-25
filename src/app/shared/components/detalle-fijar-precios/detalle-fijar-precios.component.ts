import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import { TarifaService } from 'src/app/almacen/services/tarifa.service';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
declare var $:any;

@Component({
  selector: 'app-detalle-fijar-precios',
  templateUrl: './detalle-fijar-precios.component.html',
  styleUrls: ['./detalle-fijar-precios.component.css']
})
export class DetalleFijarPreciosComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datosdetalles : any;
  datostarifa : any;

  descripcion_producto : string = "";
  porcentaje_iva : number = 0.00;
  precio_venta : number = 0.00;
  index_detalle : number = 0;

  loading : boolean = false;
  

  disabledtxtdescuentogeneral : boolean = true;

  descuentogeneral : number = 0.00;

  constructor(private cd : ChangeDetectorRef, private toastr: ToastrService, private Tarifaservice : TarifaService, private error:ErrorService) { }

  ngOnInit(): void {
    //this.formularioNormal();
  }

  borrar(index)
  {
      try
      {
        this.datosdetalles.splice(index, 1);
      }
      catch(e)
      {
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }

  keyPendiente(index: number): void {
    this.datosdetalles[index].fila_error = true;
  }

  keySumar(index: number): void {
        this.datosdetalles[index].fila_error = false;
        
        let iva = parseFloat(this.datosdetalles[index].porcentaje_iva);
        let precio_base_actual = parseFloat(this.datosdetalles[index].precio_base_actual);
        let precio_actual = precio_base_actual + (precio_base_actual * (iva / 100));
        this.datosdetalles[index].precio_actual = redondeardecimales(precio_actual, 2);

        let costo_base_real = parseFloat(this.datosdetalles[index].costo_base_real);//Utilidad tomada en cuenta sin el iva.
        let resta_precios = precio_base_actual - costo_base_real;
        let utilidad = (resta_precios*100)/costo_base_real;
        this.datosdetalles[index].utilidad = redondeardecimales(utilidad, 2);
  }

  keySumarSi(index: number): void
  {
      this.datosdetalles[index].fila_error = false;

			let precio_actual = parseFloat(this.datosdetalles[index].precio_actual);
      let iva = parseFloat(this.datosdetalles[index].porcentaje_iva);
      let precio_base_actual = precio_actual / (( iva / 100)+1);
      this.datosdetalles[index].precio_base_actual = precio_base_actual.toFixed(6);

      let costo_base_real = parseFloat(this.datosdetalles[index].costo_base_real);//Utilidad tomada en cuenta sin el iva.
      let resta_precios = precio_base_actual - costo_base_real;
      let utilidad = (resta_precios*100)/costo_base_real;
      this.datosdetalles[index].utilidad = redondeardecimales(utilidad, 2);
  }

  descontarGeneral()
  {

    this.datosdetalles.forEach(
      (element) => {
        element.checked = true;
        element.descuento = this.descuentogeneral;      
    });
  }

  keySumarporcentaje(index: number): void {
    this.datosdetalles[index].fila_error = false;
        
    let porcentaje = parseFloat(this.datosdetalles[index].utilidad);
		let iva = parseFloat(this.datosdetalles[index].porcentaje_iva);
		let costo_base_real = parseFloat(this.datosdetalles[index].costo_base_real);

		let precio_base_actual = costo_base_real + ((costo_base_real * porcentaje)/100);
		let precio_actual = precio_base_actual + ((precio_base_actual * iva)/100);

    this.datosdetalles[index].precio_base_actual = precio_base_actual;
    this.datosdetalles[index].precio_actual = redondeardecimales(precio_actual, 2);
  }
}