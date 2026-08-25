import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from '../../services/user-session.service';

declare var $:any;

@Component({
  selector: 'app-detalle-nota-credito',
  templateUrl: './detalle-nota-credito.component.html',
  styleUrls: ['./detalle-nota-credito.component.css']
})
export class DetalleNotaCreditoComponent implements OnInit {
  @Input() datosproducto = [];
  @Input() datostarifasproducto = [];

  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("scrolly") scrolly: ElementRef;
  enfocar : boolean = true;

  datosdetalles : any;
  datostarifa : any;

  descripcion_producto : string = "";
  porcentaje_iva : number = 0.00;
  precio_venta : number = 0.00;
  observacion : string = "";
  index_detalle : number = 0;

  disabledtabladetalles : boolean = false;

  loading : boolean = false;
  

  disabledtxtobservacion : boolean = true;
  disabledtxtdescuentogeneral : boolean = true;

  descuentogeneral : number = 0.00;

  subtotal12 : number = 0.00;
  subtotal0 : number = 0.00;
  totalsinimpuestos : number = 0.00;
  totaldescuento : number = 0.00;
  totalconice : number = 0.00;
  totalconimpuestos : number = 0.00;
  importetotal : number = 0.00;

  iva : number = 0.00;
  ivadiv : number = 0.00;

  opcionesprivilegios : any;
  datostipoformadevolucion : any = [];
  cod_tipo_forma_devolucion: number = 0;

  constructor(private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.iva = Number(this.usersession.getConfiguracion("iva"));
    this.ivadiv = (Number(this.usersession.getConfiguracion("iva"))/100) + 1;
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
  }

  changeTipoFormaDevolucion(event: any, index: number): void
  {
    const elemento = event.target.value;
    this.datosdetalles[index].cod_tipo_forma_devolucion = elemento;
  }

  formularioNormal()
  {
    this.subtotal12 = 0.00;
    this.subtotal0 = 0.00;
    this.totalsinimpuestos = 0.00;
    this.descuentogeneral = 0.00;
    this.totaldescuento = 0.00;
    this.totalconice = 0.00;
    this.totalconimpuestos = 0.00;
    this.importetotal = 0.00;
    this.observacion = "";

    this.disabledtxtobservacion = true;
    this.disabledtxtdescuentogeneral = true;
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

  habilitarFormulario()
  {
    this.disabledtxtobservacion = false;
    this.disabledtxtdescuentogeneral = false;
  }

  deshabilitarFormulario()
  {
    this.disabledtabladetalles = true;
    this.disabledtxtobservacion = false;
    this.disabledtxtdescuentogeneral = true;
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

        this.actualizarValores();
      }
      catch(e)
      {
        console.log(e);
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }

  changeChecked(index: number): void {
    this.datosdetalles[index].checked = !this.datosdetalles[index].checked;
  }

  keyPendiente(index: number): void {
    this.datosdetalles[index].fila_error = true;
  }

  keySumar(index: number): void {
    let cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_tarifa);
    
    
    
    this.datosdetalles[index].cantidad_antigua = cantidad_unidad;
    this.datosdetalles[index].fila_error = false;
    this.datosdetalles[index].modificable = 1;

    /*Código A*/
    /*Código A*/
    /*Código A*/
    //El precio de venta con iva ya está incluido
    let total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].precio_base);
    let totalfinal = 0;
    let variva = 0;
      
    let total2= total;
    
    let varice = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].porcentaje_ice);//Es agregado calculo del ICE
    
    if(parseFloat(this.datosdetalles[index].porcentaje_iva) == 0)
    {
      totalfinal = total;
    }
    else
    {
      variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
      totalfinal = total + variva;
    }
    

    this.datosdetalles[index].total = total.toFixed(6);
    this.datosdetalles[index].ice = redondeardecimales(varice, 2);
    this.datosdetalles[index].iva = redondeardecimales(variva, 2);
    this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);

    //INICIA SABER SI HAY ALGUN DESCUENTO
    //INICIA SABER SI HAY ALGUN DESCUENTO
      if(parseFloat(this.datosdetalles[index].descuento)>0)
      {
        
        if(this.datosdetalles[index].checked)//con porcentaje
        {
            totalfinal = parseFloat(this.datosdetalles[index].total_final) - ((this.datosdetalles[index].total_final)  * parseFloat(this.datosdetalles[index].descuento) / 100);
            //alert(totalfinal);
            
            
            if(parseFloat(this.datosdetalles[index].porcentaje_iva) == 0)
            {
              total = totalfinal;
              this.datosdetalles[index].total = total.toFixed(6);
              this.datosdetalles[index].iva = redondeardecimales(variva, 2);
              this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
              let porcentajedescuento = total;
              this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
            }
            else
            {
              let var_iva = (parseFloat(this.datosdetalles[index].porcentaje_iva)/100) + 1;
              total = totalfinal / var_iva;

              variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
              totalfinal = total + variva;

              this.datosdetalles[index].total = total.toFixed(6);
              this.datosdetalles[index].iva = redondeardecimales(variva, 2);
              this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
              let porcentajedescuento = total2 - parseFloat(this.datosdetalles[index].total);
              this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
            }	
        }
        else//Sin porcentaje
        {
            totalfinal = parseFloat(this.datosdetalles[index].total_final) - parseFloat(this.datosdetalles[index].descuento);

            if(parseFloat(this.datosdetalles[index].porcentaje_iva) == 0)
            {
              //totalfinal = total;
              total = totalfinal;
              totalfinal = totalfinal + varice;
              this.datosdetalles[index].total = total.toFixed(6);
              this.datosdetalles[index].iva = redondeardecimales(variva, 2);
              this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
              let porcentajedescuento = total2 - parseFloat(this.datosdetalles[index].total);
              this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
            }
            else
            {
              let var_iva = (parseFloat(this.datosdetalles[index].porcentaje_iva)/100) + 1;
              total = totalfinal / var_iva;

              variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
              totalfinal = total + variva;

              
              this.datosdetalles[index].total = total.toFixed(6);
              this.datosdetalles[index].iva = redondeardecimales(variva, 2);
              this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
              let porcentajedescuento = total2 - parseFloat(this.datosdetalles[index].total);
              this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
            }	
        }
      }
      this.datosdetalles[index].cantidad_unidad = cantidad_unidad;

      this.datosdetalles[index].cantidad_unidad_restada =  this.datosdetalles[index].cantidad_unidad_fija - cantidad_unidad;

      this.actualizarValores();

      /*Código A*/
      /*Código A*/
      /*Código A*/ 
      //console.log(this.datosdetalles[index]);



  }

  keySumarSi(index: number): void
  {
		let variva =0.00;

		let preciorowventa = parseFloat(this.datosdetalles[index].total_final);
		let preciorowventaminimo = parseFloat(this.datosdetalles[index].precio_venta_minimo);
		
		if(preciorowventa>=preciorowventaminimo)
		{
      this.datosdetalles[index].fila_error = false;
      this.datosdetalles[index].modificable = 1;

			let total = parseFloat(this.datosdetalles[index].total_final) / ((parseFloat(this.datosdetalles[index].porcentaje_iva) / 100)+1);
			variva = parseFloat(this.datosdetalles[index].total_final) - parseFloat(total.toFixed(6));
			let varprecio = total / parseFloat(this.datosdetalles[index].cantidad_comprar);
      let varprecioventa = varprecio + ((varprecio * parseFloat(this.datosdetalles[index].porcentaje_iva)) / 100);

      this.datosdetalles[index].total = total.toFixed(6);
      this.datosdetalles[index].iva = redondeardecimales(variva, 2);
      this.datosdetalles[index].precio_base = varprecio.toFixed(6);
      this.datosdetalles[index].precio_venta = varprecioventa.toFixed(2);
      this.datosdetalles[index].descuento = 0;
      this.datosdetalles[index].descuento_calculado = 0;
			
			this.datosdetalles[index].checked = false;

			this.datosdetalles[index].cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_tarifa);
			
			this.actualizarValores();
		}
		else
		{
			this.toastr.error("El precio del producto es menor al precio de venta minimo de " + preciorowventaminimo, "INFORMACIÓN DEL SISTEMA");
      this.datosdetalles[index].fila_error = true;
		}
    //console.log(this.datosdetalles[index]);
  }

  actualizarValores()
  {
    let subtotal12=0.00;
	  let subtotal0=0.00;
	  let totalsinimpuestos=0.00;
	  let totaldescuento=0.00;
	  let totalconice=0.00;
	  let totalconimpuestos=0.00;
	  let descuento=0.00;

	  let temporal_subtotal0 = 0.00;
	  let temporal_subtotal12 = 0.00;

    //console.log(this.datosdetalles);

    this.datosdetalles.forEach(
        element => {

            //alert(element.cod_producto);
            totalconice = totalconice + parseFloat(element.ice);

            if(element.porcentaje_iva == 0)
            {
              temporal_subtotal0 = temporal_subtotal0 + parseFloat(element.total_final);
            }
            else
            {
              temporal_subtotal12 = temporal_subtotal12 + parseFloat(element.total_final);
            }
            totaldescuento = totaldescuento + parseFloat(element.descuento_calculado);

        }
    );
    
    subtotal12 = temporal_subtotal12 / this.ivadiv;
    subtotal0 = temporal_subtotal0;
    totalsinimpuestos = subtotal12 + subtotal0;
    totalconimpuestos = ((subtotal12 * this.iva)/100) + ((totalconice * this.iva)/100);
    //alert(totalconice);
    let importetotal = totalconimpuestos + totalsinimpuestos + totalconice;
    
    this.subtotal12 = redondeardecimales(subtotal12, 2);
    this.subtotal0 = redondeardecimales(subtotal0, 2);
    this.totalsinimpuestos = redondeardecimales(totalsinimpuestos, 2);
    this.totaldescuento = redondeardecimales(totaldescuento, 2);
    this.totalconice = redondeardecimales(totalconice, 2);
    this.totalconimpuestos = redondeardecimales(totalconimpuestos, 2);
    this.importetotal = redondeardecimales(importetotal, 2);
    this.datosenviar.emit(this.importetotal);
  }
  

  descontarGeneral()
  {
    /*Código B*/
    /*Código B*/
    /*Código B*/
    this.datosdetalles.forEach(
      (element) => {
        element.checked = true;
        element.descuento = this.descuentogeneral;

            let total = parseFloat(element.cantidad_comprar) * parseFloat(element.precio_base);
            let totalfinal = 0;
            let variva = 0;
            let total2= total;
            let varice = parseFloat(element.cantidad_comprar) * parseFloat(element.porcentaje_ice);//Es agregado calculo del ICE
           
            element.descuento_calculado = 0;

            if(parseFloat(element.porcentaje_iva) == 0)
            {
              totalfinal = total;
            }
            else
            {
              variva = (total * parseFloat(element.porcentaje_iva))/100;
              totalfinal = total + variva;
            }
            

            element.total = total.toFixed(6);
            element.ice = redondeardecimales(varice, 2);
            element.iva = redondeardecimales(variva, 2);
            element.total_final = redondeardecimales(totalfinal, 2);

            //INICIA SABER SI HAY ALGUN DESCUENTO
            //INICIA SABER SI HAY ALGUN DESCUENTO
              if(parseFloat(element.descuento)>0)
              {
                
                if(element.checked)//con porcentaje
                {
                    totalfinal = parseFloat(element.total_final) - ((element.total_final)  * parseFloat(element.descuento) / 100);

                    if(parseFloat(element.porcentaje_iva) == 0)
                    {
                      total = totalfinal;
                      element.total = total.toFixed(6);
                      element.iva = redondeardecimales(variva, 2);
                      element.total_final = redondeardecimales(totalfinal, 2);
                      let porcentajedescuento = total;
                      element.descuento_calculado = porcentajedescuento.toFixed(6);
                    }
                    else
                    {
                      let var_iva = (parseFloat(element.porcentaje_iva)/100) + 1;
                      total = totalfinal / var_iva;

                      variva = (total * parseFloat(element.porcentaje_iva))/100;
                      totalfinal = total + variva;

                      element.total = total.toFixed(6);
                      element.iva = redondeardecimales(variva, 2);
                      element.total_final = redondeardecimales(totalfinal, 2);
                      let porcentajedescuento = total2 - parseFloat(element.total);
                      element.descuento_calculado = porcentajedescuento.toFixed(6);
                    }	
                }
                else//Sin porcentaje
                {
                    totalfinal = parseFloat(element.total_final) - parseFloat(element.descuento);

                    if(parseFloat(element.porcentaje_iva) == 0)
                    {
                      //totalfinal = total;
                      total = totalfinal;
                      totalfinal = totalfinal + varice;
                      element.total = total.toFixed(6);
                      element.iva = redondeardecimales(variva, 2);
                      element.total_final = redondeardecimales(totalfinal, 2);
                      let porcentajedescuento = total2 - parseFloat(element.total);
                      element.descuento_calculado = porcentajedescuento.toFixed(6);
                    }
                    else
                    {
                      let var_iva = (parseFloat(element.porcentaje_iva)/100) + 1;
                      total = totalfinal / var_iva;

                      variva = (total * parseFloat(element.porcentaje_iva))/100;
                      totalfinal = total + variva;

                      
                      element.total = total.toFixed(6);
                      element.iva = redondeardecimales(variva, 2);
                      element.total_final = redondeardecimales(totalfinal, 2);
                      let porcentajedescuento = total2 - parseFloat(element.total);
                      element.descuento_calculado = porcentajedescuento.toFixed(6);
                    }	
                }
              }
    });
    /*Código B*/
    /*Código B*/
    /*Código B*/
    this.actualizarValores();
  }

}