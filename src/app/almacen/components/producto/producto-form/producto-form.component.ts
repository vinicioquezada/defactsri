import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ExistenciasService } from 'src/app/almacen/services/existencias.service';
import { TipoProductoService } from 'src/app/almacen/services/tipo-producto.service';
import { SubcategoriaService } from 'src/app/almacen/services/subcategoria.service';
import { MarcaService } from 'src/app/almacen/services/marca.service';
import { UnidadMedidaService } from 'src/app/almacen/services/unidad-medida.service';
import { IvaCompraService } from 'src/app/almacen/services/iva-compra.service';
import { IvaService } from 'src/app/almacen/services/iva.service';
import { DenominacionService } from 'src/app/almacen/services/denominacion.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from 'src/app/shared/js/decimales.js';
declare var $:any;
import { SubcategoriaFormComponent } from '../../subcategoria/subcategoria-form/subcategoria-form.component';
import { MarcaFormComponent } from '../../marca/marca-form/marca-form.component';
import { UnidadMedidaFormComponent } from '../../unidad-medida/unidad-medida-form/unidad-medida-form.component';
import { CodigoProductoComponent } from 'src/app/shared/components/codigo-producto/codigo-producto.component';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  kardex : string = "0";
  control_estricto_inventario : string = "0";
  codigosproducto : string = "0";
  
  tarifas : string = "0";

  @ViewChild(SubcategoriaFormComponent) subcategoriaformcomponent: any;
  @ViewChild(MarcaFormComponent) marcaformcomponent: any;
  @ViewChild(UnidadMedidaFormComponent) unidadmedidaformcomponent: any;
  @ViewChild(CodigoProductoComponent) childcodigoproducto: any;
  tipoformulario: string = "agregar";
  precios_completos : string = "0";
  codigo_automatico_producto: string = "0";

  datosexistencias : any = [];

  cantidad_registros : number = 0;

  datostipoproducto : any;
  datosinventario : any;
  datoscaducidad : any;
  datosfraccionado : string[] = ["SI", "NO"];
  datossubcategoria : any;
  datosmarca : any;
  datosunidadmedida : any;
  datosivacompra : any;
  datosiva : any;
  datosdenominacion : any;

  cod_sucursal : string = "";

  cod_tipo_producto : string = "";
  cod_producto : string = "";
  codigo : string = "";
  codigo_adicional : string = "";
  codigo_adicional1 : string = "";
  cod_subcategoria : string = "";
  cod_marca : string = "";
  cod_unidad_medida : string = "";
  descripcion : string = "";
  stock_minimo : string = "";
  codigo_percha : string = "";
  codigo_inventario : string = "";
  codigo_caducidad : string = "";
  fraccionado : string = "";
  cod_denominacion : string = "0";
  denominacion : string = "NA";
  unidades_denominacion : any = 0;

  id_iva : any = 0;
  iva : any = 0;
  id_iva_compra : any = 0;
  iva_compra : any = 0;
  costo_base : any = 0;
  costo : any = 0;

  /*Precio de Venta*/
  precio_base : any = 0;
  utilidad : any = 0;
  precio_venta : any = 0;
  precio_base_minimo : any = 0;
  precio_venta_minimo : any = 0;
  /*Precio de Venta*/

  /*Precio de Mayor*/
  rpv1 : any = 0;
  bpv1 : any = 0;
  upv1 : any = 0;
  pv1 : any = 0;
  apv1 : any = 0;
  /*Precio de Mayor*/

  /*Precio de Docena*/
  rpv2 : any = 0;
  bpv2 : any = 0;
  upv2 : any = 0;
  pv2 : any = 0;
  apv2 : any = 0;
  /*Precio de Docena*/

  /*Precio de Bulto*/
  rpv3 : any = 0;
  bpv3 : any = 0;
  upv3 : any = 0;
  pv3 : any = 0;
  apv3 : any = 0;
  /*Precio de Bulto*/


   /*Precio de Mayor*/
   rpv4 : any = 0;
   bpv4 : any = 0;
   upv4 : any = 0;
   pv4 : any = 0;
   apv4 : any = 0;
   /*Precio de Mayor*/
 
   /*Precio de Docena*/
   rpv5 : any = 0;
   bpv5 : any = 0;
   upv5 : any = 0;
   pv5 : any = 0;
   apv5: any = 0;
   /*Precio de Docena*/
 
   /*Precio de Bulto*/
   rpv6 : any = 0;
   bpv6 : any = 0;
   upv6 : any = 0;
   pv6 : any = 0;
   apv6 : any = 0;
   /*Precio de Bulto*/

  configuracion_existencias : any = 1;

  flagocultarentradas : number = 1;
  
  flagocultarboton : boolean = false;
  
  flagcodigo : boolean = false;
  flagsubcategoria : boolean = false;
  flagmarca : boolean = false;
  flagunidadmedida : boolean = false;
  flagdescripcion : boolean = false;
  flagstockminimo : boolean = false;

  flagivacompra : boolean = false;
  flagiva : boolean = false;
  flagcostobase : boolean = false;
  flagcosto : boolean = false;
  flagpreciobase : boolean = false;
  flagprecioventa : boolean = false;
  flagpreciobaseminimo : boolean = false;
  flagprecioventaminimo : boolean = false;

  tipo_item : any = 0;


  ban : number = 0;
  codigotemporal : string = "";
  codigotemporaladicional: string = "";

  loadingform : boolean = false;

  constructor(private productoservice:ProductoService, private toastr: ToastrService, private error:ErrorService, private subcategoriaservice:SubcategoriaService, private marcaservice:MarcaService, private unidadmedidaservice:UnidadMedidaService, private ivacompraservice:IvaCompraService, private ivaservice:IvaService, private tipoproductoservice:TipoProductoService, private denominacionservice:DenominacionService, private sucursalesservice:SucursalesService, private existenciaservice:ExistenciasService, private usersession: UserSessionService, private swalservice: SwalService) {
  }

  ngOnInit(): void {
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.control_estricto_inventario = this.usersession.getConfiguracion("control_estricto_inventario");
    this.precios_completos = this.usersession.getConfiguracion("precios_completos");
    this.codigo_automatico_producto = this.usersession.getConfiguracion("codigo_automatico_producto");
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.codigosproducto = this.usersession.getConfiguracion("codigosproducto");
    this.datosinventario  = [];
    let valor = {
      "codigo_inventario" : 0,
      "inventario" : "NO"
    }
    this.datosinventario.push(valor);
    valor = {
      "codigo_inventario" : 1,
      "inventario" : "SI"
    }
    this.datosinventario.push(valor);

    this.datoscaducidad  = [];
    let valorcaducidad = {
      "codigo_caducidad" : 0,
      "caducidad" : "NO"
    }
    this.datoscaducidad.push(valorcaducidad);
    valorcaducidad = {
      "codigo_caducidad" : 1,
      "caducidad" : "SI"
    }
    this.datoscaducidad.push(valorcaducidad);

    this.cargarFormulario();
    
  }

  async cargarFormulario()
  {
    await this.formularioNormal();
    this.cargarListas();
  }

  changeChkConfiguracionExistencias()
  {
    if(this.configuracion_existencias==1){
      this.configuracion_existencias = 0;
    }else{
      this.configuracion_existencias = 1;
    }
  }



  clickSubCategoria()
  {
    this.subcategoriaformcomponent.nombreformulario = "NUEVA";
    this.subcategoriaformcomponent.formularioNormal();
    $("#mymodalformsubcategoria").modal("show");
  }

  clickMarca()
  {
    this.marcaformcomponent.nombreformulario = "NUEVA";
    this.marcaformcomponent.formularioNormal();
    $("#mymodalformmarca").modal("show");
  }

  clickUnidadMedida()
  {
    this.unidadmedidaformcomponent.formularioNormal();
    $("#mymodalunidadmedida").modal("show");
  }

  recibirDatosSubCategoria(datosrecibidossubcategoria: any)
  {
    this.datossubcategoria.push(datosrecibidossubcategoria);
    this.cod_subcategoria = datosrecibidossubcategoria.cod_subcategoria;
    $("#mymodalformsubcategoria").modal("hide");
  }

  recibirDatosMarca(datosrecibidosmarca: any)
  {
    this.datosmarca.push(datosrecibidosmarca);
    this.cod_marca = datosrecibidosmarca.cod_marca;
    $("#mymodalformmarca").modal("hide");
  }

  recibirDatosUnidadMedida(datosrecibidosunidadmedida: any)
  {
    this.datosunidadmedida.push(datosrecibidosunidadmedida);
    this.cod_unidad_medida = datosrecibidosunidadmedida.cod_unidad_medida;
    $("#mymodalunidadmedida").modal("hide");
  }

  changeTipoProducto(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_producto = elemento;

    if(this.cod_tipo_producto == "2" || this.cod_tipo_producto == "3")//Servicio y Servicio Varios
    {
      this.flagocultarentradas = 0;//Ocultar
      this.codigo_inventario = "0";
      this.codigo_caducidad = "0";
      this.datosexistencias.find((x:any) => true == true).habilitar = true;
    }

    if(this.cod_tipo_producto == "1" || this.cod_tipo_producto == "4")//Producto e Ingrediente
    {
      this.flagocultarentradas = 1;//Presentar
      this.codigo_inventario = "1";
      this.codigo_caducidad = "0";
      this.datosexistencias.find((x:any) => true == true).habilitar = false;
    }

    this.cod_marca = "1";//N/A
    this.cod_unidad_medida = "1";//N/A
    this.stock_minimo = "0";

    this.fraccionado = "NO";
    this.cod_denominacion = "0";
    this.denominacion = "NA";
    this.unidades_denominacion = 0;

    this.id_iva =0;
    this.iva =0;
    this.id_iva_compra =0;
    this.iva_compra =0;
    this.costo_base =0;
    this.costo =0;
    /*Precio de Venta*/
    this.precio_base = 0;
    this.utilidad = 0;
    this.precio_venta = 0;
    this.precio_base_minimo = 0;
    this.precio_venta_minimo = 0;
    /*Precio de Venta*/

    /*Precio de Mayor*/
    this.rpv1 =0 ;
    this.bpv1 = 0;
    this.upv1 = 0;
    this.pv1 = 0;
    this.apv1 = 0;
    /*Precio de Mayor*/

    /*Precio de Docena*/
    this.rpv2 =0 ;
    this.bpv2 = 0;
    this.upv2 = 0;
    this.pv2 = 0;
    this.apv2 = 0;
    /*Precio de Docena*/

    /*Precio de Bulto*/
    this.rpv3 =0 ;
    this.bpv3 = 0;
    this.upv3 = 0;
    this.pv3 = 0;
    this.apv3 = 0;
    /*Precio de Bulto*/

    /*Precio de Mayor*/
    this.rpv4 =0 ;
    this.bpv4 = 0;
    this.upv4 = 0;
    this.pv4 = 0;
    this.apv4 = 0;
    /*Precio de Mayor*/

    /*Precio de Docena*/
    this.rpv5 =0 ;
    this.bpv5 = 0;
    this.upv5 = 0;
    this.pv5 = 0;
    this.apv5 = 0;
    /*Precio de Docena*/

    /*Precio de Bulto*/
    this.rpv6 =0 ;
    this.bpv6 = 0;
    this.upv6 = 0;
    this.pv6 = 0;
    this.apv6 = 0;
    /*Precio de Bulto*/
  }

  changeInventario(event: any): void {
    const elemento = event.target.value;
    this.codigo_inventario = elemento;
    if(this.codigo_inventario == "0")
    {
      this.codigo_caducidad = "0";
    }
  }

  changeCaducidad(event: any): void {
    const elemento = event.target.value;
    this.codigo_caducidad = elemento;
  }

  changeFraccionado(event: any): void {
    const elemento = event.target.value;
    this.fraccionado = elemento;
    this.cod_denominacion = "0";
    this.denominacion = "NA";
    this.unidades_denominacion = 0;
  }

  changeDenominacion(event: any): void {
    const elemento = event.target.value;
    this.cod_denominacion = elemento;
  }

  
  changeIvaCompra(event: any): void {
    const elemento = event.target.value;
    this.id_iva_compra = elemento;
    const resultado = this.datosivacompra.find( (valor : any) => valor.id_iva_compra == elemento );
    this.iva_compra = resultado.iva_compra;
    this.calcularCostoCompra();
  }
  

  changeIva(event: any): void {
    const elemento = event.target.value;
    this.id_iva = elemento;
    const resultado = this.datosiva.find( (valor : any) => valor.id_iva == elemento );
    this.iva = resultado.iva;
    this.calcularPrecioVenta();
    this.calcularPrecioVenta1();
    this.calcularPrecioVenta2();
    this.calcularPrecioVenta3();
  }

  changeHabilitar(index: number): void {
    if(this.datosexistencias[index].habilitar==true){
      this.datosexistencias[index].habilitar = false;
    }else{
      this.datosexistencias[index].habilitar = true;
    }

    if(this.kardex == "1") {
      this.toastr.warning("No se puede editar las existencias mientras el Kardex esta habilitado, debe ingresar mercaderia o dar de baja", "INFORMACIÓN DEL SISTEMA");
    }
  }

  keyUpCalcularExistencias(index: number): void {
    this.datosexistencias[index].total_unidades = parseFloat(this.datosexistencias[index].cantidad_denominacion) * parseFloat(this.unidades_denominacion);
    this.datosexistencias[index].existencia = this.datosexistencias[index].total_unidades;
  }

  keyUpAjustarExistencias(index: number): void {
    let existencia = 0;

    if(this.fraccionado=="SI")
    {
      existencia = parseFloat(this.datosexistencias[index].total_unidades) + parseFloat(this.datosexistencias[index].ajustar_existencia);
    }
    else
    {
      existencia = parseFloat(this.datosexistencias[index].total_unidades) + this.datosexistencias[index].ajustar_existencia =="NaN" ? 0 : parseFloat(this.datosexistencias[index].ajustar_existencia);
    }
    this.datosexistencias[index].existencia = existencia;
  }

  async clickGuardar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      let verificar = this.datosexistencias.some(item => item.habilitar);
      if(verificar)
      {
          let validarnumero = false;
          this.datosexistencias.forEach(element => {
            if (isNaN(element.existencia)) {
              validarnumero = true;
            }
          });

          if(validarnumero)
          {
            this.toastr.warning("Un valor en Existencia no corresponde a un número (NaN)", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            this.swalservice.iniciarLoading("Almacenando...");
            try
            {
              await this.buscar();
            } catch (err: any) {
              const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
            } finally {
              this.swalservice.close();
            }
          }
      }
      else
      {
        this.toastr.warning("Debe seleccionar al menos una empresa para existencias, revisar configuración de existencias", "INFORMACIÓN DEL SISTEMA");
      }
    }
  }
  
  async clickActualizar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.swalservice.iniciarLoading("Actualizando...");
      try
      {
          if(this.codigo==this.codigotemporal && this.codigo_adicional==this.codigotemporaladicional)
          {
            await this.actualizar();
          }
          else
          {
            if(this.codigo!=this.codigotemporal && this.codigo_adicional!=this.codigotemporaladicional)
            {
              await this.buscar();
            }
            else
            {
              if(this.codigo!=this.codigotemporal)
              {
                await this.buscarCodigo(this.codigo);
              }
              else
              {
                await this.buscarCodigo(this.codigo_adicional);
              }
            }
            
          }
      } catch (err: any) {
        const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      } finally {
        this.swalservice.close();
      }

    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.codigo.length==0)
    {
      this.flagcodigo=true;
      valor=true;
    }
    
    if(this.cod_subcategoria=="" || this.cod_subcategoria==null)
    {
      this.flagsubcategoria=true;
      valor=true;
    }

    if(this.cod_marca=="" || this.cod_marca==null)
    {
      this.flagmarca=true;
      valor=true;
    }

    if(this.cod_unidad_medida=="" || this.cod_unidad_medida==null)
    {
      this.flagunidadmedida=true;
      valor=true;
    }

    if(this.descripcion.length==0)
    {
      this.flagdescripcion=true;
      valor=true;
    }

    if(this.stock_minimo.length==0)
    {
      this.flagstockminimo=true;
      valor=true;
    }

    if(this.id_iva_compra==0)
    {
      this.flagivacompra=true;
      valor=true;
    }

    if(this.id_iva==0)
    {
      this.flagiva=true;
      valor=true;
    }

    if(this.costo_base.length==0)
    {
      this.flagcostobase=true;
      valor=true;
    }

    if(this.costo.length==0)
    {
      this.flagcosto=true;
      valor=true;
    }

    if(this.precio_base.length==0)
    {
      this.flagpreciobase=true;
      valor=true;
    }

    if(this.precio_venta.length==0)
    {
      this.flagprecioventa=true;
      valor=true;
    }

    if(this.precio_base_minimo.length==0)
    {
      this.flagpreciobaseminimo=true;
      valor=true;
    }

    if(this.precio_venta_minimo.length==0)
    {
      this.flagprecioventaminimo=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagcodigo = false;
    this.flagsubcategoria=false;
    this.flagmarca=false;
    this.flagunidadmedida=false;
    this.flagdescripcion = false;
    this.flagstockminimo  = false;

    this.flagivacompra = false;
    this.flagiva = false;
    this.flagcostobase = false;
    this.flagcosto = false;
    this.flagpreciobase = false;
    this.flagprecioventa = false;
    this.flagpreciobaseminimo = false;
    this.flagprecioventaminimo = false;
  }
 
  async buscar()
  {
    let data: any = await lastValueFrom(this.productoservice.buscar(this.codigo, this.codigo_adicional));
    
    if (data.cod_producto == false)//No existe
    {
        if (this.ban == 0)
        {
          await this.guardar();
        }
        else
        {
          await this.actualizar();         
        }
    }
    else
    {
        this.toastr.warning("Producto se encuentra registrado con el codigo de barra ingresado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async buscarCodigo(codigo: string)
  {
    let data: any = await lastValueFrom(this.productoservice.buscarCodigo(codigo));
    
    if (data.cod_producto == false)//No existe
    {
          this.actualizar();         
    }
    else
    {
        this.toastr.warning("Producto se encuentra registrado con el codigo de barra ingresado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
    }
  }

  buscarCodigoBarra()
  {
    this.swalservice.iniciarLoading("Verificando código barra...");

    this.productoservice.buscarCodigo(this.codigo).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.cod_producto == false)//No existe
      {
            this.flagcodigo = false;         
      }
      else
      {
        this.flagcodigo = true;
          this.toastr.warning("Producto se encuentra registrado con el codigo de barra ingresado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }   
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  borrarCodigoAutomatico() {
    this.codigo = "";
  }

  originarCodigoProducto()
  {
    this.loadingform = true;

    this.productoservice.originarCodigoProducto().subscribe( (data : any) =>
    {
      this.loadingform = false;
      if (data.codigo_producto == false)//No existe
      {
        this.toastr.warning("No se pudo generar el código del producto debido a un error", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
          this.codigo = data.codigo_producto;
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
  });
  }
  
  async guardar()
  {    
    const parametros = {
      'cod_producto' : this.cod_producto,
      'codigo' :this.codigo,
      'descripcion' : this.descripcion,
      'cod_subcategoria' : this.cod_subcategoria,
      'cod_marca' : this.cod_marca,
      'cod_unidad_medida' : this.cod_unidad_medida,
      'id_iva' : this.id_iva,
      'id_iva_compra' : this.id_iva_compra,
      'costo_base' : this.costo_base,
      'costo' : this.costo,
      /*Precio de Venta*/
      'utilidad' : this.utilidad,
      'precio_base' : this.precio_base,
      'precio_venta' : this.precio_venta,
      'precio_base_minimo' : this.precio_base_minimo,
      'precio_venta_minimo' : this.precio_venta_minimo,
      /*Precio de Venta*/
      /*Precio de Mayor*/
      'rpv1' : this.rpv1,
      'upv1' : this.upv1,
      'bpv1' : this.bpv1,
      'pv1' : this.pv1,
      'apv1' : this.apv1,
      /*Precio de Mayor*/
      /*Precio de Docena*/
      'rpv2' : this.rpv2,
      'upv2' : this.upv2,
      'bpv2' : this.bpv2,
      'pv2' : this.pv2,
      'apv2' : this.apv2,
      /*Precio de Docena*/
      /*Precio de Bulto*/
      'rpv3' : this.rpv3,
      'upv3' : this.upv3,
      'bpv3' : this.bpv3,
      'pv3' : this.pv3,
      'apv3' : this.apv3,
      /*Precio de Bulto*/
      /*Precio de Mayor*/
      'rpv4' : this.rpv4,
      'upv4' : this.upv4,
      'bpv4' : this.bpv4,
      'pv4' : this.pv4,
      'apv4' : this.apv4,
      /*Precio de Mayor*/
      /*Precio de Docena*/
      'rpv5' : this.rpv5,
      'upv5' : this.upv5,
      'bpv5' : this.bpv5,
      'pv5' : this.pv5,
      'apv5' : this.apv5,
      /*Precio de Docena*/
      /*Precio de Bulto*/
      'rpv6' : this.rpv6,
      'upv6' : this.upv6,
      'bpv6' : this.bpv6,
      'pv6' : this.pv6,
      'apv6' : this.apv6,
      /*Precio de Bulto*/
      'stock_minimo' : this.stock_minimo,
      'cod_tipo_producto' : this.cod_tipo_producto,
      'inventario' : this.codigo_inventario,
      'caducidad' : this.codigo_caducidad,
      'codigo_adicional' : this.codigo_adicional,
      'codigo_adicional1' : this.codigo_adicional1,
      'codigo_percha' : this.codigo_percha,
      'fraccionado' : this.fraccionado,
      'cod_denominacion' : this.cod_denominacion,
      'unidades_denominacion' : this.unidades_denominacion,
      'detalles_resumidos' : "",
      'detalles_completos' : "",//CKEDITOR.instances["txtdetallescompletos"].getData(),
      'imagen' : "",
      'existencias' : this.datosexistencias,
      'codigoproducto' : this.childcodigoproducto.datoscodigoproducto
    };

    let data: any = await lastValueFrom(this.productoservice.guardar(parametros));

    if (data.estado == true)
    {
      this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      this.formularioNormal();
      this.datosenvio.emit(parametros);
    }
    else
    {
      const ok = await this.swalservice.alertError("Registro no se pudo Almacenar, vuelva a intertarlo por favor");
    }
  }
  
  async actualizar()
  {
    if(this.configuracion_existencias==0)
    {
      this.datosexistencias = [];
    }

    const parametros = {
      'cod_producto' : this.cod_producto,
      'codigo' :this.codigo,
      'descripcion' : this.descripcion,
      'cod_subcategoria' : this.cod_subcategoria,
      'cod_marca' : this.cod_marca,
      'cod_unidad_medida' : this.cod_unidad_medida,
      'id_iva' : this.id_iva,
      'id_iva_compra' : this.id_iva_compra,
      'costo_base' : this.costo_base,
      'costo' : this.costo,
      /*Precio de Venta*/
      'utilidad' : this.utilidad,
      'precio_base' : this.precio_base,
      'precio_venta' : this.precio_venta,
      'precio_base_minimo' : this.precio_base_minimo,
      'precio_venta_minimo' : this.precio_venta_minimo,
      /*Precio de Venta*/
      /*Precio de Mayor*/
      'rpv1' : this.rpv1,
      'upv1' : this.upv1,
      'bpv1' : this.bpv1,
      'pv1' : this.pv1,
      'apv1' : this.apv1,
      /*Precio de Mayor*/
      /*Precio de Docena*/
      'rpv2' : this.rpv2,
      'upv2' : this.upv2,
      'bpv2' : this.bpv2,
      'pv2' : this.pv2,
      'apv2' : this.apv2,
      /*Precio de Docena*/
      /*Precio de Bulto*/
      'rpv3' : this.rpv3,
      'upv3' : this.upv3,
      'bpv3' : this.bpv3,
      'pv3' : this.pv3,
      'apv3' : this.apv3,
      /*Precio de Bulto*/
      /*Precio de Mayor*/
      'rpv4' : this.rpv4,
      'upv4' : this.upv4,
      'bpv4' : this.bpv4,
      'pv4' : this.pv4,
      'apv4' : this.apv4,
      /*Precio de Mayor*/
      /*Precio de Docena*/
      'rpv5' : this.rpv5,
      'upv5' : this.upv5,
      'bpv5' : this.bpv5,
      'pv5' : this.pv5,
      'apv5' : this.apv5,
      /*Precio de Docena*/
      /*Precio de Bulto*/
      'rpv6' : this.rpv6,
      'upv6' : this.upv6,
      'bpv6' : this.bpv6,
      'pv6' : this.pv6,
      'apv6' : this.apv6,
      /*Precio de Bulto*/
      'stock_minimo' : this.stock_minimo,
      'cod_tipo_producto' : this.cod_tipo_producto,
      'inventario' : this.codigo_inventario,
      'caducidad' : this.codigo_caducidad,
      'codigo_adicional' : this.codigo_adicional,
      'codigo_adicional1' : this.codigo_adicional1,
      'codigo_percha' : this.codigo_percha,
      'fraccionado' : this.fraccionado,
      'cod_denominacion' : this.cod_denominacion,
      'unidades_denominacion' : this.unidades_denominacion,
      'detalles_resumidos' : "",
      'detalles_completos' : "",
      'imagen' : "",
      'existencias' : this.datosexistencias,
      'codigoproducto' : this.childcodigoproducto.datoscodigoproducto
    };

    let data: any = await lastValueFrom(this.productoservice.actualizar(parametros));

    if (data.estado == true)
    {
      this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      this.formularioNormal();
      this.datosenvio.emit();
    }
    else
    {
      const ok = await this.swalservice.alertError("Registro no se pudo Actualizar, vuelva a intertarlo por favor");
    }
    

  }
  
  async formularioNormal()
  {
    this.cod_producto = moment().unix().toString();
    this.cod_tipo_producto="1";
    this.codigo="";
    this.codigo_adicional="";
    this.codigo_adicional1="";
    this.cod_subcategoria = "";
    this.cod_marca="";
    this.cod_unidad_medida="";
    this.descripcion ="";
    this.stock_minimo="";
    this.codigo_percha="";
    this.codigo_inventario="1";
    this.codigo_caducidad="0";

    this.fraccionado = "NO";
    this.cod_denominacion = "0";
    this.denominacion = "NA";
    this.unidades_denominacion = 0;

    

    this.id_iva =0;
    this.iva =0;
    this.id_iva_compra =0;
    this.iva_compra =0;
    this.costo_base =0;
    this.costo =0;

    /*Precio de Venta*/
    this.precio_base = 0;
    this.utilidad = 0;
    this.precio_venta = 0;
    this.precio_base_minimo = 0;
    this.precio_venta_minimo = 0;
    /*Precio de Venta*/

    /*Precio de Mayor*/
    this.rpv1 =0 ;
    this.bpv1 = 0;
    this.upv1 = 0;
    this.pv1 = 0;
    this.apv1 = 0;
    /*Precio de Mayor*/

    /*Precio de Docena*/
    this.rpv2 =0 ;
    this.bpv2 = 0;
    this.upv2 = 0;
    this.pv2 = 0;
    this.apv2 = 0;
    /*Precio de Docena*/

    /*Precio de Bulto*/
    this.rpv3 = 0 ;
    this.bpv3 = 0;
    this.upv3 = 0;
    this.pv3 = 0;
    this.apv3 = 0;
    /*Precio de Bulto*/

    /*Precio de Mayor*/
    this.rpv4 =0 ;
    this.bpv4 = 0;
    this.upv4 = 0;
    this.pv4 = 0;
    this.apv4 = 0;
    /*Precio de Mayor*/

    /*Precio de Docena*/
    this.rpv5 =0 ;
    this.bpv5 = 0;
    this.upv5 = 0;
    this.pv5 = 0;
    this.apv5 = 0;
    /*Precio de Docena*/

    /*Precio de Bulto*/
    this.rpv6 =0 ;
    this.bpv6 = 0;
    this.upv6 = 0;
    this.pv6 = 0;
    this.apv6 = 0;
    /*Precio de Bulto*/

    this.configuracion_existencias = 1;

    this.flagocultarentradas = 1;

    this.flagocultarboton = false;

    this.flagNormal();

    

    if(this.codigo_automatico_producto=="1") {
      this.originarCodigoProducto();
    }
  
    this.codigotemporal="";
    this.codigotemporaladicional = "";
    
    this.ban=0;

    //this.datosexistencias = [];
  }

  cargarListas()
  {
    this.listarTipoProducto();
    this.listarSubCategorias();
    this.listarMarcas();
    this.listarUnidadesMedidas();
    this.listarIvaCompra();
    this.listarIva();
    this.listarDenominaciones();
  }

  listarSubCategorias()
  {    
    this.loadingform = true;
    this.subcategoriaservice.listarSubCategoriasCategoria().subscribe( (data : any) =>
    {
      this.datossubcategoria = data;
      this.loadingform = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
    });
  }

  listarMarcas()
  {    
    this.loadingform = true;
    

    this.marcaservice.listarMarcas().subscribe( (data : any) =>
    {
      this.datosmarca = data;
      this.loadingform = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  listarUnidadesMedidas()
  {    
    this.loadingform = true;
    

    this.unidadmedidaservice.listarUnidadesMedidas().subscribe( (data : any) =>
    {
      this.datosunidadmedida = data;
      this.loadingform = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  listarIvaCompra()
  {
    this.datosivacompra = [];
    this.loadingform = true;
    

    this.ivacompraservice.listarIvaCompra().subscribe( (data : any) =>
    {
      this.loadingform = false;
      let ivacompra = {
        "id_iva_compra" : 0,
        "iva_compra" : "SELECCIONE IVA COMPRA"
      }

      this.datosivacompra.push(ivacompra);

      data.forEach(element => {
        let ivacompra = {
          "id_iva_compra" : element.id_iva_compra,
          "iva_compra" : element.iva_compra
        }
        this.datosivacompra.push(ivacompra);
      });
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  listarIva()
  {
    this.datosiva = [];
    this.loadingform = true;
    

    this.ivaservice.listarIva().subscribe( (data : any) =>
    {
      this.loadingform = false;

      let iva = {
        "id_iva" : 0,
        "iva" : "SELECCIONE IVA VENTA"
      }

      this.datosiva.push(iva);

      data.forEach(element => {
        let iva = {
          "id_iva" : element.id_iva,
          "iva" : element.iva,
          "codigo_iva" : element.codigo_iva
        }
        this.datosiva.push(iva);
      });
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  listarTipoProducto()
  {    
    this.loadingform = true;
    

    this.tipoproductoservice.listarTiposProductos().subscribe( (data : any) =>
    {
      this.datostipoproducto = data;
      this.loadingform = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  async buscarProducto(cod_producto: string)
  {
    this.cod_producto = cod_producto;   
    this.loadingform = true;

    try
    {

      const data: any = await lastValueFrom(this.productoservice.buscarProducto(this.cod_producto));
      this.loadingform = false;
      this.codigo = data.codigo;
      this.cod_tipo_producto = data.cod_tipo_producto;
      this.codigo_adicional = data.codigo_adicional;
      this.codigo_adicional1 = data.codigo_adicional1;
      this.descripcion = data.descripcion;
      this.cod_subcategoria = data.cod_subcategoria.toString();
      this.cod_marca = data.cod_marca.toString();
      this.cod_unidad_medida = data.cod_unidad_medida.toString();
      this.stock_minimo = data.stock_minimo;
      this.codigo_inventario = data.inventario;
      this.codigo_caducidad = data.caducidad;
      this.codigo_percha = data.codigo_percha;
      this.id_iva_compra = data.id_iva_compra;
      this.iva_compra = data.iva_compra;
      this.costo_base = data.costo_base;
      this.costo = data.costo;
      this.id_iva = data.id_iva;
      this.iva = data.iva;
     
      /*Precio de Venta*/
      this.precio_base = data.precio_base;
      this.precio_venta = data.precio_venta;
      this.precio_base_minimo = data.precio_base_minimo;
      this.precio_venta_minimo = data.precio_venta_minimo;
      /*Precio de Venta*/

      /*Precio de Mayor*/
      this.rpv1 = data.rpv1;
      this.bpv1 = data.bpv1;
      this.pv1 = data.pv1;
      this.apv1 = parseInt(data.apv1);
      /*Precio de Mayor*/

      /*Precio de Docena*/
      this.rpv2 = data.rpv2;
      this.bpv2 = data.bpv2;
      this.pv2 = data.pv2;
      this.apv2 = parseInt(data.apv2);
      /*Precio de Docena*/

      /*Precio de Bulto*/
      this.rpv3 = data.rpv3;
      this.bpv3 = data.bpv3;
      this.pv3 = data.pv3;
      this.apv3 = parseInt(data.apv3);
      /*Precio de Bulto*/

      /*Precio de Mayor*/
      this.rpv4 = data.rpv4;
      this.bpv4 = data.bpv4;
      this.pv4 = data.pv4;
      this.apv4 = parseInt(data.apv4);
      /*Precio de Mayor*/

      /*Precio de Mayor*/
      this.rpv5 = data.rpv5;
      this.bpv5 = data.bpv5;
      this.pv5 = data.pv5;
      this.apv5 = parseInt(data.apv5);
      /*Precio de Mayor*/

      /*Precio de Mayor*/
      this.rpv6 = data.rpv6;
      this.bpv6 = data.bpv6;
      this.pv6 = data.pv6;
      this.apv6 = parseInt(data.apv6);
      /*Precio de Mayor*/

      this.fraccionado = data.fraccionado;
      this.cod_denominacion = data.cod_denominacion;
      this.denominacion = data.denominacion;
      this.unidades_denominacion = data.unidades_denominacion;


      this.listarExistenciasProducto();

      
      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.codigo;
      this.codigotemporaladicional = this.codigo_adicional;
      this.ban=1;
      
      this.configuracion_existencias = 0;

      

      if(this.cod_tipo_producto == "2" || this.cod_tipo_producto == "3")//Servicio y Servicio Varios
      {
        this.flagocultarentradas = 0;//Ocultar
      }

      if(this.cod_tipo_producto == "1" || this.cod_tipo_producto == "4")//Producto e Ingrediente
      {
        this.flagocultarentradas = 1;//Presentar
      }

      this.buscarCodigosProducto();

    }
      catch (err) {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingform = false;
      }
  }

  buscarCodigosProducto() : void
  {
    this.loadingform = true;
    this.productoservice.buscarCodigosProducto(this.cod_producto).subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.childcodigoproducto.datoscodigoproducto = [];
      this.childcodigoproducto.datoscodigoproducto = data;
    }, err => {
      this.loadingform = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  listarDenominaciones()
  {    
    this.loadingform = true;

    this.denominacionservice.listarDenominaciones().subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datosdenominacion = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  listarSucursales()
  {    
    this.loadingform = true;
    
    this.datosexistencias = [];

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {

      for (let item of data){
        let cod_existencias = this.cod_producto + "_" + item.cod_sucursal;
        let sucursal = {
            habilitar : false,
            cod_existencias : cod_existencias,
            cod_sucursal : item.cod_sucursal,
            sucursal : item.sucursal,
            cantidad_denominacion : "0",
            total_unidades : "0",
            ajustar_existencia : "0",
            existencia : "0"
        }
        
        this.datosexistencias.push(sucursal);
      }

      this.loadingform = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }

 

  calcularCostoBase()
  {
    let porcentaje_iva_compra = (this.costo_base * this.iva_compra) / 100;
    this.costo = redondeardecimales((parseFloat(this.costo_base) + porcentaje_iva_compra),2);
  }

  calcularCostoCompra()
  {
    let porcentaje_iva_compra = (this.iva_compra/100) + 1;
    let costo_base = parseFloat(this.costo) / porcentaje_iva_compra;
    this.costo_base = costo_base.toFixed(6);
  }

  /*Cálculo de Precio de Venta*/
  /*Cálculo de Precio de Venta*/
  /*Cálculo de Precio de Venta*/
  calcularPrecioBase()
  {
    let porcentaje_iva = (this.precio_base * this.iva) / 100;
    this.precio_venta = redondeardecimales((parseFloat(this.precio_base) + porcentaje_iva), 2);
  }

  calcularPrecioVenta()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let precio_base = parseFloat(this.precio_venta) / porcentaje_iva;
    this.precio_base = precio_base.toFixed(6);
  }

  calcularPrecioBaseMinimo()
  {
    let porcentaje_iva = (this.precio_base_minimo * this.iva) / 100;
    this.precio_venta_minimo = redondeardecimales((parseFloat(this.precio_base_minimo) + porcentaje_iva), 2);
  }

  calcularPrecioVentaMinimo()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let precio_base_minimo = parseFloat(this.precio_venta_minimo) / porcentaje_iva;
    this.precio_base_minimo = precio_base_minimo.toFixed(6);
  }

  calcularUtilidad()
  {
    let iva = this.iva;
    let iva2=iva;
    iva = iva/100;	

    let total_normal = (this.costo_base * this.utilidad)/100;
    let precio_base = parseFloat(this.costo_base) + total_normal;
    this.precio_base = precio_base.toFixed(6);
    let precio_venta = precio_base + (precio_base * iva);
    this.precio_venta = redondeardecimales(precio_venta, 2);
  }
  /*Cálculo de Precio de Venta*/
  /*Cálculo de Precio de Venta*/
  /*Cálculo de Precio de Venta*/

  /*Cálculo de Precio de Mayor*/
  /*Cálculo de Precio de Mayor*/
  /*Cálculo de Precio de Mayor*/
  calcularPrecioBase1()
  {
    let porcentaje_iva = (this.bpv1 * this.iva) / 100;
    this.pv1 = redondeardecimales((parseFloat(this.bpv1) + porcentaje_iva), 2);
  }

  calcularPrecioVenta1()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let bpv1 = parseFloat(this.pv1) / porcentaje_iva;
    this.bpv1 = bpv1.toFixed(6);
  }

  calcularUtilidad1()
  {
    let iva = this.iva;
    let iva2=iva;
    iva = iva/100;

    let total_normal = (this.costo_base * this.utilidad)/100;
    let bpv1 = parseFloat(this.costo_base) + total_normal;
    this.bpv1 = bpv1.toFixed(6);
    let pv1 = bpv1 + (bpv1 * iva);
    this.pv1 = redondeardecimales(pv1, 2);
  }

  changeChkAutomatico1()
  {
    if(this.apv1==1){
      this.apv1 = 0;
    }else{
      this.apv1 = 1;
    }
  }
  /*Cálculo de Precio de Mayor*/
  /*Cálculo de Precio de Mayor*/
  /*Cálculo de Precio de Mayor*/

  /*Cálculo de Precio de Docena*/
  /*Cálculo de Precio de Docena*/
  /*Cálculo de Precio de Docena*/
  calcularPrecioBase2()
  {
    let porcentaje_iva = (this.bpv2 * this.iva) / 100;
    this.pv2 = redondeardecimales((parseFloat(this.bpv2) + porcentaje_iva), 2);
  }

  calcularPrecioVenta2()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let bpv2 = parseFloat(this.pv2) / porcentaje_iva;
    this.bpv2 = bpv2.toFixed(6);
  }

  calcularUtilidad2()
  {
    let iva = this.iva;
    let iva2=iva;
    iva = iva/100;

    let total_normal = (this.costo_base * this.utilidad)/100;
    let bpv2 = parseFloat(this.costo_base) + total_normal;
    this.bpv2 = bpv2.toFixed(6);
    let pv2 = bpv2 + (bpv2 * iva);
    this.pv2 = redondeardecimales(pv2, 2);
  }

  changeChkAutomatico2()
  {
    if(this.apv2==1){
      this.apv2 = 0;
    }else{
      this.apv2 = 1;
    }
  }
  /*Cálculo de Precio de Docena*/
  /*Cálculo de Precio de Docena*/
  /*Cálculo de Precio de Docena*/

  /*Cálculo de Precio de Bulto*/
  /*Cálculo de Precio de Bulto*/
  /*Cálculo de Precio de Bulto*/
  calcularPrecioBase3()
  {
    let porcentaje_iva = (this.bpv3 * this.iva) / 100;
    this.pv3 = redondeardecimales((parseFloat(this.bpv3) + porcentaje_iva), 2);
  }

  calcularPrecioVenta3()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let bpv3 = parseFloat(this.pv3) / porcentaje_iva;
    this.bpv3 = bpv3.toFixed(6);
  }

  calcularUtilidad3()
  {
    let iva = this.iva;
    let iva2=iva;
    iva = iva/100;

    let total_normal = (this.costo_base * this.utilidad)/100;
    let bpv3 = parseFloat(this.costo_base) + total_normal;
    this.bpv3 = bpv3.toFixed(6);
    let pv3 = bpv3 + (bpv3 * iva);
    this.pv3 = redondeardecimales(pv3, 2);
  }

  changeChkAutomatico3()
  {
    if(this.apv3==1){
      this.apv3 = 0;
    }else{
      this.apv3 = 1;
    }
  }
  /*Cálculo de Precio de Bulto*/
  /*Cálculo de Precio de Bulto*/
  /*Cálculo de Precio de Bulto*/

  /*Cálculo de Precio de 4*/
  /*Cálculo de Precio de 4*/
  /*Cálculo de Precio de 4*/
  calcularPrecioBase4()
  {
    let porcentaje_iva = (this.bpv4 * this.iva) / 100;
    this.pv4 = redondeardecimales((parseFloat(this.bpv4) + porcentaje_iva), 2);
  }

  calcularPrecioVenta4()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let bpv4 = parseFloat(this.pv4) / porcentaje_iva;
    this.bpv4 = bpv4.toFixed(6);
  }

  calcularUtilidad4()
  {
    let iva = this.iva;
    let iva2=iva;
    iva = iva/100;

    let total_normal = (this.costo_base * this.utilidad)/100;
    let bpv4 = parseFloat(this.costo_base) + total_normal;
    this.bpv4 = bpv4.toFixed(6);
    let pv4 = bpv4 + (bpv4 * iva);
    this.pv4 = redondeardecimales(pv4, 2);
  }

  changeChkAutomatico4()
  {
    if(this.apv4==1){
      this.apv4 = 0;
    }else{
      this.apv4 = 1;
    }
  }
  /*Cálculo de Precio de 4*/
  /*Cálculo de Precio de 4*/
  /*Cálculo de Precio de 4*/

  /*Cálculo de Precio de 5*/
  /*Cálculo de Precio de 5*/
  /*Cálculo de Precio de 5*/
  calcularPrecioBase5()
  {
    let porcentaje_iva = (this.bpv5 * this.iva) / 100;
    this.pv5 = redondeardecimales((parseFloat(this.bpv5) + porcentaje_iva), 2);
  }

  calcularPrecioVenta5()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let bpv5 = parseFloat(this.pv5) / porcentaje_iva;
    this.bpv5 = bpv5.toFixed(6);
  }

  calcularUtilidad5()
  {
    let iva = this.iva;
    let iva2=iva;
    iva = iva/100;

    let total_normal = (this.costo_base * this.utilidad)/100;
    let bpv5 = parseFloat(this.costo_base) + total_normal;
    this.bpv5 = bpv5.toFixed(6);
    let pv5 = bpv5 + (bpv5 * iva);
    this.pv5 = redondeardecimales(pv5, 2);
  }

  changeChkAutomatico5()
  {
    if(this.apv5==1){
      this.apv5 = 0;
    }else{
      this.apv5 = 1;
    }
  }
  /*Cálculo de Precio de 5*/
  /*Cálculo de Precio de 5*/
  /*Cálculo de Precio de 5*/

  /*Cálculo de Precio de 6*/
  /*Cálculo de Precio de 6*/
  /*Cálculo de Precio de 6*/
  calcularPrecioBase6()
  {
    let porcentaje_iva = (this.bpv6 * this.iva) / 100;
    this.pv6 = redondeardecimales((parseFloat(this.bpv6) + porcentaje_iva), 2);
  }

  calcularPrecioVenta6()
  {
    let porcentaje_iva = (this.iva/100) + 1;
    let bpv6 = parseFloat(this.pv6) / porcentaje_iva;
    this.bpv6 = bpv6.toFixed(6);
  }

  calcularUtilidad6()
  {
    let iva = this.iva;
    let iva2=iva;
    iva = iva/100;

    let total_normal = (this.costo_base * this.utilidad)/100;
    let bpv6 = parseFloat(this.costo_base) + total_normal;
    this.bpv6 = bpv6.toFixed(6);
    let pv6 = bpv6 + (bpv6 * iva);
    this.pv6 = redondeardecimales(pv6, 2);
  }

  changeChkAutomatico6()
  {
    if(this.apv6==1){
      this.apv6 = 0;
    }else{
      this.apv6 = 1;
    }
  }
  /*Cálculo de Precio de 6*/
  /*Cálculo de Precio de 6*/
  /*Cálculo de Precio de 6*/

  listarExistenciasProducto()
  {    
    this.loadingform = true;
    

    this.datosexistencias = [];

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {

      for (let item of data){
        let cod_existencias = this.cod_producto + "_" + item.cod_sucursal;

        let sucursal = {
            habilitar : false,
            cod_existencias : cod_existencias,
            cod_sucursal : item.cod_sucursal,
            sucursal : item.sucursal,
            cantidad_denominacion : "0",
            total_unidades : "0",
            ajustar_existencia : "0",
            existencia : "0"
        }
        
        this.datosexistencias.push(sucursal);
      }

      this.listarExistenciasProducto2();

      this.loadingform = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }

  listarExistenciasProducto2()
  {    
    this.loadingform = true;
    
    //this.datosexistencias = [];


    this.existenciaservice.listarExistenciasProducto(this.cod_producto).subscribe( (data : any) =>
    {
      //console.log(data);

      for (let item of data)
      {
        let cod_sucursal = item.cod_sucursal;
        if(this.fraccionado == "SI")
        {
          item.total_unidades = this.unidades_denominacion * item.cantidad_denominacion;
        }

        this.datosexistencias.map(function(dato){
          if(dato.cod_sucursal == cod_sucursal){
            
            let habilitar = true;

            dato.habilitar = habilitar,
            dato.cod_existencias = item.cod_existencias,
            dato.cod_sucursal = item.cod_sucursal,
            dato.sucursal = item.sucursal,
            dato.cantidad_denominacion = item.cantidad_denominacion,
            dato.total_unidades = item.total_unidades,
            dato.ajustar_existencia = "0",
            dato.existencia = item.existencia
          }
          
          return dato;
        });
       
      }
      //console.log(this.datosexistencias);

      this.loadingform = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }

  originarCodigo()
  {
    this.codigo = this.cod_producto;
  }

}