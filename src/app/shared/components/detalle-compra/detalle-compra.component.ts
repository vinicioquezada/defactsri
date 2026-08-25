import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef} from '@angular/core';
import { TarifaService } from 'src/app/almacen/services/tarifa.service';
import { ErrorService } from '../../services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ListadoProductoEmparejarComponent } from 'src/app/compra/components/compra/listado-producto-emparejar/listado-producto-emparejar.component';
import { ActivatedRoute } from '@angular/router';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { KardexService } from 'src/app/kardex/services/kardex.service';
import { CompraService } from 'src/app/compra/services/compra.service';
import { UserSessionService } from '../../services/user-session.service';
import { LoaderService } from '../../services/loader.service';
import { ProductoFormComponent } from 'src/app/almacen/components/producto/producto-form/producto-form.component';

@Component({
  selector: 'app-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css']
})
export class DetalleCompraComponent implements OnInit {
  @Input() inventario: number = 1;//0 inventario 0 con detalles

  @Output() datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("scrolly") scrolly: ElementRef;
  @ViewChild(ListadoProductoEmparejarComponent) childlistadoproductoemparejar: ListadoProductoEmparejarComponent;
  @ViewChild(ProductoFormComponent) childproductoform: ProductoFormComponent;
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

  cod_sucursal: string = "";

  busquedaporclave : boolean = false;

  tipo_formulario: string = "";
  kardex : string = "";
  cod_factura_compra : string = "";

  constructor(private toastr: ToastrService, private Tarifaservice : TarifaService, private error:ErrorService, private rutaActiva: ActivatedRoute, private kardexservice: KardexService, private compraservice : CompraService, private usersession: UserSessionService, private loader: LoaderService) { }

  ngOnInit(): void {
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;
    this.iva = Number(this.usersession.getConfiguracion("iva"));
    this.ivadiv = (Number(this.usersession.getConfiguracion("iva"))/100) + 1;
  }

  listarProductosComprasPorSucursal(cod_sucursal: string)
  {
    this.cod_sucursal = cod_sucursal;
    this.childlistadoproductoemparejar.listarProductosComprasPorSucursal(cod_sucursal);
    this.datosdetalles = [];
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

    this.busquedaporclave = false;
  }

  ultimaFila()
  {
    if(this.enfocar==true)
    {
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
        this.datosdetalles.splice(index, 1);
        this.actualizarValores();
      }
      catch(e)
      {
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }
  
  agregarProductoEmparejar(index)
  {
    this.index_detalle = index;
    this.childlistadoproductoemparejar.page = 1;
    this.childlistadoproductoemparejar.filterpost="";
    this.descripcion_producto = this.datosdetalles[index].descripcionopcional;
    $("#mymodallistarproductosemparejar").modal("show");
  }

  agregarNuevoProducto(item: any, index)
  {
    this.index_detalle = index;
    this.childproductoform.formularioNormal();
    this.childproductoform.listarSucursales();
    setTimeout(()=>{
      this.childproductoform.descripcion = item.descripcionopcional;
      this.childproductoform.cod_subcategoria = "1";
      this.childproductoform.cod_marca = "1";
      this.childproductoform.cod_unidad_medida = "1";
      this.childproductoform.stock_minimo = "5";
      this.childproductoform.codigo = item.codigoprincipal;

      const resultado = this.childproductoform.datosiva.find( (valor : any) => valor.codigo_iva == item.codigoporcentaje );
      this.childproductoform.id_iva_compra = resultado.id_iva;
      this.childproductoform.costo_base = item.precio_base;
      this.childproductoform.costo = item.precio_venta;
      this.childproductoform.id_iva = resultado.id_iva;
      this.childproductoform.iva = resultado.iva;
      this.childproductoform.iva_compra = resultado.iva;

    },500);
    $("#mymodalformproducto").modal("show");
  }

  recibirDatosProducto(datosrecibidosproducto: any)
  {
    this.datosdetalles[this.index_detalle].cod_producto = datosrecibidosproducto.cod_producto;
    this.datosdetalles[this.index_detalle].descripcion = datosrecibidosproducto.descripcion;
    this.datosdetalles[this.index_detalle].inventario = datosrecibidosproducto.inventario;
    this.datosdetalles[this.index_detalle].unidades_denominacion = datosrecibidosproducto.unidades_denominacion;
    $("#mymodallistarproductosemparejar").modal("hide");
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductoemparejar.page = 1;
    this.childlistadoproductoemparejar.filterpost="";
    this.childlistadoproductoemparejar.listarProductosComprasPorSucursal(this.cod_sucursal);
    this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  changeChecked(index: number): void {
    this.datosdetalles[index].checked = !this.datosdetalles[index].checked;
  }

  keyPendiente(index: number): void {
    this.datosdetalles[index].fila_error = true;
  }

  keySumar(index: number, opcion: number): void {
    if(this.busquedaporclave && opcion==1)
    {
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
    else
    {
      if(this.datosdetalles[index].cantidad_comprar.length==0 || this.datosdetalles[index].cantidad_paquete.length==0 || this.datosdetalles[index].cantidad_ajuste.length==0)
      {
        this.toastr.error("No puede dejar un valor vacio para calcular", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
          this.datosdetalles[index].fila_error = false;
          this.datosdetalles[index].modificable = 1;
          
          /*Código A*/
          /*Código A*/
          /*Código A*/
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

              let precio_real = total / parseFloat(this.datosdetalles[index].cantidad_comprar);  
              this.datosdetalles[index].precio_real = precio_real.toFixed(6);
              let varprecioventa = precio_real + ((precio_real * parseFloat(this.datosdetalles[index].porcentaje_iva)) / 100);
              this.datosdetalles[index].precio_venta_real = varprecioventa.toFixed(2);
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
                      
                      
                      let var_iva = (parseFloat(this.datosdetalles[index].porcentaje_iva)/100) + 1;
                      total = totalfinal / var_iva;

                      variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
                      totalfinal = total + variva;

                      let precio_real = total / parseFloat(this.datosdetalles[index].cantidad_comprar);
                      this.datosdetalles[index].precio_real = precio_real.toFixed(6);
                      let varprecioventa = precio_real + ((precio_real * parseFloat(this.datosdetalles[index].porcentaje_iva)) / 100);
                      this.datosdetalles[index].precio_venta_real = varprecioventa.toFixed(2);

                      this.datosdetalles[index].total = total.toFixed(6);
                      this.datosdetalles[index].iva = redondeardecimales(variva, 2);
                      this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
                      let porcentajedescuento = total2 - parseFloat(this.datosdetalles[index].total);
                      this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
                  }
                  else//Sin porcentaje
                  {
                    totalfinal = parseFloat(this.datosdetalles[index].total_final) - parseFloat(this.datosdetalles[index].descuento);
                      
                    let var_iva = (parseFloat(this.datosdetalles[index].porcentaje_iva)/100) + 1;
                    total = totalfinal / var_iva;

                    variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
                    totalfinal = total + variva;

                    let precio_real = total / parseFloat(this.datosdetalles[index].cantidad_comprar);
                    this.datosdetalles[index].precio_real = precio_real.toFixed(6);
                    let varprecioventa = precio_real + ((precio_real * parseFloat(this.datosdetalles[index].porcentaje_iva)) / 100);
                    this.datosdetalles[index].precio_venta_real = varprecioventa.toFixed(2);

                    this.datosdetalles[index].total = total.toFixed(6);
                    this.datosdetalles[index].iva = redondeardecimales(variva, 2);
                    this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);
                    let porcentajedescuento = total2 - parseFloat(this.datosdetalles[index].total);
                    this.datosdetalles[index].descuento_calculado = porcentajedescuento.toFixed(6);
                      
                  }
                }
            this.datosdetalles[index].cantidad_unidad = (parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_paquete)) + parseFloat(this.datosdetalles[index].cantidad_ajuste);

            this.actualizarValores();
          /*Código A*/
          /*Código A*/
          /*Código A*/
          //console.log(this.datosdetalles[index]);
        }
    }
  }

  keyAceptar(index: number): void {
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

  keySumarSi(index: number): void
  {
		  let variva =0.00;
		
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
      this.datosdetalles[index].precio_real = varprecio.toFixed(6);
      this.datosdetalles[index].precio_venta_real = varprecioventa.toFixed(2);
      this.datosdetalles[index].descuento = 0;
      this.datosdetalles[index].descuento_calculado = 0;
			
			this.datosdetalles[index].checked = false;

			this.datosdetalles[index].cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_tarifa);
			
			this.actualizarValores();
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
            
            let precio_real = total / parseFloat(element.cantidad_comprar);  
            element.precio_real = precio_real.toFixed(6);
            let varprecioventa = precio_real + ((precio_real * parseFloat(element.porcentaje_iva)) / 100);
            element.precio_venta_real = varprecioventa.toFixed(2);
            
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

                    let var_iva = (parseFloat(element.porcentaje_iva)/100) + 1;
                    total = totalfinal / var_iva;

                    variva = (total * parseFloat(element.porcentaje_iva))/100;
                    totalfinal = total + variva;

                    let precio_real = total / parseFloat(element.cantidad_comprar);  
                    element.precio_real = precio_real.toFixed(6);
                    let varprecioventa = precio_real + ((precio_real * parseFloat(element.porcentaje_iva)) / 100);
                    element.precio_venta_real = varprecioventa.toFixed(2);

                    element.total = total.toFixed(6);
                    element.iva = redondeardecimales(variva, 2);
                    element.total_final = redondeardecimales(totalfinal, 2);
                    let porcentajedescuento = total2 - parseFloat(element.total);
                    element.descuento_calculado = porcentajedescuento.toFixed(6);
                }
                else//Sin porcentaje
                {
                    totalfinal = parseFloat(element.total_final) - parseFloat(element.descuento);

                    let var_iva = (parseFloat(element.porcentaje_iva)/100) + 1;
                    total = totalfinal / var_iva;

                    variva = (total * parseFloat(element.porcentaje_iva))/100;
                    totalfinal = total + variva;
                    
                    let precio_real = total / parseFloat(element.cantidad_comprar); 
                    element.precio_real = precio_real.toFixed(6);
                    let varprecioventa = precio_real + ((precio_real * parseFloat(element.porcentaje_iva)) / 100);
                    element.precio_venta_real = varprecioventa.toFixed(2);
                    
                    element.total = total.toFixed(6);
                    element.iva = redondeardecimales(variva, 2);
                    element.total_final = redondeardecimales(totalfinal, 2);
                    let porcentajedescuento = total2 - parseFloat(element.total);
                    element.descuento_calculado = porcentajedescuento.toFixed(6);
                }
              }
    });
    /*Código B*/
    /*Código B*/
    /*Código B*/
    this.actualizarValores();
    //console.log(this.datosdetalles);
  }

  keySumarTotal(index: number): void {
    this.datosdetalles[index].fila_error = false;
    this.datosdetalles[index].modificable = 1;
        
    let totalfinal = 0;
    let variva = 0;

        this.datosdetalles[index].descuento = 0;
        this.datosdetalles[index].descuento_calculado = 0;

        let total = parseFloat(this.datosdetalles[index].total);
        let total2= total;

        let varprecio = total / parseFloat(this.datosdetalles[index].cantidad_comprar);
        let varprecioventa = varprecio + ((varprecio * parseFloat(this.datosdetalles[index].porcentaje_iva)) / 100);
        //let varice = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].porcentaje_ice);//Es agregado calculo del ICE
        
        if(parseFloat(this.datosdetalles[index].porcentaje_iva) == 0)
        {
          totalfinal = total;
        }
        else
        {
          variva = (total * parseFloat(this.datosdetalles[index].porcentaje_iva))/100;
          totalfinal = total + variva;
        }

        //let precio_real = total / parseFloat(this.datosdetalles[index].cantidad_comprar);  
        this.datosdetalles[index].precio_base = varprecio.toFixed(6);
        this.datosdetalles[index].precio_venta = varprecioventa.toFixed(2);
        this.datosdetalles[index].precio_real = varprecio.toFixed(6);
        this.datosdetalles[index].precio_venta_real = varprecioventa.toFixed(2);
      
        //this.datosdetalles[index].total = total.toFixed(6);
        //this.datosdetalles[index].ice = redondeardecimales(varice, 2);
        this.datosdetalles[index].iva = redondeardecimales(variva, 2);
        this.datosdetalles[index].total_final = redondeardecimales(totalfinal, 2);

        this.datosdetalles[index].checked = false;

        this.datosdetalles[index].cantidad_unidad = parseFloat(this.datosdetalles[index].cantidad_comprar) * parseFloat(this.datosdetalles[index].cantidad_tarifa);

      this.actualizarValores();
      
      //console.log(this.datosdetalles[index]);
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
        'cod_factura_compra' : this.cod_factura_compra,
        'id_detalle_compra' : item.id_detalle_compra,
        'cantidad_comprar' : item.cantidad_comprar,
        'cantidad_empaque' : item.cantidad_paquete,
        'cantidad_ajuste' : item.cantidad_ajuste,
        'cantidad_unidad' : item.cantidad_unidad,
        'detalle' : item.descripcion,
        'total' : item.total,
        'total_ice' : item.ice,
        'total_iva' : item.iva,
        'total_final' : item.total_final,
        'subtotalconimpuesto' : this.subtotal12,
        'subtotalsinimpuesto' : this.subtotal0,
        'totalsinimpuestos' : this.totalsinimpuestos,
        'total_descuento' : this.totaldescuento,
        'total_iva_general' : this.totalconimpuestos,
        'importetotal' : this.importetotal
      };
      this.compraservice.actualizarStockIngresoMercaderiaKardex(parametros).subscribe( (data : any) =>
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
        'id_detalle_compra' : item.id_detalle_compra
      };
  
      this.compraservice.eliminarIngresoKardex(parametros).subscribe( (data : any) =>
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
  
      this.kardexservice.verificarSalidasKardex(this.cod_factura_compra, "COMPRA", item.id_detalle_compra).subscribe( (data : any) =>
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
        'cod_factura_compra' : this.cod_factura_compra,
        'id_detalle_compra' : item.id_detalle_compra,
        'costo_base' : item.precio_base,
        'costo' : item.precio_venta,
        'costo_base_real' : item.precio_real,
        'costo_real' : item.precio_venta_real,
        'chkporcentaje' : item.checked,
        'valorporcentaje' : item.descuento,
        'descuento' : item.descuento_calculado,
        'total' : item.total,
        'total_iva' : item.iva,
        'total_final' : item.total_final,
        'subtotalconimpuesto' : this.subtotal12,
        'subtotalsinimpuesto' : this.subtotal0,
        'totalsinimpuestos' : this.totalsinimpuestos,
        'total_descuento' : this.totaldescuento,
        'total_iva_general' : this.totalconimpuestos,
        'importetotal' : this.importetotal
      };
      this.compraservice.actualizarCostoIngresoMercaderiaKardex(parametros).subscribe( (data : any) =>
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

    recibirDatosProductoNuevo(datosrecibidosproducto: any): void {
      this.actualizarListadoProducto();
      this.datosdetalles[this.index_detalle].cod_producto = datosrecibidosproducto.cod_producto;
      this.datosdetalles[this.index_detalle].descripcion = datosrecibidosproducto.descripcion;
      this.datosdetalles[this.index_detalle].inventario = datosrecibidosproducto.inventario;
      this.datosdetalles[this.index_detalle].unidades_denominacion = datosrecibidosproducto.unidades_denominacion;
      $("#mymodalformproducto").modal("hide");
    }

}