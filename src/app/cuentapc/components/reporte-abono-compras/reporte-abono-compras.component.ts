import { Component, OnInit, ViewChild } from '@angular/core';
import { AbonoCompraService } from '../../services/abono-compra.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
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
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reporte-abono-compras',
  templateUrl: './reporte-abono-compras.component.html',
  styleUrls: ['./reporte-abono-compras.component.css']
})
export class ReporteAbonoComprasComponent implements OnInit {
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

  filterpost = "";

  cod_sucursal : string = "";

  chkempleado : boolean = true;
  cod_usuario : string = "";
  empleado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  tipo_venta : string = "";
  tipo_deuda : string = "";
  
  loadinglistado : boolean = false;

  datosformapago : any;
  id_forma_pago : string = "";
  forma_pago : string = "";

  chkproveedor : boolean = true;
  cod_proveedor : string = "";
  proveedor : string = "";

  totalvalor : number = 0;

  tipo_documento : string = "";
  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private formapagoservice : FormaPagoService, private abonocompraservice : AbonoCompraService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cargaListasDesplegables();
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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "Nº IDENTIFICACIÓN" : element.ruc,
          "PROVEEDOR" : element.proveedor,
          "FECHA ABONO" : element.fecha_registro,
          "Nº COMPROBANTE": element.numero_factura,
          "TIPO COMPROBANTE" : element.tipo_compra,
          "VALOR" : element.valor
        }
        json.push(obj);
      });

      let obj = {
        "Nº IDENTIFICACIÓN" : "",
        "PROVEEDOR" : "",
        "FECHA ABONO" : "",
        "Nº COMPROBANTE": "",
        "TIPO COMPROBANTE" : "TOTAL GENERAL",
        "VALOR" : redondeardecimales(this.totalvalor, 2)
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
      titulo[0] = { text: "Nº IDENTIFICACIÓN", bold: true };
      titulo[1] = { text: "PROVEEDOR", bold: true };
      titulo[2] = { text: "FECHA ABONO", bold: true };
      titulo[3] = { text: "Nº COMPROBANTE", bold: true };
      titulo[4] = { text: "TIPO COMPROBANTE", bold: true };
      titulo[5] = { text: "VALOR", bold: true };
      tabla.push(titulo);

      let c = 1;
      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.ruc;
        fila[1] = element.proveedor;
        fila[2] = element.fecha_registro;
        fila[3] = element.numero_factura;
        fila[4] = element.tipo_compra;
        fila[5] = element.valor;
        tabla.push(fila);
        c++;
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "TOTAL GENERAL";
      fila[5] = redondeardecimales(this.totalvalor, 2);
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
            text: 'Reporte de abonos compras',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'
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
                        text: 'TIPO DOCUMENTO: ' + this.tipo_documento,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  },


                  {
                    stack: [
                      {
                        text: 'FORMA PAGO: ' + this.forma_pago,
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
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  }
                ],
                margin: [0, 0, 0, 10]
          },

          {
            table: {
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
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
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    this.id_forma_pago = "0";

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    this.cod_tipo_documento = "0";
   
    this.cod_proveedor = "0";
    this.proveedor = "Todos los proveedores";
    this.chkproveedor = true;

    this.tipo_documento = "TODOS";
    this.forma_pago = "TODOS";

    this.reiniciarValores();
  }

  reiniciarValores()
  {
    this.page = 1;
    this.filterpost="";
    this.datos = [];
    this.totalvalor = 0;
    this.cantidad_registros = 0;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscar()
  {
    this.reiniciarValores();
    this.loadinglistado = true;
    
    this.abonocompraservice.listarAbonosCompras(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.id_forma_pago, this.cod_proveedor).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      if(data.length>0)
      {
        data.forEach(element => {
          this.totalvalor = this.totalvalor + parseFloat(element.valor);
        });
        this.totalvalor = redondeardecimales(this.totalvalor, 2);
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

  async cargaListasDesplegables(): Promise<void> {
    try {
      await this.listarSucursales();
      await this.listarFormaPagos();

      this.formularioNormal();

    } catch (error) {
      this.toastr.error("Ocurrió un error al cargar los datos", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async listarSucursales(): Promise<void> {
    this.loadinglistado = true;

    try {
      const data = await firstValueFrom(this.sucursalesservice.listarSucursales());
      this.datossucursal = data;
      this.childlistadoproveedor.listarProveedores();
      this.childlistadoempleado.listarEmpleadosUsuarios();
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loadinglistado = false;
    }
  }
  
  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
    this.forma_pago = resultado.forma_pago;
  }

  async listarFormaPagos(): Promise<void> {
    this.datosformapago = [];
    this.loadinglistado = true;

    try {
      const data = await firstValueFrom(this.formapagoservice.listarFormaPagos());

      this.datosformapago = data;

      const formapago = {
        id_forma_pago: 0,
        forma_pago: "TODOS",
        cod_tipo_tarjeta: 0,
        estado: 1
      };

      this.datosformapago.unshift(formapago);

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loadinglistado = false;
    }
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

  handlePageChange(event: number): void {
    this.page = event;
  }
}