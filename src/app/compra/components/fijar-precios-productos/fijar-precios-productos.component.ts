import { Component, OnInit, ViewChild} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CompraService } from '../../services/compra.service';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { DetalleFijarPreciosComponent } from 'src/app/shared/components/detalle-fijar-precios/detalle-fijar-precios.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-fijar-precios-productos',
  templateUrl: './fijar-precios-productos.component.html',
  styleUrls: ['./fijar-precios-productos.component.css']
})
export class FijarPreciosProductosComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  tipo_compra : string = "";

  @ViewChild(DetalleFijarPreciosComponent) childdetallefijarprecios: any;

  datossucursal : any;

  disabledtxtnmerocompraproveedor : boolean = true;
  disabledtxtfecha : boolean = true;
  disabledcmbformapago : boolean = true;
  chkcontado : boolean = true;
  disabledchkcontado : boolean = true;
  disabledtxtrecibido : boolean = true;
  disabledbtncalcular : boolean = true;
  
  cod_factura_compra : string = "";
  numero_factura : string = "";
  numerocompraproveedor : string = "0";
  
  cod_usuario : string = "";

  cod_identificacion : string = "";
  identificacion : string = "";
  cod_proveedor : string = "";
  proveedor : string = "";
  numero_identificacion : string = "";
  celular : string = "";
  telefono : string = "";
  correo : string = "";
  direccion : string = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  codigo_barra : string = "";

  fecha_registro : string = "";

  loading : boolean = false;
  

  importetotal : number = 0.00;

  arr_factura_compra : any;

  constructor(private router : Router, private rutaActiva: ActivatedRoute, private compraservice : CompraService, private toastr : ToastrService, private error : ErrorService, private formapagoservice : FormaPagoService, private sucursalesservice : SucursalesService, private empleadoservice : EmpleadoService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }
  
  clickActualizar()
  {
    if(this.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de compra de factura de proveedor para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.numerocompraproveedor.length!=15)
      {
        this.toastr.warning("El numero de la factura de compra debe tener 15 digitos omitiendo los guiones.", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        if(this.cod_proveedor.length==0)
        {
          this.toastr.warning("seleccione un proveedor para registrar la factura de compra", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          if (this.importetotal == 0)
          {
            this.toastr.warning("Verifique forma de Pago, No hay nada que almacenar, realice la factura por favor", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {    
            this.verificaDetalles();
          }
        } 
      }
    }
  }

  verificaDetalles()
  {
    let fila_error = false;
    for (let c = 0; c< this.childdetallefijarprecios.datosdetalles.length; c++)
    {
      if(this.childdetallefijarprecios.datosdetalles[c].fila_error == true)
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
      Swal.fire({
        title: 'Actualizar Registro de Precios de Productos',
        text: '¿Estás seguro de actualizar precios de productos?',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Actualizar',
        cancelButtonText: 'No, Cerrar'
      }).then((result) => {
        if (result.value) {
          this.actualizar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
    }
  }

  actualizar()
  {
   
      let preciosproductos = {
        'cod_proveedor' : this.cod_proveedor,
        'detalles' : this.childdetallefijarprecios.datosdetalles
      };

      //console.log(factura_compra);
      
      this.loading = true;
      

      this.compraservice.guardarPrecios(preciosproductos).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if (data.estado == true)
          {
            this.toastr.success("Precios actualizados correctamente", "INFORMACIÓN DEL SISTEMA");
            this.formularioNormal();
          }
          else
          {
            this.toastr.error("Precios no se pudo actualizar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  recibirDatosDetalles(importetotal: number)
  {
    this.importetotal = importetotal;
  }

  formularioNormal()
  {
    this.cod_factura_compra = this.rutaActiva.snapshot.paramMap.get("cod_factura_compra")!;
    this.buscarFacturaCompra();
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    /*
    this.flagformapago = false;

    if(this.forma_pago=="0")
    {
      this.flagformapago=true;
      valor=true;
    }
    */
    return valor;
  }

  flagNormal()
  {
    //this.flagformapago = false;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscarFacturaCompra()
  {
    this.loading = true;
    

    this.compraservice.buscarFacturaProductos(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.loading = false;
      //console.log(data);

      this.cod_sucursal = data[0].cod_sucursal;
      this.sucursal = data[0].sucursal;
      
      this.numerocompraproveedor = data[0].codigo;
      this.tipo_compra = data[0].tipo_compra;
      this.cod_usuario = data[0].cod_usuario;
      this.numero_factura = this.padLeft(data[0].numero_factura, 9);
      this.cod_identificacion = data[0].cod_identificacion;
      this.identificacion = data[0].identificacion;
      this.cod_proveedor = data[0].cod_proveedor;
      this.proveedor = data[0].proveedor;
      this.numero_identificacion = data[0].cedula;
      this.celular = data[0].celular;
      this.telefono = data[0].convencional;
      this.correo = data[0].correo;
      this.direccion = data[0].direccion;
      this.importetotal = data[0].importetotal;

      this.fecha_registro = moment(data[0].fecha_emision).format('YYYY-MM-DD');
      
      this.childdetallefijarprecios.datosdetalles = [];

      //let costo_real = costo_base_real + ((costo_base_real * iva_compra) / 100);
			//let costo = costo_base + ((costo_base * iva_compra) / 100);

      data.forEach(element => {
        let costo_base_real = parseFloat(element.precio_real);//Precio real 0
        let costo_real = costo_base_real + ((costo_base_real * parseFloat(element.iva_compra)) / 100);//Precio real más impuestos

        let costo_base = parseFloat(element.precio);//Precio 0
        let costo = costo_base + ((costo_base * parseFloat(element.iva_compra)) / 100);//Precio más impuestos
        
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          descripcion : element.detalle,
 
          porcentaje_ice : 0,
          porcentaje_iva : parseFloat(element.iva),

          costo_base : costo_base,
          costo : costo,
  
          costo_base_real : costo_base_real,
          costo_real : costo_real,
        
          utilidad : 0,

          precio_base_actual : 0,
          precio_actual : 0,
          
          precio_base : parseFloat(element.precio_base),
          precio_venta : parseFloat(element.precio_venta)
        }
        this.childdetallefijarprecios.datosdetalles.push(detalle);
      });
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }
}