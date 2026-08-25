import { FacturaVentaDTO } from 'src/app/venta/models/factura-venta.dto';
import { ErrorService } from 'src/app/shared/services/error.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import { ToastrService } from 'ngx-toastr';
import { SucursalDTO } from 'src/app/usuario/models/sucursal.dto';
import { ClienteDTO } from 'src/app/venta/models/cliente.dto';
import { FormaPagoDTO } from 'src/app/venta/models/forma-pago.dto';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export class FacturaVentaController {
  cod_proyecto : string = "";
  //cliente: ClienteDTO = new ClienteDTO;
  //sucursal: SucursalDTO = new SucursalDTO;
  //facturaventa: FacturaVentaDTO = new FacturaVentaDTO;
  formapago: FormaPagoDTO = new FormaPagoDTO;

  loading : boolean = false;
  arr_factura_venta : any;

  disabledbtnsrienviar : boolean = true;

  constructor(private ventaservice : VentaService, private toastr : ToastrService, private error : ErrorService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
  }

  crearFirmarXml(sucursal: SucursalDTO, facturaventa: FacturaVentaDTO, cliente: ClienteDTO, datosdetalles: any)
  {
    let detalles = [];
      datosdetalles.forEach(item => {

        let descripcion="";
        if(item.tarifa=="NORMAL")
        {
          descripcion = item.descripcion;
        }
        else
        {
          descripcion = item.tarifa + " - " + item.descripcion;
        }

        let detalle = {
          'codigoprincipal' : item.cod_producto,
          'codigoauxiliar' : 'NA',
          'descripcion' : descripcion,
          'cantidad' : item.cantidad_comprar,
          'preciounitario' : item.precio_base,
          'descuento' : item.descuento_calculado,
          'total' : item.total,//total preciototalsinimpuesto
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,//0% y 12%
          'totaliva' : item.iva,//Valor total * % iva
          'totalice' : item.ice,//Valor del ice del producto
          'totalfinal' : item.total_final//No necesita el xml
        };
        detalles.push(detalle);
      });

      this.arr_factura_venta = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta,
          'cod_sucursal' : sucursal.cod_sucursal,
          'ambiente' : sucursal.tipoambiente,
          'tipoemision' : '1',
          'razonsocial' : sucursal.razon_social,
          'nombrecomercial' : sucursal.nombre_comercial,
          'ruc' : sucursal.ruc,
          'claveacceso' : facturaventa.claveacceso,
          'coddoc' : '01',
          'estab' : sucursal.serieestab,
          'ptoemi' : sucursal.ptoemi,
          'secuencial' : facturaventa.numero_factura,
          'dirmatriz' : sucursal.direccion_matriz,
          'tipocontribuyente': sucursal.tipo_contribuyente,
          'contribuyente' : sucursal.contribuyente,
          'leyenda' : sucursal.leyenda,

          'facturaversion' : sucursal.facturaversion,

          'firmap12' : sucursal.firmap12,
          'clavep12' : sucursal.clavep12,
          'pk12' : sucursal.pk12,
          'firmapublica' : sucursal.firmapublica,
          'firmaprivada' : sucursal.firmaprivada,
          'certificado' : sucursal.certificado,
      
          /*INFO FACTURA*/
          'fechaemision' : facturaventa.fecha_registro,
          'direstablecimiento' : sucursal.direccion_establecimiento,
          'obligadocontabilidad' : sucursal.contabilidad,
          'tipoidentificacioncomprador' : cliente.cod_identificacion,
          'razonsocialcomprador' : cliente,
          'identificacioncomprador' : cliente.numero_identificacion,
          'totalsinimpuestos' : facturaventa.totalsinimpuestos,
          'totaldescuento' : facturaventa.totaldescuento,
      
            'totaliva' : facturaventa.totalconimpuestos,
            'subtotalconimpuesto' : facturaventa.subtotal12,
            'subtotalsinimpuesto' : facturaventa.subtotal0,
            'totalice' : facturaventa.totalconice,
      
          'propina' : '0.00',
          'importetotal' : facturaventa.importetotal,
          'moneda' : 'DOLAR',
      
            'formapago' :  this.formapago.id_forma_pago,
            'total' : facturaventa.importetotal,//importetotal
      
          'direccion' : cliente.direccion,
          'celular' : cliente.celular,
          'correo' : cliente.correo,
          'observacion' : facturaventa.observacion,
          'detalles' : detalles,
          'descripcionformapago' : this.formapago.forma_pago,
          'iva' : facturaventa.iva
        };

      //console.log(factura_venta);
      
      this.loading = true;
      

      this.ventaservice.crearFirmarXml(this.arr_factura_venta).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if (data.estado == true)
          {
              Swal.fire({
                title: 'Su Factura se ha Creado correctamente',
                text: 'Desea enviar al SRI el documento electrónico',
                icon: 'info',//'warning'
                showCancelButton: true,
                confirmButtonText: 'Si, Enviar',
                cancelButtonText: 'No, Enviar más tarde'
              }).then((result) => {
                if (result.value) {
                  /*
                  this.disabledbtnsrienviar = true;
                  this.visualizar(cod_abono);
                  */
                  this.enviarSri(sucursal, facturaventa, cliente);
                  

                } else if (result.dismiss === Swal.DismissReason.cancel) {

                  /*
                  this.disabledbtnsrienviar = false;
                  this.visualizar(cod_abono);
                  */
                }
              });
          }
          else
          {
            this.toastr.error("No se pudo general el archivo XML por problema en la conexion, generelo desde el explorador", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  enviarSri(sucursal: SucursalDTO, facturaventa: FacturaVentaDTO, cliente: ClienteDTO)
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta
        };
      
      this.loading = true;
      

      this.ventaservice.enviarSri(parametros).subscribe( (data : any) =>
      {
          this.loading = false;
          
          if (data.estado == true)
          {
            if(data.estadomensaje=="RECIBIDA")
            {
              this.comprobarSri(sucursal, facturaventa, cliente);
            }
            else
            {
              this.toastr.error("Comprobante rechazado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");

              this.actualizarEstado(facturaventa.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "DEVUELTA", data.fechaautorizacion);
            }
          }
          else
          {
            this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
          }
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  
  }

  comprobarSri(sucursal: SucursalDTO, facturaventa: FacturaVentaDTO, cliente: ClienteDTO)
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta,
		      'claveacceso' : facturaventa.claveacceso
        };
      
      this.loading = true;
      

      this.ventaservice.comprobarSri(parametros).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if (data.estado == true)
						{
							if(data.estadomensaje=="AUTORIZADO")
							{
								this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
								this.actualizarEstado(facturaventa.cod_factura_venta, facturaventa.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
                this.arr_factura_venta.fechaautorizacion = data.fechaautorizacion;
								this.crearRide(sucursal, facturaventa, cliente);
							}

							if(data.estadomensaje=="EN PROCESO")
							{
								this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
								this.actualizarEstado(facturaventa.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
							}

							if(data.estadomensaje=="NO AUTORIZADO")
							{
								this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
								this.actualizarEstado(facturaventa.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
							}
						}
						else
						{
							this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
						}
          
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  actualizarEstado(cod_factura_venta : string, n_autorizacion : string, mensaje_error : string, informacion_adicional : string, estado : string, fechaautorizacion: string)
  {
      let parametros = {
        'cod_factura_venta' : cod_factura_venta,
        'n_autorizacion' : n_autorizacion,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
        'fechaautorizacion' : fechaautorizacion
      };
      
      this.loading = true;
      

      this.ventaservice.actualizarEstado(parametros).subscribe( (data : any) =>
      {
          this.loading = false;
          
          if (data.estado == true)
						{
							if(estado=="AUTORIZADO")
							{
                /*
                this.disabledbtnsrienviar = true;
                this.colormensaje = "#0000FF";
                this.textomensaje = "AUTORIZADO";
                */
							}

							if(estado=="EN PROCESO")
							{
                /*
								this.disabledbtnsrienviar = true;
                this.colormensaje = "#ffc107";
                this.textomensaje = "EN PROCESO";
                */
							}

							if(estado=="DEVUELTA")
							{
                /*
                this.colormensaje = "#FF0000";
                this.textomensaje = "DEVUELTA";
                */
							}

							if(estado=="NO AUTORIZADO")
							{
                /*
                this.colormensaje = "#FF0000";
                this.textomensaje = "NO AUTORIZADO";
                */
							}
							
						}
						else
						{
							this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
						}
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  crearRide(sucursal: SucursalDTO, facturaventa: FacturaVentaDTO, cliente: ClienteDTO)
  {	 
    this.loading = true;
    

    this.ventaservice.crearRide(this.arr_factura_venta).subscribe( (data : any) =>
    {
        this.loading = false;
        

        /*this.disabledbtnsrienviar = true;*/
        if(cliente.correo=="")
        {
          this.toastr.warning("No tiene el cliente un correo para enviar", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          this.enviarCorreo(sucursal, facturaventa, cliente);
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
        
    });
  }

  enviarCorreo(sucursal: SucursalDTO, facturaventa: FacturaVentaDTO, cliente: ClienteDTO)
  {
      let parametros = {
        'cod_proyecto' : this.cod_proyecto,
        'cod_factura_venta' : facturaventa.cod_factura_venta,
        'nombre_comercial' : sucursal.nombre_comercial,
        'numero_factura' : facturaventa.numero_factura,
        'correo' : cliente.correo,
        'cliente' : cliente.cliente,
        'serieestab' : sucursal.serieestab,
        'ptoemi' : sucursal.ptoemi
        };
      
      this.loading = true;
      

      this.ventaservice.enviarCorreoFactura(parametros).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if(data.estado == false)
          {
            this.toastr.error("Correo no se pudo enviar al cliente", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
            this.actualizarEstadoCorreo(facturaventa.cod_factura_venta);
          }
          
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

  actualizarEstadoCorreo(cod_factura_venta: string)
  {
      let parametros = {
        'cod_factura_venta' : cod_factura_venta
      };
      
      this.loading = true;
      

      this.ventaservice.actualizarEstadoCorreo(parametros).subscribe( (data : any) =>
      {
          this.loading = false;
          

          if (data.estado == false)
					{
            this.toastr.error("No se pudo actualizar estado de comprobante, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
          }      
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });
  }

}
