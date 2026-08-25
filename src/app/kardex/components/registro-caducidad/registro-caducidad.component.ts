import { Component, OnInit, ViewChild} from '@angular/core';
import { KardexService } from '../../services/kardex.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { DetalleRegistroCaducidadComponent } from 'src/app/shared/components/detalle-registro-caducidad/detalle-registro-caducidad.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-registro-caducidad',
  templateUrl: './registro-caducidad.component.html',
  styleUrls: ['./registro-caducidad.component.css']
})
export class RegistroCaducidadComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";

  @ViewChild(DetalleRegistroCaducidadComponent) childdetalleregistrocaducidad: any;

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

  fecha_registro : string = "";

  loading : boolean = false;

  arr_factura_compra : any;

  constructor(private router : Router, private rutaActiva: ActivatedRoute, private kardexservice : KardexService, private toastr : ToastrService, private error : ErrorService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }
  
  clickGuardarFechasCaducidad()
  {
    this.verificaDetalles();
  }

  verificaDetalles()
  {
    if(this.childdetalleregistrocaducidad.datosdetalles.length>0)
    {
      let fila_error = false;
      for (let c = 0; c< this.childdetalleregistrocaducidad.datosdetalles.length; c++)
      {
        if(this.childdetalleregistrocaducidad.datosdetalles[c].fila_error == true)
        {
          fila_error = true;
          break;
        }
      }
      
      if(fila_error)
      {
        this.toastr.warning("Hay una o más filas pendientes de valor, no debe estar la fila de color rojo", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        Swal.fire({
          title: 'Registrar fechas de caducidad a Productos',
          text: '¿Estás seguro de registrar?',
          icon: 'info',//'warning'
          showCancelButton: true,
          confirmButtonText: 'Si, Registrar',
          cancelButtonText: 'No, Cerrar'
        }).then((result) => {
          if (result.value) {
            this.guardarfechascaducidad();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
    }
    else
    {
      this.toastr.warning("No hay ningun registro en la tabla para almacenar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  guardarfechascaducidad()
  {
    let fechascaducidad = {
      'cod_factura_compra' : this.cod_factura_compra,
      'detalles' : this.childdetalleregistrocaducidad.datosdetalles
    };
    this.loading = true;
    this.kardexservice.guardarFechasCaducidad(fechascaducidad).subscribe( (data : any) =>
    {
        this.loading = false;
        if (data.estado == true)
        {
          this.toastr.success("Fechas de caducidad registrado correctamente", "INFORMACIÓN DEL SISTEMA");
          this.formularioNormal();
        }
        else
        {
          this.toastr.error("Fechas de caducidad no se pudo registrar, error inesperado", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
    });
  }

  recibirDatosDetalles()
  {

  }

  formularioNormal()
  {
    this.cod_factura_compra = this.rutaActiva.snapshot.paramMap.get("cod_factura_compra")!;
    this.buscarFacturaProductosKardex();
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

  clickDeshacer()
  {
    this.formularioNormal();
  }

 buscarFacturaProductosKardex()
  {
    this.loading = true;
    

    this.kardexservice.buscarFacturaProductosKardex(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.loading = false;

      if(data.length==0)
      {
        this.sucursal = "NO APLICA";
        this.toastr.warning("No existen registros de productos con caducidad", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {        
        this.numerocompraproveedor = data[0].codigo;
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
  
        this.fecha_registro = moment(data[0].fecha_emision).format('YYYY-MM-DD');
        
        this.childdetalleregistrocaducidad.datosdetalles = [];
  
        //let costo_real = costo_base_real + ((costo_base_real * iva_compra) / 100);
        //let costo = costo_base + ((costo_base * iva_compra) / 100);
  
        data.forEach(element => {
          let fecha_caducidad = null;
  
          if(element.fecha_caducidad != "2000-01-01") {
            fecha_caducidad = element.fecha_caducidad;
          }
          
          let detalle = {
            fila_error : false,//Para marcar la fila editada con rojo
            id_kardex : element.id_kardex,
            descripcion : element.descripcion,
            fecha_caducidad : fecha_caducidad,
          }
          this.childdetalleregistrocaducidad.datosdetalles.push(detalle);
        });
      }
      
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