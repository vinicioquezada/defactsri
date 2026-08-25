import { Component, OnInit, ViewChild} from '@angular/core';
import { DetalleProductosMovimientosComponent } from 'src/app/shared/components/detalle-productos-movimientos/detalle-productos-movimientos.component';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { MovimientoMercaderiaService } from '../../services/movimiento-mercaderia.service';
import * as moment from 'moment';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ListadoProductoSalidasComponent } from 'src/app/shared/components/listado-producto/listado-producto-salidas/listado-producto-salidas.component';

@Component({
  selector: 'app-movimiento-mercaderia',
  templateUrl: './movimiento-mercaderia.component.html',
  styleUrls: ['./movimiento-mercaderia.component.css']
})
export class MovimientoMercaderiaComponent implements OnInit {
  multisucursal : string = "0";
  kardex : string = "";
  @ViewChild(DetalleProductosMovimientosComponent) childdetalleproductomovimiento: any;
  @ViewChild(ListadoProductoSalidasComponent) childlistadoproductosalidas!: ListadoProductoSalidasComponent;

  datossucursalreceptar : any;

  disabledbtnnuevo : boolean = false;
  disabledbtnguardar : boolean = true;

  disabledtxtcodigobarra : boolean = true;
  disabledbtnlistarproducto : boolean = true;

  disabledtxtfecha : boolean = true;
  disabledtiposalidamercaderia : boolean = true;

  cod_sucursal : string = "";
  sucursal : string = "";

  codigo_barra : string = "";

  cod_movimiento_mercaderia : string = "";
  numero_movimiento : string = "";
  cod_sucursal_receptar : string = "0";
  sucursal_receptar : string = "";
  fecha_registro : string = "";

  flagsucursalreceptar : boolean = false;
  flagfechaingresomercaderia : boolean = false;

  loading : boolean = false;
  loadingalmacenar : boolean = false;
  items = [];
  tipo_formulario: string = "";
  datosproducto : any = [];
  detallesactualizar : any = [];
  control_estricto_movimiento : string = this.usersession.getConfiguracion("control_estricto_movimiento");

  constructor(private movimientomercaderiaservice:MovimientoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private rutaActiva: ActivatedRoute, private location: Location, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private swalservice: SwalService) { }

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
    this.childdetalleproductomovimiento.datosdetalles = [];
    this.childdetalleproductomovimiento.tipo_formulario = this.tipo_formulario;
  }

  clickNuevo()
  {
    this.loading = true;
    const result = this.childlistadoproductosalidas.listarProductosSalidas(this.cod_sucursal).then();
    result.then(() => { 
      this.loading = false;
      this.habilitarFormulario();
      this.childdetalleproductomovimiento.datosdetalles = [];
      this.cod_movimiento_mercaderia = moment().unix().toString() + "7" + this.usersession.getConfiguracion("cod_sucursal") + this.usersession.getConfiguracion("numero_empleado");
      this.datosproducto = this.childlistadoproductosalidas.datosproducto;
    }).catch(() => {
      this.loading = false;
      
      this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
    });
  }

  clickVerificar()
  {
    this.flagNormal();
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.cod_sucursal==this.cod_sucursal_receptar)
      {
        this.toastr.warning("No se puede transferir mercadería a un mismo destino, seleccione otro lugar a transferir", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.verificaDetalles();
      }
    } 
  }

  async verificaDetalles()
  {
    if(this.childdetalleproductomovimiento.datosdetalles.length>0)
    {
      let fila_error = false;
      for (let c = 0; c< this.childdetalleproductomovimiento.datosdetalles.length; c++)
      {
        if(this.childdetalleproductomovimiento.datosdetalles[c].fila_error == true)
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
            title: 'Guardar Registro de Movimiento de Mercadería',
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
              title: 'Actualizar Registro de Movimiento de Mercadería',
              text: '¿Estás seguro de actualizar registro de movimiento?',
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
    this.childlistadoproductosalidas.page = 1;
    this.childlistadoproductosalidas.filterpost="";
    $("#mymodallistarproductos").modal("show");
    setTimeout(()=>{
      this.childlistadoproductosalidas.txtfilterpost.nativeElement.focus();
    },500);
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductosalidas.page = 1;
    this.childlistadoproductosalidas.filterpost="";
    this.loading = true;
    const result = this.childlistadoproductosalidas.listarProductosSalidas(this.cod_sucursal).then();
      result.then(() => {
        this.loading = false;
        this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
  }

  chageSucursalReceptar(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal_receptar = elemento;
  }

  recibirDatosProducto(datosrecibidosproducto: any)
  {
    this.childdetalleproductomovimiento.enfocar = true;
    this.childdetalleproductomovimiento.datosdetalles.push(datosrecibidosproducto);
  }

  buscarCodigoProducto()
  {
    let comodin = this.codigo_barra.substr(-1);
    if(comodin=="*")
    {
      this.childlistadoproductosalidas.page = 1;
      this.childlistadoproductosalidas.filterpost= this.codigo_barra.slice(0, -1);
      $("#mymodallistarproductos").modal("show");
      setTimeout(()=>{
        this.childlistadoproductosalidas.txtfilterpost.nativeElement.focus();
      },500);
    }
    else
    {
      this.childlistadoproductosalidas.buscarcodigoproductosalidas(this.codigo_barra);
    }
    this.codigo_barra = "";
  }

  borrar(index)
  {
      try
      {
        this.childdetalleproductomovimiento.datosdetalles.splice(index, 1);
      }
      catch(e)
      {
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }

  formularioNormal()
  {
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.listarSucursalReceptar();

      this.fecha_registro = moment().format('YYYY-MM-DD');
  
      this.disabledbtnnuevo = false;
      this.disabledbtnguardar = true;
  
      this.disabledtxtcodigobarra = true;
      this.disabledbtnlistarproducto = true;
  
      this.disabledtxtfecha = true;
      this.disabledtiposalidamercaderia = true;
  
      this.codigo_barra = "";
  
      this.numero_movimiento = "Automático";
  
      this.loading = false;

      this.cod_sucursal_receptar="0";
  
      this.flagNormal();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "visualizarregistro")
      {
        this.disabledtxtcodigobarra = false;
        this.disabledbtnlistarproducto = false;
        //this.disabledtipoingresomercaderia = false;
        this.disabledtxtfecha = false;
        this.detallesactualizar = [];
        this.cod_movimiento_mercaderia = this.rutaActiva.snapshot.paramMap.get("cod_movimiento_mercaderia")!;
        this.flagNormal();
        this.listarSucursalReceptar();
        this.buscarMovimientoMercaderia();
      }
    }
    
  }

  buscarMovimientoMercaderia()
    {
      this.loading = true;
      
  
      this.movimientomercaderiaservice.buscarMovimientoMercaderia(this.cod_movimiento_mercaderia).subscribe( (data : any) =>
      {
        this.numero_movimiento = data[0].numero_movimiento;
        this.cod_sucursal = data[0].cod_sucursal;
        this.sucursal = data[0].sucursal;
        this.cod_sucursal_receptar = data[0].cod_sucursal_receptar;
        this.sucursal_receptar = data[0].sucursal_receptar;
        this.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD HH:mm:ss');
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
            unidades_denominacion :element.unidades_denominacion,
            cantidad_antigua : element.cantidad_unidad,
            modificable : 0,
            estado_movimiento: element.estado_movimiento,
            id_detalle_movimiento_mercaderia : element.id_detalle_movimiento_mercaderia,
          }
          this.childdetalleproductomovimiento.datosdetalles.push(detalle);
          this.detallesactualizar.push(detalle);
        });
  
        this.loading = true;
        
  
        const result = this.childlistadoproductosalidas.listarProductosSalidas(this.cod_sucursal).then();
        result.then(() => { 
          this.datosproducto = this.childlistadoproductosalidas.datosproducto;
          this.loading = false;
          
        }).catch(() => {
          this.loading = false;
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
        
        this.loading = false;
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
      });
    }

  verificarCampos()
  {
    let valor : Boolean = false;
    this.flagsucursalreceptar = false;
    if(this.cod_sucursal_receptar=="0")
    {
      this.flagsucursalreceptar=true;
      valor=true;
    }

    if(this.fecha_registro.length == 0)
    {
      this.flagfechaingresomercaderia=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagsucursalreceptar = false;
    this.flagfechaingresomercaderia = false;
  }

  habilitarFormulario()
  {
    this.disabledbtnnuevo = true;
    this.disabledbtnguardar = false;

    this.disabledtxtcodigobarra = false;
    this.disabledbtnlistarproducto = false;

    this.disabledtxtfecha = false;
    this.disabledtiposalidamercaderia = false;
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.childdetalleproductomovimiento.datosdetalles = [];
  }

  listarSucursalReceptar()
  {    
    this.loading = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loading = false;

      let sucursal_receptar = {
        "cod_sucursal" : "0",
        "sucursal" : "SELECCIONE SUCURSAL TRANSFERIR"
      };

      this.datossucursalreceptar = data;
      this.datossucursalreceptar.unshift(sucursal_receptar);
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  guardar()
  {    
    this.swalservice.iniciarLoading("Almacenando...");

    const parametros = {
      'cod_movimiento_mercaderia' : this.cod_movimiento_mercaderia,
      'fecha_hora' :this.fecha_registro,
      'cod_sucursal' :this.cod_sucursal,
      'cod_sucursal_receptar' : this.cod_sucursal_receptar,
      'kardex' : this.kardex,
      'control_estricto_movimiento' : this.control_estricto_movimiento,
      'detalles' : this.childdetalleproductomovimiento.datosdetalles
    };
    //console.log(parametros);
    
    this.movimientomercaderiaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();

      if (data.estado == true)
      {
        this.formularioNormal();
        this.childdetalleproductomovimiento.datosdetalles = [];
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Movimiento de mercadería no se pudo registrar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }

    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  actualizar()
  {    
    this.swalservice.iniciarLoading("Almacenando...");

    const parametros = {
      'cod_movimiento_mercaderia' : this.cod_movimiento_mercaderia,
      'numero_movimiento' :this.numero_movimiento,
      'fecha_hora' :this.fecha_registro,
      'cod_sucursal' :this.cod_sucursal,
      'cod_sucursal_receptar' : this.cod_sucursal_receptar,
      'kardex' : this.kardex,
      'control_estricto_movimiento' : this.control_estricto_movimiento,
      'detalles' : this.childdetalleproductomovimiento.datosdetalles,
      'detallesactualizar' : this.detallesactualizar
    };
    //console.log(parametros);
    
    this.movimientomercaderiaservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      

      if (data.estado == true)
      {
        this.formularioNormal();
        this.childdetalleproductomovimiento.datosdetalles = [];
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Movimiento de mercadería no se pudo actualizar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
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