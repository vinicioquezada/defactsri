import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { ProductoService } from '../../services/producto.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ActivatedRoute } from '@angular/router';
import { FormulaService } from '../../services/formula.service';
import * as moment from 'moment';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { lastValueFrom } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {
  datostarifa : any;

  multisucursal : string = "0";
  datossucursal : any;
  cod_sucursal : string = "";

  cod_formula: string = "";
  cod_producto : string = "";
  cod_producto_anterior : string = "";
  descripcion : string = "";
  codigo_barra : string = "";
  codigo : string = "";
  subcategoria: string = "";
  marca: string = "";
  unidad_medida: string = "";
  fecha_registro: string = "";

  loadinglistado : boolean = false;

  sucursal: string = "";

  datos : any;
  filterpost = "";
  pagelistado = 1;
  pagesizelistado = 5;
  cantidad_registros : number = 0;

  datoselaboracion : any;
  filterpostingrediente = "";
  pagelistadoingrediente = 1;
  pagesizelistadoingrediente = 10;

  itemproducto: any = {};
  datosformula : any = [];
  cantidad_unidad : number = 1;
  cantidad_elaboracion : number = 1;
  cantidad_formula : number = 1;
  tipoformula : number = 1;
  tipo_formulario: string = "";

  constructor(private toastr : ToastrService, private error : ErrorService, private usersession: UserSessionService, private productoservice: ProductoService, private swalservice: SwalService, private rutaActiva: ActivatedRoute, private formulaservice: FormulaService,private bodyStyleService: BodyStyleService, private location: Location) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }

  keyFiltrado()
  {
    this.pagelistado = 1;
  }

  keyFiltradoIngrediente()
  {
    this.pagelistadoingrediente = 1;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal(): void
  {
    this.codigo_barra = "";
    this.codigo = "";
    this.cod_producto = "";
    this.descripcion = "";
    this.subcategoria = "";
    this.marca = "";
    
    this.datostarifa = [];
    this.listarProductos();

    this.itemproducto = {};
    this.datosformula = [];
    this.cantidad_unidad = 1;
    this.cantidad_elaboracion = 1;
    this.cantidad_formula = 1;

    if(this.tipo_formulario == "nuevoregistro")
    {
        this.cod_formula = moment().unix().toString();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.cod_formula = this.rutaActiva.snapshot.paramMap.get("cod_formula")!;
        this.buscarFormula();
      }
    }

    
  }

  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  agregar(item: any)
  {
    this.buscarProductoFormula(item);
  }

  actualizarListadoProducto()
  {
    this.listarProductos();
  }

  buscarCodigoProducto()
  {
    const resultado = this.datos.find( (valor : any) => valor.codigo_producto == this.codigo_barra );
    if(resultado)
    {
      this.agregar(resultado);
    }
    else
    {
      this.toastr.warning("No existe producto con el codigo de barra ingresado", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickListarProductos()
  {
    this.pagelistado = 1;
    this.filterpost="";
    $("#mymodallistarproductos").modal("show");
  }
  
  listarProductos()
  {
    this.pagelistado = 1;
    this.filterpost = "";
    this.datos = [];
    this.pagelistadoingrediente = 1;
    this.filterpostingrediente = "";
    this.datoselaboracion = [];
    this.loadinglistado = true;
    this.cantidad_registros = 0;
    this.productoservice.listarProductosInventarios(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
      this.datoselaboracion = data;
      this.cantidad_registros = data.length;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  handlePageChangeListado(event: number): void {
    this.pagelistado = event;
  }

  handlePageChangeListadoIngrediente(event: number): void {
    this.pagelistadoingrediente = event;
  }
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/

  async clickAgregarElaboracion(item: any)
  {
    if(this.cod_producto=="")
    {
      const ok = await this.swalservice.alertOkRequerido({
        title: "Control del Sistema",
        text: 'Debe seleccionar un producto a elaborar primero para continuar con la fórmula'
      });
    }
    else
    {
      this.itemproducto = item;
      this.tipoformula = 1;
      this.cantidad_unidad = 1;
      this.cantidad_formula = 1;
      this.cantidad_elaboracion = 1;
      $("#mymodalagregarformula").modal("show");
    }
  }

  async agregarElaboracion()
  {
    //console.log(this.itemproducto);
    if(this.cantidad_formula == 0 || this.cantidad_elaboracion == 0)
    {
      const ok = await this.swalservice.alertOkRequerido({
        title: "Control del Sistema",
        text: 'Debe ingresar un valor para continuar con la fórmula'
      });
    }
    else
    {
      let producto = {
          cod_producto_detalle: this.itemproducto.cod_producto,
          descripcion: this.itemproducto.descripcion,
          codigo: this.itemproducto.codigo,
          subcategoria: this.itemproducto.subcategoria,
          cantidad_formula: this.cantidad_formula
      }

      this.datosformula.push(producto);
      $("#mymodalagregarformula").modal("hide");
    }
  }

  eliminarItemPorId(cod_producto: number) {
    this.datosformula = this.datosformula.filter(item => item.cod_producto_detalle != cod_producto);
  }

  calcularFormula()
  {
    this.cantidad_formula = this.cantidad_unidad / this.cantidad_elaboracion;
  }

  clickVerificar()
  {
    this.verificaDetalles();
  }

  async verificaDetalles()
  {
    if(this.datosformula.length>0)
    {
      if(this.tipo_formulario == "nuevoregistro")
      {           
        const ok = await this.swalservice.alertConfirmRequerido({
          title: 'Guardar Registro de Fórmula',
          text: '¿Estás seguro de almacenar registro?',
          icon: 'info',
          confirmText: 'Sí, Almacenar',
          cancelText: 'No, Cerrar'
        });

        if (ok) {
          this.guardar();
        }
        
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro")
        {
          const ok = await this.swalservice.alertConfirmRequerido({
            title: 'Actualizar Registro de Fórmula',
            text: '¿Estás seguro de actualizar registro?',
            icon: 'info',
            confirmText: 'Sí, Actualizar',
            cancelText: 'No, Cerrar'
          });

          if (ok) {
            this.actualizar();
          }
        }
      }
    }
    else
    {
      const ok = await this.swalservice.alertOkRequerido({
        title: "Control del Sistema",
        icon: "warning",
        text: "No tienes valores en tabla de datos de fórmula para almacenar"
      });
    }
  }

  guardar()
  {
    this.swalservice.iniciarLoading("Almacenando...");

    const parametros = {
      'cod_formula' : this.cod_formula,
      'cod_producto' : this.cod_producto,
      'detalles' : this.datosformula
    };
    
    this.formulaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.formularioNormal();
        this.datoselaboracion = [];
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  async buscarFormula()
  {
    try
    {
      this.swalservice.iniciarLoading("Buscando...");

      let data: any = await lastValueFrom(this.formulaservice.buscar(this.cod_formula));

      this.cod_producto_anterior = data[0].cod_producto;
      this.cod_producto = data[0].cod_producto;
      this.descripcion = data[0].descripcion_producto;
      this.codigo = data[0].codigo_barra;
      this.subcategoria = data[0].subcategoria_producto;
      this.marca = data[0].marca_producto;

      data.forEach(element => {
        let detalle = {
          cod_producto_detalle : element.cod_producto_detalle,
          descripcion : element.descripcion,
          codigo : element.codigo,
          subcategoria : element.subcategoria,
          cantidad_formula : element.cantidad_formula
          }
          this.datosformula.push(detalle);
      });
   
      this.swalservice.close();
    } catch (err) {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  actualizar()
  {
    this.swalservice.iniciarLoading("Actualizando...");

    const parametros = {
      'cod_formula' : this.cod_formula,
      'cod_producto_anterior' : this.cod_producto_anterior,
      'cod_producto' : this.cod_producto,
      'detalles' : this.datosformula
    };
    
    this.formulaservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.formularioNormal();
        this.datoselaboracion = [];
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  async buscarProductoFormula(item: any)
  {
    this.swalservice.iniciarLoading("Verificando...");
    this.cod_producto = item.cod_producto;
    this.formulaservice.buscarProductoFormula(this.cod_producto).subscribe( async (data : any) =>
    {
      if (data.cod_producto == false)
      {
          $("#mymodallistarproductos").modal("hide");
          this.codigo = item.codigo;
          this.descripcion = item.descripcion;
          this.subcategoria = item.subcategoria;
          this.marca = item.marca;
          this.unidad_medida = item.unidad_medida;
      }
      else
      {
          await this.swalservice.alertOkNoRequerido({
            title: "Control del Sistema",
            icon: "warning",
            text: "Producto ya tiene registro de fórmula"
          });
      }

      this.swalservice.close();
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
  });
  }

  goBack(){
    this.location.back();
  }

}