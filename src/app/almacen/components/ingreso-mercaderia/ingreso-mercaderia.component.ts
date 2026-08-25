import { Component, OnInit, ViewChild} from '@angular/core';
import { DetalleProductosComponent } from 'src/app/shared/components/detalle-productos/detalle-productos.component';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { IngresoMercaderiaService } from '../../services/ingreso-mercaderia.service';
import { TipoIngresoMercaderiaService } from '../../services/tipo-ingreso-mercaderia.service';
import * as moment from 'moment';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ListadoProductoIngresosComponent } from 'src/app/shared/components/listado-producto/listado-producto-ingresos/listado-producto-ingresos.component';

@Component({
  selector: 'app-ingreso-mercaderia',
  templateUrl: './ingreso-mercaderia.component.html',
  styleUrls: ['./ingreso-mercaderia.component.css']
})
export class IngresoMercaderiaComponent implements OnInit {
  multisucursal : string = "0";
  kardex : string = "";
  @ViewChild(DetalleProductosComponent) childdetalleproducto!: DetalleProductosComponent;
  @ViewChild( ListadoProductoIngresosComponent) childlistadoproductoingresos!: ListadoProductoIngresosComponent;

  datostipoingresomercaderia : any;

  disabledbtnnuevo : boolean = false;
  disabledbtnguardar : boolean = true;

  disabledtxtcodigobarra : boolean = true;
  disabledbtnlistarproducto : boolean = true;

  disabledtxt : boolean = true;

  cod_sucursal : string = "";
  sucursal : string = "";

  codigo_barra : string = "";

  cod_ingreso_mercaderia : string = "";
  numero_ingreso : string = "";
  cod_tipo_ingreso_mercaderia : string = "";
  tipo_ingreso_mercaderia : string = "";
  fecha_registro : string = "";
  descripcion : string = "";

  flagtipoingresomercaderia : boolean = false;
  flagfechaingresomercaderia : boolean = false;
  flagdescripcion : boolean = false;

  loading : boolean = false;
  
  tipo_formulario: string = "";

  detallesactualizar : any = [];

  constructor(private ingresomercaderiaservice:IngresoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private tipoingresomercaderiaservice:TipoIngresoMercaderiaService, private sucursalesservice:SucursalesService, private rutaActiva: ActivatedRoute, private location: Location, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private swalservice: SwalService) {}

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");

    if(this.tipo_formulario == "nuevoregistro")
      {
        this.formularioNormal();
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "visualizarregistro")
        {
          this.formularioNormal();
        }
      }
      this.bodyStyleService.resetBodyStyles();
  }

  ngAfterViewInit(): void {
    this.childdetalleproducto.datosdetalles = [];
    this.childdetalleproducto.tipo_formulario = this.tipo_formulario;
  }

  clickNuevo()
  {
    this.loading = true;
    const result = this.childlistadoproductoingresos.listarProductosIngresos(this.cod_sucursal).then();
      result.then(() => {
        this.loading = false;
        this.habilitarFormulario();
        this.childdetalleproducto.datosdetalles = [];
        this.cod_ingreso_mercaderia = moment().unix().toString() + "3" + this.usersession.getConfiguracion("cod_sucursal") + this.usersession.getConfiguracion("numero_empleado");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
  }

  clickVerificar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.verificaDetalles();
    }
  }

  async clickVerificarEncabezado()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        const ok = await this.swalservice.alertConfirmRequerido({
          title: 'Actualizar Registro de Encabezado de Ingreso de Mercadería',
          text: '¿Estás seguro de actualizar registro?',
          icon: 'info',
          confirmText: 'Sí, Actualizar',
          cancelText: 'No, Cerrar'
        });

        if (ok) {
          this.actualizarEncabezado();
        }
      }
    }
  }


  async verificaDetalles()
  {
    if(this.childdetalleproducto.datosdetalles.length>0)
      {
        let fila_error = false;
        for (let c = 0; c< this.childdetalleproducto.datosdetalles.length; c++)
        {
          if(this.childdetalleproducto.datosdetalles[c].fila_error == true)
          {
            fila_error = true;
            break;
          }
        }
        
        if(fila_error)
        {
          this.toastr.warning("Hay una o más filas pendientes de cualcular, no debe estar la fila de color rojo", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          if(this.tipo_formulario == "nuevoregistro")
          {           
            const ok = await this.swalservice.alertConfirmRequerido({
              title: 'Guardar Registro de Ingreso de Mercadería',
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
                title: 'Actualizar Registro de Ingreso de Mercadería',
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
      }
      else
      {
        this.toastr.warning("No hay ningun registro en la tabla para almacenar", "INFORMACIÓN DEL SISTEMA");
      }
  }

  clickListarProductos()
  {
    this.childlistadoproductoingresos.page = 1;
    this.childlistadoproductoingresos.filterpost="";
    $("#mymodallistarproductos").modal("show");
    setTimeout(()=>{
      this.childlistadoproductoingresos.txtfilterpost.nativeElement.focus();
    },500);
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductoingresos.page = 1;
    this.childlistadoproductoingresos.filterpost="";
    this.loading = true;
    const result = this.childlistadoproductoingresos.listarProductosIngresos(this.cod_sucursal).then();
      result.then(() => {
        this.loading = false;
        this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
  }

  changeTipoIngresoMercaderia(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_ingreso_mercaderia = elemento;
  }

  recibirDatosProducto(datosrecibidosproducto: any)
  {
    this.childdetalleproducto.enfocar = true;
    this.childdetalleproducto.datosdetalles.push(datosrecibidosproducto);
  }
  
  buscarCodigoProducto()
  {
    let comodin = this.codigo_barra.substr(-1);
    if(comodin=="*")
    {
      this.childlistadoproductoingresos.page = 1;
      this.childlistadoproductoingresos.filterpost= this.codigo_barra.slice(0, -1);
      $("#mymodallistarproductos").modal("show");
      setTimeout(()=>{
        this.childlistadoproductoingresos.txtfilterpost.nativeElement.focus();
      },500);
    }
    else
    {
      this.childlistadoproductoingresos.buscarcodigoproductoingresos(this.codigo_barra);
    }
    this.codigo_barra = "";
  }

  formularioNormal()
  {
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.fecha_registro = moment().format('YYYY-MM-DD');

      this.disabledbtnnuevo = false;
      this.disabledbtnguardar = true;
  
      this.disabledtxtcodigobarra = true;
      this.disabledbtnlistarproducto = true;
  
      this.disabledtxt = true;
  
      this.codigo_barra = "";
  
      this.numero_ingreso = "Automático";
      this.cod_tipo_ingreso_mercaderia = "0";
      this.tipo_ingreso_mercaderia = "";
      this.descripcion = "INGRESO";
  
      this.loading = false;

      this.flagNormal();
      this.listarTipoIngresomercaderia();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "visualizarregistro")
      {
        this.disabledtxtcodigobarra = false;
        this.disabledbtnlistarproducto = false;
        this.disabledtxt = false;
        this.detallesactualizar = [];
        this.cod_ingreso_mercaderia = this.rutaActiva.snapshot.paramMap.get("cod_ingreso_mercaderia")!;
        this.flagNormal();
        this.listarTipoIngresomercaderia();
        this.buscaringresomercaderia();
      }
    }
  }

  buscaringresomercaderia()
  {
    this.loading = true;
    
    this.ingresomercaderiaservice.buscarIngresoMercaderia(this.cod_ingreso_mercaderia).subscribe( (data : any) =>
    {
      this.numero_ingreso = data[0].numero_ingreso;
      this.cod_tipo_ingreso_mercaderia = data[0].cod_tipo_ingreso_mercaderia;
      this.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD HH:mm:ss');
      this.cod_sucursal = data[0].cod_sucursal;
      this.sucursal = data[0].sucursal;
      this.descripcion = data[0].descripcion;
      this.detallesactualizar = [];
      data.forEach(element => {
        let descripcion = element.detalle;
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          //inventario : resultado.inventario,
          cantidad_comprar : element.cantidad_comprar,
          cantidad_paquete : element.cantidad_empaque,
          cantidad_ajuste : element.cantidad_ajuste,
          descripcion : descripcion,
          cantidad_unidad : element.cantidad_unidad,
          porcentaje_ice : element.ice,
          porcentaje_iva : element.iva,
          costo_base : element.costo_base,//Solo se cambia aquí
          costo : element.costo,
          unidades_denominacion : element.unidades_denominacion,
          formula : element.formula,
          modificable : 0,
          id_detalle_ingreso_mercaderia : element.id_detalle_ingreso_mercaderia
        }
        this.childdetalleproducto.datosdetalles.push(detalle);
        this.detallesactualizar.push(detalle);
      });

      this.childlistadoproductoingresos.listarProductosIngresos(this.cod_sucursal);
      this.childdetalleproducto.cod_ingreso_mercaderia = this.cod_ingreso_mercaderia;

      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  verificarCampos()
  {
    let valor : Boolean = false;
    this.flagNormal();
    if(this.cod_tipo_ingreso_mercaderia=="0")
    {
      this.flagtipoingresomercaderia=true;
      valor=true;
    }

    if(this.fecha_registro.length == 0)
    {
      this.flagfechaingresomercaderia=true;
      valor=true;
    }

    if(this.descripcion.length == 0)
    {
      this.flagdescripcion = true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagtipoingresomercaderia = false;
    this.flagfechaingresomercaderia = false;
    this.flagdescripcion = false;
  }

  habilitarFormulario()
  {
    this.disabledbtnnuevo = true;
    this.disabledbtnguardar = false;

    this.disabledtxtcodigobarra = false;
    this.disabledbtnlistarproducto = false;

    this.disabledtxt = false;
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.childdetalleproducto.datosdetalles = [];
  }

  listarTipoIngresomercaderia()
  {    
    this.loading = true;
    

    this.tipoingresomercaderiaservice.listarTipoIngresoMercaderias().subscribe( (data : any) =>
    {
      let tipo_ingreso_mercaderia = {
        "cod_tipo_ingreso_mercaderia" : "0",
        "tipo_ingreso_mercaderia" : "SELECCIONE"
      };

      this.datostipoingresomercaderia = data;

      this.datostipoingresomercaderia.unshift(tipo_ingreso_mercaderia);
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  guardar()
  {
    this.swalservice.iniciarLoading("Almacenando...");

    const parametros = {
      'cod_ingreso_mercaderia' : this.cod_ingreso_mercaderia,
      'fecha_hora' : this.fecha_registro,
      'cod_sucursal' : this.cod_sucursal,
      'cod_tipo_ingreso_mercaderia' : this.cod_tipo_ingreso_mercaderia,
      'descripcion' :this.descripcion,
      'kardex' : this.kardex,
      'detalles' : this.childdetalleproducto.datosdetalles
    };
    //console.log(parametros);
    
    this.ingresomercaderiaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.formularioNormal();
        this.childdetalleproducto.datosdetalles = [];
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Ingreso de mercadería no se pudo registrar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  actualizar()
  {    
   this.swalservice.iniciarLoading("Actualizando...");

    const parametros = {
      'cod_ingreso_mercaderia' : this.cod_ingreso_mercaderia,
      'numero_ingreso' :this.numero_ingreso,
      'fecha_hora' :this.fecha_registro,
      'cod_sucursal' :this.cod_sucursal,
      'cod_tipo_ingreso_mercaderia' : this.cod_tipo_ingreso_mercaderia,
      'descripcion' :this.descripcion,
      'detalles' : this.childdetalleproducto.datosdetalles,
      'detallesactualizar' : this.detallesactualizar
    };
    //console.log(parametros);
    
    this.ingresomercaderiaservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      
      if (data.estado == true)
      {
        this.formularioNormal();
        this.childdetalleproducto.datosdetalles = [];
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
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

  actualizarEncabezado()
  {    
    this.swalservice.iniciarLoading("Actualizando...");

    const parametros = {
      'cod_ingreso_mercaderia' : this.cod_ingreso_mercaderia,
      'numero_ingreso' :this.numero_ingreso,
      'fecha_hora' :this.fecha_registro,
      'cod_sucursal' :this.cod_sucursal,
      'cod_tipo_ingreso_mercaderia' : this.cod_tipo_ingreso_mercaderia,
      'descripcion' :this.descripcion
    };
    //console.log(parametros);
    
    this.ingresomercaderiaservice.actualizarEncabezado(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      
      if (data.estado == true)
      {
        this.toastr.success("Registro de Encabezado Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar el registro de Encabezado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  goBack(){
    this.location.back();
  }

}