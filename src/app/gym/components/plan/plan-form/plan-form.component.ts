import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { PlanService } from 'src/app/gym/services/plan.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ExistenciasService } from 'src/app/almacen/services/existencias.service';
import { IvaService } from 'src/app/almacen/services/iva.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../../shared/js/decimales.js';
declare var $:any;
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { lastValueFrom } from 'rxjs';
import { ActividadService } from 'src/app/gym/services/actividad.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";

  precios_completos : string = "0";

  datosexistencias : any = [];
  
  datostipoproducto : any;
  datosinventario : any;
  datosfraccionado : string[] = ["SI", "NO"];
  datossubcategoria : any;
  datosmarca : any;
  datosunidadmedida : any;
  datosivacompra : any;
  datosiva : any;
  datosdenominacion : any;

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
  precio_base : any = 0;
  utilidad : any = 0;
  precio_venta : any = 0;
  precio_base_minimo : any = 0;
  precio_venta_minimo : any = 0;

  chklunes : boolean = true;
  chkmartes : boolean = true;
  chkmiercoles : boolean = true;
  chkjueves : boolean = true;
  chkviernes : boolean = true;
  chksabado : boolean = true;
  chkdomingo : boolean = true;
  determinacion_mensual : string = "1";
  hora_inicio : string = "00:00";
  hora_fin : string = "23:59";
  observacion : string = "23:59";
  chkgrupal : boolean = false;
  cantidad_grupo: number = 1;
  chkcompartido : boolean = true;
  
  flagocultarboton : boolean = false;
  
  flagcodigo : boolean = false;
  flagdeterminacionmensual : boolean = false;
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


  ban : number = 0;
  codigotemporal : string = "";
  
  loadingform : boolean = false;

  cantidad_registros : number = 0;

  datosactividad : any = [];
  datosactividades: any = [];
  cod_sucursal : string = "";
  chkactividad: boolean = false;

  monitor_actividades: string = "";

  constructor(private productoservice:ProductoService, private toastr: ToastrService, private error:ErrorService, private ivaservice:IvaService, private sucursalesservice:SucursalesService, private existenciaservice:ExistenciasService, private planservice : PlanService, private usersession: UserSessionService, private actividadservice:ActividadService, private swalservice: SwalService) {
  }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.precios_completos = this.usersession.getConfiguracion("precios_completos");
    this.monitor_actividades = this.usersession.getConfiguracion("monitor_actividades");
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
    
    this.cargarCombos();
  }

  async cargarCombos()
  {
    await this.formularioNormal();
    this.cargarListas();
  }

  changeTipoProducto(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_producto = elemento;
  }

  changeInventario(event: any): void {
    const elemento = event.target.value;
    this.codigo_inventario = elemento;
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

  changeSubCategoria(event: any): void {
    const elemento = event.target.value;
    this.cod_subcategoria = elemento;
    const resultado = this.datossubcategoria.find( (valor : any) => valor.cod_subcategoria == elemento );
    this.cod_subcategoria = resultado.cod_subcategoria;
  }

  changeIva(event: any): void {
    const elemento = event.target.value;
    this.id_iva = elemento;
    const resultado = this.datosiva.find( (valor : any) => valor.id_iva == elemento );
    this.iva = resultado.iva;
    this.calcularPrecioVenta();
  }

  changeHabilitar(index: number): void {
    if(this.datosexistencias[index].habilitar==true){
      this.datosexistencias[index].habilitar = false;
    }else{
      this.datosexistencias[index].habilitar = true;
    }
  }

  changeChkGrupal()
  {
    if(this.chkgrupal==true){
      this.chkgrupal = false;
      this.cantidad_grupo = 1;
    }else{
      this.chkgrupal = true;
    }
  }

  changeChkCompartido()
  {
    if(this.chkcompartido==true){
      this.chkcompartido = false;
    }else{
      this.chkcompartido = true;
    }
  }

  changeChkActividad()
  {
    if(this.chkactividad==true){
      this.chkactividad = false;
    }else{
      this.chkactividad = true;
      this.listarActividades();
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
    
    //console.log(this.datosexistencias[index].ajustar_existencia);
    //console.log(this.datosexistencias[index].total_unidades);
    //console.log(this.datosexistencias);
    this.datosexistencias[index].existencia = existencia;
  }

  changechklunes(): void {
    if(this.chklunes==true){
      this.chklunes = false;
    }else{
      this.chklunes = true;
    }
  }

  changechkmartes(): void {
    if(this.chkmartes==true){
      this.chkmartes = false;
    }else{
      this.chkmartes = true;
    }
  }

  changechkmiercoles(): void {
    if(this.chkmiercoles==true){
      this.chkmiercoles = false;
    }else{
      this.chkmiercoles = true;
    }
  }

  changechkjueves(): void {
    if(this.chkjueves==true){
      this.chkjueves = false;
    }else{
      this.chkjueves = true;
    }
  }

  changechkviernes(): void {
    if(this.chkviernes==true){
      this.chkviernes = false;
    }else{
      this.chkviernes = true;
    }
  }

  changechksabado(): void {
    if(this.chksabado==true){
      this.chksabado = false;
    }else{
      this.chksabado = true;
    }
  }

  changechkdomingo(): void {
    if(this.chkdomingo==true){
      this.chkdomingo = false;
    }else{
      this.chkdomingo = true;
    }
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
        if(this.codigo==this.codigotemporal)
        {
          await this.actualizar();
        }
        else
        {
          await this.buscar();
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

    if(this.determinacion_mensual.length==0)
    {
      this.flagdeterminacionmensual=true;
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
    this.flagdeterminacionmensual=false;
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
        this.toastr.warning("Código plan se encuentra registrado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
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
      'precio_base_minimo' : this.precio_base_minimo,
      'precio_venta_minimo' : this.precio_venta_minimo,
      'id_iva_compra' : this.id_iva_compra,
      'costo_base' : this.costo_base,
      'costo' : this.costo,
      'utilidad' : this.utilidad,
      'precio_base' : this.precio_base,
      'precio_venta' : this.precio_venta,
      'stock_minimo' : this.stock_minimo,
      'cod_tipo_producto' : this.cod_tipo_producto,
      'inventario' : this.codigo_inventario,
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
      'determinacion_mensual' : this.determinacion_mensual,
      'lunes' : this.chklunes,
		  'martes' : this.chkmartes,
		  'miercoles' : this.chkmiercoles,
		  'jueves' : this.chkjueves,
		  'viernes' : this.chkviernes,
      'sabado' : this.chksabado,
      'domingo' : this.chkdomingo,
      'hora_inicio' : this.hora_inicio,
      'hora_fin' : this.hora_fin,
      'grupal' : this.chkgrupal,
      'cantidad_grupo' : this.cantidad_grupo,
      'compartido' : this.chkcompartido,
      'observacion' : this.observacion,
      'actividad' : this.chkactividad,
      'actividades' : this.datosactividades
    };

    let data: any = await lastValueFrom(this.planservice.guardarPlan(parametros));
    
    if (data.estado == true)
    {
      this.formularioNormal();
      this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      this.datosenvio.emit();
    }
    else
    {
      const ok = await this.swalservice.alertError("Registro no se pudo Almacenar, vuelva a intertarlo por favor");
    }
  }
  
  async actualizar()
  {
    const parametros = {
      'cod_producto' : this.cod_producto,
      'codigo' :this.codigo,
      'descripcion' : this.descripcion,
      'cod_subcategoria' : this.cod_subcategoria,
      'cod_marca' : this.cod_marca,
      'cod_unidad_medida' : this.cod_unidad_medida,
      'id_iva' : this.id_iva,
      'precio_base_minimo' : this.precio_base_minimo,
      'precio_venta_minimo' : this.precio_venta_minimo,
      'id_iva_compra' : this.id_iva_compra,
      'costo_base' : this.costo_base,
      'costo' : this.costo,
      'utilidad' : this.utilidad,
      'precio_base' : this.precio_base,
      'precio_venta' : this.precio_venta,
      'stock_minimo' : this.stock_minimo,
      'cod_tipo_producto' : this.cod_tipo_producto,
      'inventario' : this.codigo_inventario,
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
      'determinacion_mensual' : this.determinacion_mensual,
      'lunes' : this.chklunes,
		  'martes' : this.chkmartes,
		  'miercoles' : this.chkmiercoles,
		  'jueves' : this.chkjueves,
		  'viernes' : this.chkviernes,
      'sabado' : this.chksabado,
      'domingo' : this.chkdomingo,
      'hora_inicio' : this.hora_inicio,
      'hora_fin' : this.hora_fin,
      'observacion' : this.observacion,
      'grupal' : this.chkgrupal,
      'cantidad_grupo' : this.cantidad_grupo,
      'compartido' : this.chkcompartido,
      'actividad' : this.chkactividad,
      'actividades' : this.datosactividades
    };

    let data: any = await lastValueFrom(this.planservice.actualizarPlan(parametros));

    if (data.estado == true)
    {
      this.formularioNormal();
      this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
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
    this.cod_tipo_producto="2";
    this.codigo="";
    this.codigo_adicional="";
    this.codigo_adicional1="";
    this.cod_subcategoria = "";

    this.descripcion ="";
    this.codigo_percha="";
    
    this.codigo_inventario = "0";
    this.cod_marca = "1";//N/A
    this.cod_unidad_medida = "1";//N/A
    this.stock_minimo = "0";
    this.fraccionado = "NO";
    this.cod_denominacion = "0";
    this.denominacion = "NA";
    this.unidades_denominacion = 0;
    this.id_iva = 0;
    this.iva = 0;
    this.id_iva_compra = 1;
    this.iva_compra = 0;
    this.costo_base = 0;
    this.costo = 0;
    this.precio_base = 0;
    this.utilidad = 0;
    this.precio_venta = 0;
    this.precio_base_minimo = 0;
    this.precio_venta_minimo = 0;

    this.chklunes = true;
    this.chkmartes = true;
    this.chkmiercoles = true;
    this.chkjueves = true;
    this.chkviernes = true;
    this.chksabado = true;
    this.chkdomingo = true;
    this.determinacion_mensual = "1";
    this.hora_inicio = "00:00";
    this.hora_fin = "23:59";
    this.observacion = "";
    this.chkgrupal = false;
    this.cantidad_grupo = 1;
    this.chkcompartido = true;
    this.chkactividad = false;
    this.datosactividades = [];
    
    this.flagocultarboton = false;

    this.flagNormal();

    
  
    this.codigotemporal="";
    
    this.ban=0;

    //this.datosexistencias = [];
  }

  cargarListas()
  {
    this.listarSubCategorias();
    this.listarIva();
  }

  listarSubCategorias()
  {
    this.datossubcategoria = [];
    this.loadingform = true;
    

    this.planservice.listarSubcategoriasPlanActivo().subscribe( (data : any) =>
    {
      this.loadingform = false;

      let subcategoria = {
        "cod_subcategoria" : "",
        "subcategoria" : "SELECCIONE SUBCATEGORIA"
      }
      
      this.datossubcategoria.push(subcategoria);

      data.forEach(element => {
        let subcategoria = {
          "cod_subcategoria" : element.cod_subcategoria,
          "subcategoria" : element.subcategoria
        }
        this.datossubcategoria.push(subcategoria);
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
          "iva" : element.iva
        }
        this.datosiva.push(iva);
      });
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  async buscarProducto(): Promise<any>
  {
      this.loadingform = true;
      try
      {
        const data: any = await lastValueFrom(this.planservice.buscarPlan(this.cod_producto));
        this.loadingform = false;
        this.codigo = data.codigo;
        this.cod_tipo_producto = data.cod_tipo_producto;
        this.codigo_adicional = data.codigo_adicional;
        this.codigo_adicional1 = data.codigo_adicional1;
        this.descripcion = data.descripcion;
        this.cod_subcategoria = data.cod_subcategoria;
        this.cod_marca = data.cod_marca;
        this.cod_unidad_medida = data.cod_unidad_medida;
        this.stock_minimo = data.stock_minimo;
        this.codigo_inventario = data.inventario;
        this.codigo_percha = data.codigo_percha;
        this.id_iva_compra = data.id_iva_compra;
        this.iva_compra = data.iva_compra;
        this.costo_base = data.costo_base;
        this.costo = data.costo;
        this.id_iva = data.id_iva;
        this.iva = data.iva;
        this.precio_base = data.precio_base;
        this.precio_venta = data.precio_venta;
        this.precio_base_minimo = data.precio_base_minimo;
        this.precio_venta_minimo = data.precio_venta_minimo;
        this.fraccionado = data.fraccionado;
        this.cod_denominacion = data.cod_denominacion;
        this.denominacion = data.denominacion;
        this.unidades_denominacion = data.unidades_denominacion;
        this.determinacion_mensual = data.determinacion_mensual;
        this.chklunes = data.lunes;
        this.chkmartes = data.martes;
        this.chkmiercoles = data.miercoles;
        this.chkjueves = data.jueves;
        this.chkviernes = data.viernes;
        this.chksabado = data.sabado;
        this.chkdomingo = data.domingo;
        this.hora_inicio = data.hora_inicio;
        this.hora_fin = data.hora_fin;
        this.observacion = data.observacion;
        this.chkgrupal = data.grupal;
        this.cantidad_grupo = data.cantidad_grupo;
        this.chkcompartido = data.compartido;
        this.chkactividad = data.actividad;

        if(data.actividad==1)
        {
          await this.listarActividades();
          this.listarPlanActividad();
        }

        this.listarExistenciasProducto();

        this.flagNormal();
        this.flagocultarboton = true;
        this.codigotemporal=this.codigo;
        this.ban=1;
      }
      catch (err) {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingform = false;
      }
  }

  listarSucursales()
  {    
    this.loadingform = true;
    
    this.datosexistencias = [];

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loadingform = false;
      
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

  listarExistenciasProducto()
  {    
    this.loadingform = true;
    

    this.datosexistencias = [];

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loadingform = false;
      
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
      this.loadingform = false;
      

      for (let item of data)
      {
        let cod_sucursal = item.cod_sucursal;
        let total_unidades = 0;
        if(this.fraccionado == "SI")
        {
          item.total_unidades = this.unidades_denominacion * item.cantidad_denominacion;
        }

        this.datosexistencias.map(function(dato){
          if(dato.cod_sucursal == cod_sucursal){
            
            dato.habilitar = true,
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
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }

  async listarActividades(): Promise<any>
  {
      this.loadingform = true;
      this.datosactividad = [];
      this.datosactividades = [];
      try
      {
        const data: any = await lastValueFrom(this.actividadservice.listarActividades());
        this.datosactividad = data;
        this.loadingform = false;
      }
      catch (err) {
        this.loadingform = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }
  
  listarPlanActividad()
  {    
    this.loadingform = true;
    this.planservice.listarPlanActividad(this.cod_producto).subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datosactividades = data.map(item => item.cod_actividad);
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }
}