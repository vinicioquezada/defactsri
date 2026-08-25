import { Component, OnInit, ViewChild} from '@angular/core';
import { DetalleProductosSalidasComponent } from 'src/app/shared/components/detalle-productos-salidas/detalle-productos-salidas.component'; 
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { SalidaMercaderiaService } from '../../services/salida-mercaderia.service';
import { TipoSalidaMercaderiaService } from '../../services/tipo-salida-mercaderia.service';
import * as moment from 'moment';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ListadoProductoSalidasComponent } from 'src/app/shared/components/listado-producto/listado-producto-salidas/listado-producto-salidas.component';

@Component({
  selector: 'app-salida-mercaderia',
  templateUrl: './salida-mercaderia.component.html',
  styleUrls: ['./salida-mercaderia.component.css']
})
export class SalidaMercaderiaComponent implements OnInit {
  multisucursal : string = "0";
  kardex : string = "";
  @ViewChild(DetalleProductosSalidasComponent) childdetalleproductosalidas: any;
  @ViewChild(ListadoProductoSalidasComponent) childlistadoproductosalidas!: ListadoProductoSalidasComponent;

  datostiposalidamercaderia : any;

  disabledbtnnuevo : boolean = false;
  disabledbtnguardar : boolean = true;

  disabledtxtcodigobarra : boolean = true;
  disabledbtnlistarproducto : boolean = true;

  disabledtxt : boolean = true;

  cod_sucursal : string = "";
  sucursal : string = "";

  codigo_barra : string = "";

  cod_salida_mercaderia : string = "";
  numero_salida : string = "";
  cod_tipo_salida_mercaderia : string = "";
  tipo_salida_mercaderia : string = "";
  fecha_registro : string = "";
  descripcion : string = "";

  flagtiposalidamercaderia : boolean = false;
  flagfechasalidamercaderia : boolean = false;
  flagdescripcion : boolean = false;

  loading : boolean = false;
  
  tipo_formulario: string = "";

  detallesactualizar : any = [];

  datosproducto : any = [];
  constructor(private salidamercaderiaservice:SalidaMercaderiaService, private toastr: ToastrService, private error:ErrorService, private tiposalidamercaderiaservice:TipoSalidaMercaderiaService, private sucursalesservice:SucursalesService, private rutaActiva: ActivatedRoute, private location: Location, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private swalservice: SwalService) {}

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
    this.childdetalleproductosalidas.datosdetalles = [];
    this.childdetalleproductosalidas.tipo_formulario = this.tipo_formulario;
  }

  clickNuevo()
  {
    this.loading = true;   
    const result = this.childlistadoproductosalidas.listarProductosSalidas(this.cod_sucursal).then();
    result.then(() => { 
      this.loading = false;
      this.habilitarFormulario();
      this.childdetalleproductosalidas.datosdetalles = [];
      this.cod_salida_mercaderia = moment().unix().toString() + "4" + this.usersession.getConfiguracion("cod_sucursal") + this.usersession.getConfiguracion("numero_empleado");
      this.datosproducto = this.childlistadoproductosalidas.datosproducto;
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

  async verificaDetalles()
  {
    if(this.childdetalleproductosalidas.datosdetalles.length>0)
      {
        let fila_error = false;
        for (let c = 0; c< this.childdetalleproductosalidas.datosdetalles.length; c++)
        {
          if(this.childdetalleproductosalidas.datosdetalles[c].fila_error == true)
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
              title: 'Guardar Registro de Salida de Mercadería',
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
                title: 'Actualizar Registro de Salida de Mercadería',
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
    this.childlistadoproductosalidas.page = 1;
    this.childlistadoproductosalidas.filterpost="";
    $("#mymodallistarproductos").modal("show");
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductosalidas.page = 1;
    this.childlistadoproductosalidas.filterpost="";
    this.loading = true;
    const result = this.childlistadoproductosalidas.listarProductosSalidas(this.cod_sucursal).then();
      result.then(() => {
        this.loading = false;
        this.datosproducto = this.childlistadoproductosalidas.datosproducto;
        this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
  }

  changeTipoSalidaMercaderia(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_salida_mercaderia = elemento;
  }

  recibirDatosProducto(datosrecibidosproducto: any)
  {
    this.childdetalleproductosalidas.enfocar = true;
    this.childdetalleproductosalidas.datosdetalles.push(datosrecibidosproducto);
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
  
      this.numero_salida = "Automático";
      this.cod_tipo_salida_mercaderia = "0";
      this.tipo_salida_mercaderia = "";
      this.descripcion = "SALIDA";
  
      this.loading = false;

      this.flagNormal();
      this.listarTipoSalidamercaderia();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "visualizarregistro")
      {
        this.disabledtxtcodigobarra = false;
        this.disabledbtnlistarproducto = false;
        this.disabledtxt = false;
        this.detallesactualizar = [];
        this.cod_salida_mercaderia = this.rutaActiva.snapshot.paramMap.get("cod_salida_mercaderia")!;
        this.flagNormal();
        this.listarTipoSalidamercaderia();
        this.buscarsalidamercaderia();
      }
    }
  }

  buscarsalidamercaderia()
  {
    this.loading = true;
    
    this.salidamercaderiaservice.buscarSalidaMercaderia(this.cod_salida_mercaderia).subscribe( (data : any) =>
    {
      this.numero_salida = data[0].numero_salida;
      this.cod_tipo_salida_mercaderia = data[0].cod_tipo_salida_mercaderia;
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
          unidades_denominacion :element.unidades_denominacion,
          modificable : 0,
          id_detalle_salida_mercaderia : element.id_detalle_salida_mercaderia
        }
        this.childdetalleproductosalidas.datosdetalles.push(detalle);
        this.detallesactualizar.push(detalle);
      });

      const result = this.childlistadoproductosalidas.listarProductosSalidas(this.cod_sucursal).then();
      result.then(() => {
        this.loading = false;
        this.datosproducto = this.childlistadoproductosalidas.datosproducto;
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
    this.flagNormal();
    if(this.cod_tipo_salida_mercaderia=="0")
    {
      this.flagtiposalidamercaderia=true;
      valor=true;
    }

    if(this.fecha_registro.length == 0)
    {
      this.flagfechasalidamercaderia=true;
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
    this.flagtiposalidamercaderia = false;
    this.flagfechasalidamercaderia = false;
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
    this.childdetalleproductosalidas.datosdetalles = [];
  }

  listarTipoSalidamercaderia()
  {    
    this.loading = true;
    

    this.tiposalidamercaderiaservice.listarTipoSalidaMercaderias().subscribe( (data : any) =>
    {
      let tipo_salida_mercaderia = {
        "cod_tipo_salida_mercaderia" : "0",
        "tipo_salida_mercaderia" : "SELECCIONE"
      };

      this.datostiposalidamercaderia = data;

      this.datostiposalidamercaderia.unshift(tipo_salida_mercaderia);
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
      'cod_salida_mercaderia' : this.cod_salida_mercaderia,
      'fecha_hora' :this.fecha_registro,
      'cod_sucursal' :this.cod_sucursal,
      'cod_tipo_salida_mercaderia' : this.cod_tipo_salida_mercaderia,
      'descripcion' :this.descripcion,
      'kardex' : this.kardex,
      'detalles' : this.childdetalleproductosalidas.datosdetalles
    };
    //console.log(parametros);
    
    this.salidamercaderiaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();

      if (data.estado == true)
      {
        this.formularioNormal();
        this.childdetalleproductosalidas.datosdetalles = [];
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Salida de mercadería no se pudo registrar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
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
      'cod_salida_mercaderia' : this.cod_salida_mercaderia,
      'numero_salida' :this.numero_salida,
      'fecha_hora' :this.fecha_registro,
      'cod_sucursal' :this.cod_sucursal,
      'cod_tipo_salida_mercaderia' : this.cod_tipo_salida_mercaderia,
      'descripcion' :this.descripcion,
      'kardex' : this.kardex,
      'detalles' : this.childdetalleproductosalidas.datosdetalles,
      'detallesactualizar' : this.detallesactualizar
    };
    //console.log(parametros);
    
    this.salidamercaderiaservice.actualizar(parametros).subscribe( (data : any) =>
    {
     this.swalservice.close();
      
      if (data.estado == true)
      {
        this.formularioNormal();
        this.childdetalleproductosalidas.datosdetalles = [];
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Salida de mercadería no se pudo actualizar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
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