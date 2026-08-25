import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-productos-salidas',
  templateUrl: './detalle-productos-salidas.component.html',
  styleUrls: ['./detalle-productos-salidas.component.css']
})
export class DetalleProductosSalidasComponent implements OnInit {
  @Input() datosproducto = [];
  @Input() datostarifasproducto = [];

  @ViewChild("scrolly") scrolly: ElementRef;
  enfocar : boolean = true;

  datosdetalles : any = [];

  tipo_formulario: string = "";
  
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  keyCalcularStock(cantidad_unidad : number, cantidad_antigua : number, codigo : number) {
    let cantidad_actual = 0;
    let estado_existencia = true;
    //8 > 5
    //console.log(cantidad_unidad + " > " + cantidad_antigua);
    if(cantidad_unidad > cantidad_antigua)
    {
      //3 = 8 - 5
      cantidad_actual = cantidad_unidad - cantidad_antigua;
      //Resta 3 en el stock del producto
      let estado_stock= this.restarStock(codigo, cantidad_actual);
      //this.datosdetalles[index].cantidad_antigua = cantidad_unidad;
      //alert(estado_stock);
      if(estado_stock==1)
      {
        estado_existencia = true;
      }
      else
      {
        estado_existencia = false;
      }
    }
    else
    {
      //5 < 8
      if(cantidad_unidad < cantidad_antigua)
      {
        //3 = 5 - 8
        cantidad_actual = cantidad_antigua - cantidad_unidad;//cantidad_antigua - cantidad_unidad;
        //Suma el Stock del producto
        this.subirStock(codigo, cantidad_actual);
        //this.datosdetalles[index].cantidad_antigua = cantidad_unidad;
      }
      else
      {
        //alert("Es igual");
      }
    }
    return estado_existencia;
  }

  subirStock(codigo : number, cantidad_unidad : number)
  {
      const resultado = this.datosproducto.find( (valor : any) =>
          {
            if(valor.cod_producto === codigo)
            {
                valor.existencia = parseFloat(valor.existencia) + cantidad_unidad;
                return valor;
            }
          }
       );
  }

  restarStock(codigo : number, cantidad_unidad : number)
  {
      const resultado = this.datosproducto.find( (valor : any) =>
          {
            if(valor.cod_producto === codigo)
            {
                if(valor.existencia >= cantidad_unidad)
                {
                  valor.estado_stock = 1;
                  valor.existencia = parseFloat(valor.existencia) - cantidad_unidad;
                }
                else
                {
                  valor.estado_stock = 0;
                }

                return valor;
            }
          }
       );
       return resultado.estado_stock;//Devuelve el estado de existencias para vender 0 No Hay existencias y 1 si hay existencias
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
      let cantidad_antigua = parseFloat(this.datosdetalles[index].cantidad_antigua);//5  8
      let codigo = this.datosdetalles[index].cod_producto;
      let cantidad_unidad = (parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_paquete)) + parseFloat(this.datosdetalles[index].cantidad_ajuste);

      let calcular = this.keyCalcularStock(cantidad_unidad, cantidad_antigua, codigo);

      if(calcular==true)
      {
        this.datosdetalles[index].fila_error = false;
        this.datosdetalles[index].modificable = 1;
        this.datosdetalles[index].cantidad_unidad = cantidad_unidad;
        this.datosdetalles[index].cantidad_antigua = cantidad_unidad;
      }
      else
      {
        this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la salida de mercadería", "INFORMACIÓN DEL SISTEMA");
      }
    }
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
        let codigo = this.datosdetalles[index].cod_producto;
        let cantidad_unidad = this.datosdetalles[index].cantidad_unidad;
        this.subirStock(codigo, cantidad_unidad);

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

}
