import { Component, OnInit, ViewChild } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { IvaCompraService } from 'src/app/almacen/services/iva-compra.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import { ListadoProveedorComponent } from 'src/app/shared/components/listado-proveedor/listado-proveedor.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-compra-detalles',
  templateUrl: './reporte-compra-detalles.component.html',
  styleUrls: ['./reporte-compra-detalles.component.css']
})
export class ReporteCompraDetallesComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;
  @ViewChild(ListadoProveedorComponent) childlistadoproveedor: any;

  cantidad_registros : number = 0;

  datos : any;
  datossucursal : any;

  cod_tipo_documento : string = "";
  datostipodocumento : any[] = [
    {
      "cod_tipo_documento" : 0,
      "tipo_documento" : "TODOS",
    },
    {
      "cod_tipo_documento" : 1,
      "tipo_documento" : "FACTURA",
    },
    {
      "cod_tipo_documento" : 2,
      "tipo_documento" : "RECIBO",
    }
  ];

  cod_tipo_control : string = "";
  datoscontrolinventario : any[] = [
    {
      "cod_tipo_control" : "T",
      "tipo_control" : "TODOS",
    },
    {
      "cod_tipo_control" : 1,
      "tipo_control" : "INVENTARIO",
    },
    {
      "cod_tipo_control" : 0,
      "tipo_control" : "SIN INVENTARIO",
    }
  ];

  id_iva_compra : number = 0;
  datosivacompra : any;
  
  cod_tipo_deuda : string = "";
  datostipodeuda : any[] = [
    {
      "cod_tipo_deuda" : "T",
      "tipo_deuda" : "TODOS",
    },
    {
      "cod_tipo_deuda" : "0",
      "tipo_deuda" : "SIN DEUDA",
    },
    {
      "cod_tipo_deuda" : "1",
      "tipo_deuda" : "POR PAGAR",
    }
  ];

  filterpost = "";

  cod_sucursal : string = "";

  chkempleado : boolean = true;
  cod_usuario : string = "";
  empleado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  tipo_venta : string = "";
  
  loading : boolean = false;
  loadinglistado : boolean = false;

  chkproveedor : boolean = true;
  cod_proveedor : string = "";
  proveedor : string = "";

  total : number = 0;
  totalimpuesto : number = 0;
  totalfinal : number = 0;

  tipo_documento : string = "";
  tipo_deuda : string = "TODOS";
  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");
  tipo_control: string = "";
  iva_compra: string = "TODOS";

  opcionesprivilegios : any;
  
  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private formapagoservice : FormaPagoService, private compraservice : CompraService, private ivacompraservice: IvaCompraService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
    this.bodyStyleService.resetBodyStyles();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeChkEmpleado()
  {
    this.cod_usuario = "0";
    this.empleado = "";
    if(this.chkempleado==true){
      this.chkempleado = false;
    }else{
      this.chkempleado = true;
      this.empleado = "Todo el personal";
    }
  }

  changeTipoDocumento(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_documento = elemento;
    const resultado = this.datostipodocumento.find( (valor : any) => valor.cod_tipo_documento == this.cod_tipo_documento );
    this.tipo_documento = resultado.tipo_documento;
  }

  changeTipoControl(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_control = elemento;
    const resultado = this.datoscontrolinventario.find( (valor : any) => valor.cod_tipo_control == this.cod_tipo_control );
    this.tipo_control = resultado.tipo_control;
  }

  changeIvaCompra(event: any): void {
    const elemento = event.target.value;
    this.iva_compra = elemento;
    const resultado = this.datostipodeuda.find( (valor : any) => valor.iva_compra == this.iva_compra );
    this.iva_compra = resultado.iva_compra;
  }

  changeTipoDeuda(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_deuda = elemento;
    const resultado = this.datostipodeuda.find( (valor : any) => valor.cod_tipo_deuda == this.cod_tipo_deuda );
    this.tipo_deuda = resultado.tipo_deuda;
  }

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "Nº COMPROBANTE" : element.numero_factura,
          "FECHA" : element.fecha_emision,
          "DETALLE" : element.detalle,
          "CANT": element.cantidad_comprar,
          "IVA" : element.iva,
          "COSTO" : element.precio_venta_real,
          "COSTO TOTAL" : element.total_final
        }
        json.push(obj);
      });

      let obj = {
        "Nº COMPROBANTE" : "",
        "FECHA" : "",
        "DETALLE" : "",
        "CANT": "",
        "IVA" : "",
        "COSTO" : "SUBTOTAL",
        "COSTO TOTAL" : this.total
      }
      json.push(obj);

      obj = {
        "Nº COMPROBANTE" : "",
        "FECHA" : "",
        "DETALLE" : "",
        "CANT": "",
        "IVA" : "",
        "COSTO" : "TOTAL IMP",
        "COSTO TOTAL" : this.totalimpuesto
      }
      json.push(obj);

      obj = {
        "Nº COMPROBANTE" : "",
        "FECHA" : "",
        "DETALLE" : "",
        "CANT": "",
        "IVA" : "",
        "COSTO" : "TOTAL IMP",
        "COSTO TOTAL" : this.totalfinal
      }
      json.push(obj);

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, "Sheet1");

      XLSX.writeFile(book, "ExcelSheet.xlsx");
    }
    else
    {
      this.toastr.info("Debe generar primero el reporte para exportar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  exportarPdf()
  {
    if(this.datos.length>0)
    {
      let tabla = [];
      let titulo = [];
      titulo[0] = { text: "Nº COMPROBANTE", bold: true };
      titulo[1] = { text: "FECHA", bold: true };
      titulo[2] = { text: "DETALLE", bold: true };
      titulo[3] = { text: "CANT", bold: true };
      titulo[4] = { text: "IVA", bold: true };
      titulo[5] = { text: "COSTO", bold: true };
      titulo[6] = { text: "COSTO TOTAL", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_factura;
        fila[1] = element.fecha_emision;
        fila[2] = element.detalle;
        fila[3] = element.cantidad_comprar;
        fila[4] = element.iva;
        fila[5] = element.precio_venta_real;
        fila[6] = element.total_final;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "SUBTOTAL";
      fila[6] = this.total;
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "TOTAL IMP";
      fila[6] = this.totalimpuesto;
      tabla.push(fila);
      
      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "TOTAL";
      fila[6] = this.totalfinal;
      tabla.push(fila);

      const fechaActual = new Date().toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const pdfDefinition: any = {
        //pageOrientation: 'portrait',
        pageOrientation: 'landscape',
        
        content: [
          {
          columns: [
                  {
                    stack: [
                      {
                        text: this.ruc.razonsocial,
                        alignment: 'left',
                        fontSize: 12,
                        bold: true,
                        color: '#047886'
                      },
                      {
                        text: this.ruc.nombrecomercial,
                        alignment: 'left',
                        fontSize: 12,
                        bold: true,
                        color: '#047886'
                      },
                      {
                        text: this.ruc.direccion_establecimiento,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        color: '#047886',
                        margin: [0, 5, 0, 0]
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  },


                  {
                    stack: [
                      {
                        text: 'LOCAL: ' + this.sucursal,
                        alignment: 'right',
                        fontSize: 12,
                        bold: true,
                      },
                      {
                        text: 'USUARIO: ' + this.usuario,
                        alignment: 'right',
                        fontSize: 12,
                        bold: true
                      },
                      {
                        text: `FECHA DE GENERACIÓN: ${fechaActual}`,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 5, 0, 0]
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  }
                ],
                margin: [0, 0, 0, 5]
          },

          {
          canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 762, y2: 0, // 515
                lineWidth: 1
              }
            ],
            margin: [0, 5, 0, 10] // margen superior e inferior
          },

          {
            text: 'Reporte de Compras Detalles',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886',
            margin: [0, 0, 0, 10]
          },

          {
          columns: [
                  {
                    stack: [
                      {
                        text: 'PERSONAL: ' + this.empleado,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'PROVEEDOR: ' + this.proveedor,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'TIPO IVA: ' + this.iva_compra,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'TIPO DOCUMENTO: ' + this.tipo_documento,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: '',
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                    ],
                    margin: [0, 0, 0, 0]
                  },


                  {
                    stack: [
                      {
                         text: 'TIPO DEUDA: ' + this.tipo_deuda,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'TIPO CONTROL: ' + this.tipo_control,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                       {
                        text: 'FECHA DESDE: ' + this.fechadesde,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'FECHA HASTA: ' + this.fechahasta,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: '',
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  }
                ],
                margin: [0, 0, 0, 10]
          },

          {
            table: {
              widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
              body:
                tabla
            }
          }
        ]
      }
      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.open();
      //pdf.download();
      //pdf.print();
    }
    else
    {
      this.toastr.info("Debe generar primero el reporte para exportar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal(): void
  {
    this.page = 1;
    this.filterpost="";
    this.datos = [];
    this.cantidad_registros = 0;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");

    this.cod_tipo_control = "T";
    this.id_iva_compra = 0;
    this.iva_compra = "TODOS";

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    /*
    this.fechadesde = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    this.fechahasta = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    */
   
    this.cod_tipo_documento = "0";
    this.cod_tipo_deuda = "0";
   
    this.cod_proveedor = "0";
    this.proveedor = "Todos los proveedores";
    this.chkproveedor = true;

    this.total = 0;
    this.totalimpuesto = 0;
    this.totalfinal = 0;

    this.tipo_deuda = "SIN DEUDA";
    this.tipo_documento = "TODOS";
    this.tipo_control = "TODOS"
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscar()
  {
    this.datos = [];
    this.page = 1;
    this.filterpost="";
    
    this.loadinglistado = true;
    
    this.compraservice.listarComprasDetalles(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.cod_tipo_deuda, this.cod_proveedor, this.cod_tipo_control, this.iva_compra).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      this.total = 0;
			this.totalimpuesto = 0;
			this.totalfinal = 0;
      if(data.length>0)
      {
        data.forEach(element => {
          element.precio = redondeardecimales(element.precio, 4);
          this.total = this.total + parseFloat(element.total);
          this.totalimpuesto = this.totalimpuesto + parseFloat(element.total_iva);
          this.totalfinal = this.totalfinal + parseFloat(element.total_final);
        });
        this.total = redondeardecimales(this.total, 2);
        this.totalimpuesto = redondeardecimales(this.totalimpuesto, 2);
        this.totalfinal = redondeardecimales(this.totalfinal, 2);
      }
      this.datos = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  
  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    const sucursal = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = sucursal.sucursal;
  }

  listarSucursales()
  {    
    this.loading = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loading = false;
      this.listarIvaCompra();
      this.childlistadoproveedor.listarProveedores();
      this.childlistadoempleado.listarEmpleadosUsuarios();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }
  
  listarEmpleados()
  {
    this.childlistadoempleado.page = 1;
    this.childlistadoempleado.filterpost="";
    $("#mymodallistarempleados").modal("show");
  }

  recibirDatosEmpleados(datosrecibidosempleado: any)
  {
    this.cod_usuario = datosrecibidosempleado.cod_usuario;
    this.empleado = datosrecibidosempleado.apellido + " " + datosrecibidosempleado.nombre;
    this.chkempleado = false;
    $("#mymodallistarempleados").modal("hide");
  }

  changeChkProveedor()
  {
    this.cod_proveedor = "0";
    this.proveedor = "";
    if(this.chkproveedor==true){
      this.chkproveedor = false;
    }else{
      this.chkproveedor = true;
      this.proveedor = "Todos los proveedores";
    }
  }

  recibirDatosProveedor(datosrecibidosproveedor: any)
  {
    this.cod_proveedor = datosrecibidosproveedor.cod_proveedor;
    this.proveedor = datosrecibidosproveedor.razon_social + " " + datosrecibidosproveedor.nombre_comercial;
    this.chkproveedor = false;
    $("#mymodallistarproveedores").modal("hide");
  }

  listarProveedores()
  {
    this.childlistadoproveedor.page = 1;
    this.childlistadoproveedor.filterpost="";
    $("#mymodallistarproveedores").modal("show");
  }

  listarIvaCompra()
  {
    this.datosivacompra = [];
    this.loading = true;
    

    this.ivacompraservice.listarIvaCompra().subscribe( (data : any) =>
    {
      let ivacompra = {
        "id_iva_compra" : 0,
        "iva_compra" : "TODOS"
      }

      this.datosivacompra.push(ivacompra);

      data.forEach(element => {
        let ivacompra = {
          "id_iva_compra" : element.id_iva_compra,
          "iva_compra" : element.iva_compra
        }
        this.datosivacompra.push(ivacompra);
      });

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}