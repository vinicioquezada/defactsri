import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { TarifaService } from 'src/app/almacen/services/tarifa.service';
import { ErrorService } from '../../services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from '../../services/user-session.service';
import { SwalService } from '../../services/swal.service';
declare var $:any;

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css']
})
export class DetalleVentaComponent implements OnInit {
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
  precio_base : number = 0.00;
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

  rpv1 : string = "0";
  pv1 : number = 0;
  rpv2 : string = "0";
  pv2 : number = 0;
  rpv3 : string = "0";
  pv3 : number = 0;
  rpv4 : string = "0";
  pv4 : number = 0;
  rpv5 : string = "0";
  pv5 : number = 0;
  rpv6 : string = "0";
  pv6 : number = 0;
  bpv1 : number = 0;
  bpv2 : number = 0;
  bpv3 : number = 0;
  bpv4 : number = 0;
  bpv5 : number = 0;
  bpv6 : number = 0;

  iva : number = 0.00;
  ivadiv : number = 0.00;

  tarifas : string = "0";
  cargartarifasconfigurables : string = "0";
  tarifasenlista : string = "0";

  descuentodirecto : string = "";

  
  opcionesprivilegios : any;

  constructor(private toastr: ToastrService, private Tarifaservice : TarifaService, private error:ErrorService, private usersession: UserSessionService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.iva = Number(this.usersession.getConfiguracion("iva"));
    this.ivadiv = (Number(this.usersession.getConfiguracion("iva"))/100) + 1;
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.cargartarifasconfigurables = this.usersession.getConfiguracion("cargartarifasconfigurables");
    this.tarifasenlista = this.usersession.getConfiguracion("tarifasenlista");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
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

    this.rpv1 = "0";
    this.pv1 = 0;
    this.rpv2 = "0";
    this.pv2 = 0;
    this.rpv3 = "0";
    this.pv3 = 0;
    this.rpv4 = "0";
    this.pv4 = 0;
    this.rpv5 = "0";
    this.pv5 = 0;
    this.rpv6 = "0";
    this.pv6 = 0;

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

  borrar(index)
  {
      try
      {
        if(this.datosdetalles[index].inventario == 1)
        {
          let codigo = this.datosdetalles[index].cod_producto;
          let cantidad_unidad = this.datosdetalles[index].cantidad_unidad;
          this.subirStock(codigo, cantidad_unidad);
        }

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

  cargarTarifa(index: number)
  {
    if(this.datosdetalles[index].fila_error)
    {
      this.toastr.warning("Hay una o más filas pendientes de cualcular, no debe estar la fila de color rojo para seleccionar una tarifa", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
        this.datostarifa = [];
        this.index_detalle = index;
        this.porcentaje_iva =  parseFloat(this.datosdetalles[index].porcentaje_iva);
        this.precio_base = parseFloat(this.datosdetalles[index].precio_base_original);
        let cod_producto = this.datosdetalles[index].cod_producto;
        this.descripcion_producto = this.datosdetalles[index].descripcion;
        this.precio_venta = redondeardecimales(this.precio_base + ((this.precio_base * this.porcentaje_iva) / 100), 2);

      if(this.tarifasenlista=='1')
      {
        let tarifa = {
          "cod_tarifa" : 0,
          "tarifa_producto" : "SELECCIONE UNA TARIFA",
          "cantidad_unidad" : 0,
          "tipo_tarifa" : "",
          "precio_base" : 0,
          "precio_venta" : 0
        }
    
        this.datostarifa.push(tarifa);
    
        tarifa = {
          "cod_tarifa" : 1,
          "tarifa_producto" : "NORMAL - Precio de Venta: " + this.precio_venta + "$",
          "cantidad_unidad" : 1,
          "tipo_tarifa" : "NORMAL",
          "precio_base" : this.precio_base,
          "precio_venta" : this.precio_venta
        }
        this.datostarifa.push(tarifa);
        this.listarTarifas(cod_producto);
      }
      else
      {
        this.rpv1 = this.datosdetalles[index].rpv1;
        this.pv1 = this.datosdetalles[index].pv1;
        this.rpv2 = this.datosdetalles[index].rpv2;
        this.pv2 = this.datosdetalles[index].pv2;
        this.rpv3 = this.datosdetalles[index].rpv3;
        this.pv3 = this.datosdetalles[index].pv3;
        this.rpv4 = this.datosdetalles[index].rpv4;
        this.pv4 = this.datosdetalles[index].pv4;
        this.rpv5 = this.datosdetalles[index].rpv5;
        this.pv5 = this.datosdetalles[index].pv5;
        this.rpv6 = this.datosdetalles[index].rpv6;
        this.pv6 = this.datosdetalles[index].pv6;
        this.bpv1 = this.datosdetalles[index].bpv1;
        this.bpv2 = this.datosdetalles[index].bpv2;
        this.bpv3 = this.datosdetalles[index].bpv3;
        this.bpv4 = this.datosdetalles[index].bpv4;
        this.bpv5 = this.datosdetalles[index].bpv5;
        this.bpv6 = this.datosdetalles[index].bpv6;
      }
        
      $("#mymodaltarifas").modal("show");
    }

  }

  onChangeTarifaProducto(event: any): void {
    const cod_tarifa = event.target.value;
    const resultado = this.datostarifa.find( (valor : any) => valor.cod_tarifa == cod_tarifa );

    if(resultado.cod_tarifa == 0)
    {		
      this.toastr.warning("Seleccione una tarifa para agregar a la Factura", "INFORMACIÓN DEL SISTEMA");				
    }
    else
    {
        this.datosdetalles[this.index_detalle].precio_base = resultado.precio_base;
        this.datosdetalles[this.index_detalle].precio_venta = resultado.precio_venta;
        this.datosdetalles[this.index_detalle].tarifa = resultado.tipo_tarifa;
        this.datosdetalles[this.index_detalle].cod_tarifa = resultado.cod_tarifa;
        this.datosdetalles[this.index_detalle].cantidad_tarifa = resultado.cantidad_unidad;
        this.keySumar(this.index_detalle, 1);
        $("#mymodaltarifas").modal("hide");
    }
  }

  clickTarifaProducto(precio_base: number, precio_venta: number, tipo_tarifa: string): void {
    this.datosdetalles[this.index_detalle].precio_base = precio_base;
    this.datosdetalles[this.index_detalle].precio_venta = precio_venta;
    this.datosdetalles[this.index_detalle].tarifa = tipo_tarifa;
    this.datosdetalles[this.index_detalle].cod_tarifa = 0;
    this.datosdetalles[this.index_detalle].cantidad_tarifa = 1;
    let total = parseFloat(this.datosdetalles[this.index_detalle].cantidad_comprar) * precio_base;
    this.datosdetalles[this.index_detalle].apv1 = 0;
    this.datosdetalles[this.index_detalle].apv2 = 0;
    this.datosdetalles[this.index_detalle].apv3 = 0;
    this.datosdetalles[this.index_detalle].apv4 = 0;
    this.datosdetalles[this.index_detalle].apv5 = 0;
    this.datosdetalles[this.index_detalle].apv6 = 0;
    this.datosdetalles[this.index_detalle].fila_error = false;
    this.datosdetalles[this.index_detalle].modificable = 1;
    this.calcularValoresFilaSumar(this.index_detalle, total, this.datosdetalles[this.index_detalle].cantidad_unidad, 1);
    $("#mymodaltarifas").modal("hide");
  }

  async clickMayorGeneral(tarifa: string)
  {
    const ok = await this.swalservice.alertConfirmRequerido({
      title: "Información del Sistema",
      text: "¿Estás seguro de cambiar las tarifas a " + tarifa +  " todos los productos de los detalles?",
      icon: "info",
      confirmText: "Sí, Cambiar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      this.datosdetalles.forEach((item: any, index: number) => {
          if(tarifa=="NORMAL")
          {
            if(item.tarifa !="NORMAL")
            {
              item.precio_base = item.precio_base_original;
              const varprecioventa = item.precio_base_original + ((item.precio_base_original * parseFloat(item.porcentaje_iva)) / 100);
              item.precio_venta = varprecioventa.toFixed(2);
              item.tarifa = "NORMAL";
              item.cod_tarifa = 0;
              item.cantidad_tarifa = 1;
              let total = parseFloat(item.cantidad_comprar) * item.precio_base_original;
              item.apv1 = 0;
              item.apv2 = 0;
              item.apv3 = 0;
              item.apv4 = 0;
              item.apv5 = 0;
              item.apv6 = 0;
              item.modificable = 1;
              item.fila_error = false;
              this.calcularValoresFilaSumar(index, total, item.cantidad_unidad, 1);
            }
          }

          if(tarifa=="MAYOR")
          {
            if(item.bpv4>0 && item.tarifa !="MAYOR")
            {
              item.precio_base = item.bpv4;
              item.precio_venta = item.pv4;
              item.tarifa = "MAYOR";
              item.cod_tarifa = 0;
              item.cantidad_tarifa = 1;
              let total = parseFloat(item.cantidad_comprar) * item.bpv4;
              item.apv1 = 0;
              item.apv2 = 0;
              item.apv3 = 0;
              item.apv4 = 0;
              item.apv5 = 0;
              item.apv6 = 0;
              item.modificable = 1;
              item.fila_error = false;
              this.calcularValoresFilaSumar(index, total, item.cantidad_unidad, 1);
            }
          }

          if(tarifa=="MAYOR AF")
          {
            if(item.bpv1>0 && item.tarifa !="MAYOR AF")
            {
              item.precio_base = item.bpv1;
              item.precio_venta = item.pv1;
              item.tarifa = "MAYOR AF";
              item.cod_tarifa = 0;
              item.cantidad_tarifa = 1;
              let total = parseFloat(item.cantidad_comprar) * item.bpv1;
              item.apv1 = 0;
              item.apv2 = 0;
              item.apv3 = 0;
              item.apv4 = 0;
              item.apv5 = 0;
              item.apv6 = 0;
              item.modificable = 1;
              item.fila_error = false;
              this.calcularValoresFilaSumar(index, total, item.cantidad_unidad, 1);
            }
          }
          
      });
    }
  }

  listarTarifas(cod_producto: string)
  {    
    this.loading = true;
    

    this.Tarifaservice.listarTarifasVisibles(cod_producto).subscribe( (data : any) =>
    {
      data.forEach(item => {
        let tarifa = {
          "cod_tarifa" : item.cod_tarifa,
          "tarifa_producto" : item.tarifa_producto,
          "cantidad_unidad" : item.cantidad_unidad,
          "tipo_tarifa" : item.tipo_tarifa,
          "precio_base" : item.precio_base,
          "precio_venta" : item.precio_venta
        }
        this.datostarifa.push(tarifa);
      });

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  changeChecked(index: number): void {
    this.datosdetalles[index].checked = !this.datosdetalles[index].checked;
  }

  keyPendiente(index: number): void {
    this.datosdetalles[index].fila_error = true;
  }

  bloquearEnter(event: KeyboardEvent, index: number) {
    this.datosdetalles[index].fila_error = true;
  if (event.key === 'Enter') {
    event.preventDefault();
  }
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
              //if(valor.inventario == 1)
              //{
                valor.restar_stock_tarifa = 1;
                valor.existencia = parseFloat(valor.existencia) + cantidad_unidad;
                return valor;
              //}
              //else
              //{
                //valor.restar_stock_tarifa = 0;
                //return valor;
              //}
            }
          }
       );

        if(this.cargartarifasconfigurables=="1")
        {
          if(resultado.restar_stock_tarifa==1)
          {
               this.datostarifasproducto.find( (valor : any) =>
               {
                     if(valor.cod_producto === resultado.cod_producto)
                     {
                         valor.existencia = parseFloat(valor.existencia) + cantidad_unidad;
                     }
                   }
               );
          }
        }
       
  }

  restarStock(codigo : number, cantidad_unidad : number)
  {
      const resultado = this.datosproducto.find( (valor : any) =>
          {
            if(valor.cod_producto === codigo)
            {
              //if(valor.inventario == 1)
              //{
                //console.log(valor.existencia + " >= " + cantidad_unidad);
                if(valor.existencia >= cantidad_unidad)
                {
                  valor.restar_stock_tarifa = 1;
                  valor.estado_stock = 1;
                  valor.existencia = parseFloat(valor.existencia) - cantidad_unidad;
                }
                else
                {
                  valor.restar_stock_tarifa = 0;
                  valor.estado_stock = 0;
                }

                return valor;
              //}
              //else
              //{
                //valor.restar_stock_tarifa = 0;
                //valor.estado_stock = 1;
                //return valor;
              //}
            }
          }
       );

        if(this.cargartarifasconfigurables=="1")
        {
          if(resultado.restar_stock_tarifa==1)
          {
               this.datostarifasproducto.find( (valor : any) =>
               {
                     if(valor.cod_producto === resultado.cod_producto)
                     {
                         valor.existencia = parseFloat(valor.existencia) - cantidad_unidad;
                     }
                   }
               );
          }
        }
        
       return resultado.estado_stock;//Devuelve el estado de existencias para vender 0 No Hay existencias y 1 si hay existencias
  }

  keySumar(index: number, option: number): void
  {
    let cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_tarifa);
    let codigo = this.datosdetalles[index].cod_producto;
    let calcular = this.verificarExistencias(index, option, cantidad_unidad, codigo);
    
    if(calcular==true)
    {
        this.datosdetalles[index].cantidad_antigua = cantidad_unidad;
        this.datosdetalles[index].fila_error = false;
        this.datosdetalles[index].modificable = 1;
        
      /*Código A*/
      /*Código A*/
      /*Código A*/
      //El precio de venta con iva ya está incluido
      let total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].precio_base);

      if(this.datosdetalles[index].apv1 == 1)
      {
        if(cantidad_unidad >= this.datosdetalles[index].rpv1)
        {
          this.datosdetalles[index].precio_base = this.datosdetalles[index].bpv1;
          this.datosdetalles[index].precio_venta = this.datosdetalles[index].pv1;
          this.datosdetalles[index].tarifa = "MAYOR AF";
          this.datosdetalles[index].cod_tarifa = 0;
          this.datosdetalles[index].cantidad_tarifa = 1;
          total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].bpv1);
        }
      }

      if(this.datosdetalles[index].apv2 == 1)
      {
        if(cantidad_unidad >= this.datosdetalles[index].rpv2)
        {
          this.datosdetalles[index].precio_base = this.datosdetalles[index].bpv2;
          this.datosdetalles[index].precio_venta = this.datosdetalles[index].pv2;
          this.datosdetalles[index].tarifa = "DOCENA AF";
          this.datosdetalles[index].cod_tarifa = 0;
          this.datosdetalles[index].cantidad_tarifa = 1;
          total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].bpv2);
        }
      }

      if(this.datosdetalles[index].apv3 == 1)
      {
        if(cantidad_unidad >= this.datosdetalles[index].rpv3)
        {
          this.datosdetalles[index].precio_base = this.datosdetalles[index].bpv3;
          this.datosdetalles[index].precio_venta = this.datosdetalles[index].pv3;
          this.datosdetalles[index].tarifa = "BULTO AF";
          this.datosdetalles[index].cod_tarifa = 0;
          this.datosdetalles[index].cantidad_tarifa = 1;
          total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].bpv3);
        }
      }
      
      if(this.datosdetalles[index].apv4 == 1)
      {
        if(cantidad_unidad >= this.datosdetalles[index].rpv4)
        {
          this.datosdetalles[index].precio_base = this.datosdetalles[index].bpv4;
          this.datosdetalles[index].precio_venta = this.datosdetalles[index].pv4;
          this.datosdetalles[index].tarifa = "MAYOR";
          this.datosdetalles[index].cod_tarifa = 0;
          this.datosdetalles[index].cantidad_tarifa = 1;
          total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].bpv4);
        }
      }

      if(this.datosdetalles[index].apv5 == 1)
      {
        if(cantidad_unidad >= this.datosdetalles[index].rpv5)
        {
          this.datosdetalles[index].precio_base = this.datosdetalles[index].bpv5;
          this.datosdetalles[index].precio_venta = this.datosdetalles[index].pv5;
          this.datosdetalles[index].tarifa = "DOCENA";
          this.datosdetalles[index].cod_tarifa = 0;
          this.datosdetalles[index].cantidad_tarifa = 1;
          total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].bpv5);
        }
      }

      if(this.datosdetalles[index].apv6 == 1)
      {
        if(cantidad_unidad >= this.datosdetalles[index].rpv6)
        {
          this.datosdetalles[index].precio_base = this.datosdetalles[index].bpv6;
          this.datosdetalles[index].precio_venta = this.datosdetalles[index].pv6;
          this.datosdetalles[index].tarifa = "BULTO";
          this.datosdetalles[index].cod_tarifa = 0;
          this.datosdetalles[index].cantidad_tarifa = 1;
          total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].bpv6);
        }
      }
      

      //Verifica las ofertas mas o igual de x unidades
      //Verifica las ofertas mas o igual de x unidades
      //Verifica las ofertas mas o igual de x unidades
      if(this.cargartarifasconfigurables=="1")
      {
        //console.log(this.datostarifasproducto);
        this.datostarifasproducto.find( (valor : any) =>
        {
              if(valor.cod_producto === codigo && valor.codigo == "" && valor.cod_forma_tarifa == 1)
              {
                  if(cantidad_unidad == valor.porx)
                  {
                    this.datosdetalles[index].precio_base = valor.precio_base;
                    this.datosdetalles[index].precio_venta = valor.precio_venta;
                    this.datosdetalles[index].tarifa = valor.tipo_tarifa;
                    this.datosdetalles[index].cod_tarifa = valor.cod_tarifa;
                    this.datosdetalles[index].cantidad_tarifa = valor.cantidad_unidad;

                    total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(valor.precio_base);
                    this.datosdetalles[index].saltar=1;//Con Salto de fila
                  }
              }
              else
              {
                if(valor.cod_producto === codigo && valor.codigo == "" && valor.cod_forma_tarifa == 2)
                {
                    if(cantidad_unidad >= valor.mayorigual)
                    {
                      this.datosdetalles[index].precio_base = valor.precio_base;
                      this.datosdetalles[index].precio_venta = valor.precio_venta;
                      this.datosdetalles[index].tarifa = valor.tipo_tarifa;
                      this.datosdetalles[index].cod_tarifa = valor.cod_tarifa;
                      this.datosdetalles[index].cantidad_tarifa = valor.cantidad_unidad;
  
                      total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(valor.precio_base);
                    }
                }
              }
            }
        );
      }
      //Verifica las ofertas mas o igual de x unidades
      //Verifica las ofertas mas o igual de x unidades
      //Verifica las ofertas mas o igual de x unidades

      this.calcularValoresFilaSumar(index, total, cantidad_unidad, 1);
      /*Código A*/
      /*Código A*/
      /*Código A*/ 
      //console.log(this.datosdetalles[index]);


    }
    else
    {
      this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la venta", "INFORMACIÓN DEL SISTEMA");
    }
  }


  keySumar2(index: number, option: number): void
  {    
    let cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_tarifa);
    let codigo = this.datosdetalles[index].cod_producto;

    let calcular = this.verificarExistencias(index, option, cantidad_unidad, codigo);

    if(calcular==true)
    {
      this.datosdetalles[index].cantidad_antigua = cantidad_unidad;
      this.datosdetalles[index].fila_error = false;
      this.datosdetalles[index].modificable = 1;

      let precio_base = parseFloat(this.datosdetalles[index].precio_venta);
      if(parseFloat(this.datosdetalles[index].porcentaje_iva) > 0)
      {
        let porcentaje_iva = (this.iva/100) + 1;
        precio_base = parseFloat(this.datosdetalles[index].precio_venta) / porcentaje_iva;
      }

      this.datosdetalles[index].precio_base = precio_base.toFixed(6);
      /*Código A*/
      /*Código A*/
      /*Código A*/
      //El precio de venta con iva ya está incluido
          
      let total = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].precio_base);

      this.calcularValoresFilaSumar(index, total, cantidad_unidad, 1);

      
      /*Código A*/
      /*Código A*/
      /*Código A*/ 
      //console.log(this.datosdetalles[index]);
    }
    else
    {
      this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la venta", "INFORMACIÓN DEL SISTEMA");
    }
  }

  verificarExistencias(index: number, option: number, cantidad_unidad: number, codigo: number)
  {
    //let cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar);//8   5
    let cantidad_antigua = parseFloat(this.datosdetalles[index].cantidad_antigua);//5  8
    

    /*CALCULAR STOCK*/
    let calcular = false;
    if(this.datosdetalles[index].inventario == 0)
    {
      calcular = true;
    }
    else
    {
      if(option==1)// Resta Stock
      {
        calcular = this.keyCalcularStock(cantidad_unidad, cantidad_antigua, codigo);
      }
      else// No Resta Stock
      {
        calcular = true;
      }
    }
    /*CALCULAR STOCK*/
    return calcular;
  }

  calcularValoresFilaSumar(index: number, total: number, cantidad_unidad: number, validacionpreciominimo: number): void
  {
    let totalfinal = 0;
    let variva = 0;

    let preciorowbaseminimo = 0;
    
    if(validacionpreciominimo==1)
    {
      preciorowbaseminimo = parseFloat(this.datosdetalles[index].precio_base_minimo);
    }
      
    if(total>=preciorowbaseminimo)
    {
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
            this.calcularDescuento(index, total2);
          }
      this.datosdetalles[index].cantidad_unidad = cantidad_unidad;

      this.actualizarValores();
    }
    else
    {
      this.toastr.error("El precio del producto es menor al precio de base minimo de " + preciorowbaseminimo, "INFORMACIÓN DEL SISTEMA");
    }
  }

  quitarErrorFila(index: number): void
  {
    this.datosdetalles[index].fila_error = false;
    this.datosdetalles[index].modificable = 1;
  }

  keySumarSi(index: number, option: number): void
  {
    let cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_tarifa);
    let codigo = this.datosdetalles[index].cod_producto;

    let calcular = this.verificarExistencias(index, option, cantidad_unidad, codigo);

    if(calcular==true)
    {

      let variva =0.00;

      //let preciorowventa = parseFloat(this.datosdetalles[index].precio_venta);
      let preciorowventaminimo = parseFloat(this.datosdetalles[index].precio_venta_minimo);

      this.datosdetalles[index].fila_error = false;
      this.datosdetalles[index].modificable = 1;

      let total = parseFloat(this.datosdetalles[index].total_final) / ((parseFloat(this.datosdetalles[index].porcentaje_iva) / 100)+1);
      variva = parseFloat(this.datosdetalles[index].total_final) - parseFloat(total.toFixed(6));
      let varprecio = total / parseFloat(this.datosdetalles[index].cantidad_comprar);
      let varprecioventa = varprecio + ((varprecio * parseFloat(this.datosdetalles[index].porcentaje_iva)) / 100);

      if(varprecioventa>=preciorowventaminimo)
      {
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
    }
    else
    {
      this.toastr.warning("No existe la cantidad de unidades del producto en existencia para la venta", "INFORMACIÓN DEL SISTEMA");
    }   
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

  reiniciarPorcentajeTarifa()
  {
    this.datosdetalles.forEach(
      (element, incremento) => {
        let totalfinalvalor = parseFloat(element.total_final);
        let porcentajetarjeta = parseFloat(element.incremento);
        let totalfinal = totalfinalvalor - porcentajetarjeta;

        element.total_final = redondeardecimales(totalfinal, 2);
        element.incremento = 0;

        //console.log(incremento);
        this.sumarSiTarjetaCredito(incremento);
      }
    );
  }

  aplicarPorcentajeTarifa(tarifa: number)
  {

    this.datosdetalles.forEach(
      (element, incremento) => {
        if(element.iva_original!=0)
        {
          let totalfinalvalor = parseFloat(element.total_final);
          let porcentajetarjeta = (parseFloat(element.total_final) * tarifa)/100;
          let totalfinal = totalfinalvalor + porcentajetarjeta;
          element.total_final = redondeardecimales(totalfinal, 2);
          element.incremento = porcentajetarjeta;
          this.sumarSiTarjetaCredito(incremento);
        }
      }
    );
  }

  sumarSiTarjetaCredito(index: number)
  {
    let variva =0.00;

		//let preciorowventa = parseFloat(this.datosdetalles[index].total_final);
		//let preciorowventaminimo = parseFloat(this.datosdetalles[index].precio_venta_minimo);
		
    this.datosdetalles[index].fila_error = false;

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
    //console.log(this.datosdetalles[index]);
  }

  descontarGeneral()
  {
    let c=0;
    this.datosdetalles.forEach(
      (element) => {
        element.checked = true;
        element.descuento = this.descuentogeneral;
        element.modificable = 1;
        let cantidad_unidad = parseFloat(element.cantidad_comprar) * parseFloat(element.cantidad_tarifa);
        element.cantidad_antigua = cantidad_unidad;

        let total = parseFloat(element.cantidad_comprar) * parseFloat(element.precio_base);
        
        this.calcularValoresFilaSumar(c, total, cantidad_unidad, 1);
        c++;
    });
  }

  descontarGeneralDirecto()//Solo Factura con Descuento
  {
    let c=0;
    this.datosdetalles.forEach(
      (element) => {
        element.precio_base = element.precio_base - ((element.precio_base  * parseFloat(this.descuentodirecto)) / 100);
        let precio_venta = element.precio_base + ((element.precio_base * element.porcentaje_iva) / 100);
        element.precio_venta = redondeardecimales(precio_venta, 2);
        let cantidad_unidad = parseFloat(element.cantidad_comprar) * parseFloat(element.cantidad_tarifa);
        element.cantidad_antigua = cantidad_unidad;

        let total = parseFloat(element.cantidad_comprar) * parseFloat(element.precio_base);
        
        this.calcularValoresFilaSumar(c, total, cantidad_unidad, 0);
        c++;
    });
  }

  calcularDescuento(index: number, total2: number)
  {
    let totalfinal = 0;
    let var_iva = 0;
    let total = 0;
    let variva = 0;
    let porcentajedescuento = 0;

    if(this.datosdetalles[index].checked)//con porcentaje
    {
        totalfinal = parseFloat(this.datosdetalles[index].total_final) - ((this.datosdetalles[index].total_final)  * parseFloat(this.datosdetalles[index].descuento) / 100);
        //alert(totalfinal);
        
        var_iva = (parseFloat(this.datosdetalles[index].porcentaje_iva)/100) + 1;
        total = totalfinal / var_iva;

        variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
        totalfinal = total + variva;

        this.datosdetalles[index].total = total.toFixed(6);
        this.datosdetalles[index].iva = redondeardecimales(variva, 2);
        this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
        porcentajedescuento = total2 - parseFloat(this.datosdetalles[index].total);
        this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
    }
    else//Sin porcentaje
    {
        totalfinal = parseFloat(this.datosdetalles[index].total_final) - parseFloat(this.datosdetalles[index].descuento);

        var_iva = (parseFloat(this.datosdetalles[index].porcentaje_iva)/100) + 1;
        total = totalfinal / var_iva;

        variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
        totalfinal = total + variva;
        
        this.datosdetalles[index].total = total.toFixed(6);
        this.datosdetalles[index].iva = redondeardecimales(variva, 2);
        this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
        porcentajedescuento = total2 - parseFloat(this.datosdetalles[index].total);
        this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
    }
  }

}