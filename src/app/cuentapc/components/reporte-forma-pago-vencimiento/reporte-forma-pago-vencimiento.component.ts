import { Component, OnInit, ViewChild } from '@angular/core';
import { AbonoVentaService } from '../../services/abono-venta.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import { ListadoClienteComponent } from 'src/app/shared/components/listado-cliente/listado-cliente.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { firstValueFrom } from 'rxjs';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-forma-pago-vencimiento',
  templateUrl: './reporte-forma-pago-vencimiento.component.html',
  styleUrls: ['./reporte-forma-pago-vencimiento.component.css']
})
export class ReporteFormaPagoVencimientoComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;
  @ViewChild(ListadoClienteComponent) childlistadocliente: any;

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
      "tipo_documento" : "FACTURA ELECTRÓNICA",
    },
    {
      "cod_tipo_documento" : 2,
      "tipo_documento" : "FACTURA",
    },
    {
      "cod_tipo_documento" : 3,
      "tipo_documento" : "RECIBO",
    }
  ];

  filterpost = "";

  cod_sucursal : string = "";
  cod_usuario : string = "";
  empleado : string = "";
  
  fechahasta : string = "";

  tipo_venta : string = "";
  tipo_deuda : string = "";
  
  loadinglistado : boolean = false;
  

  datosformapago : any;
  id_forma_pago : string = "";
  forma_pago : string = "";

  chkempleado : boolean = true;

  chkcliente : boolean = true;
  cod_cliente : string = "";
  cliente : string = "";

  totalimporte : number = 0;
  totaldeuda : number = 0;

  tipo_documento : string = "";
  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");

  opcionesprivilegios : any;

  cantidad_registros : number = 0;

  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private formapagoservice : FormaPagoService, private abonoventaservice : AbonoVentaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cargaListasDesplegables();
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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "Nº FACT." : element.numero_factura,
          "Nº IDENTIFICACIÓN" : element.cedula,
          "CLIENTE": element.cliente,
          "FECHA" : element.fecha_hora,
          "FORMA PAGO": element.forma_pago,
          "VENCIMIENTO": element.plazo + " " + element.tiempo,
          "TOTAL" : element.importetotal,
          "DEUDA" : element.deuda_valor,
          "ESTADO" : element.estado_pago
        }
        json.push(obj);
      });

      let obj = {
        "Nº FACT." : "",
        "Nº IDENTIFICACIÓN" : "",
        "CLIENTE": "",
        "FECHA" : "",
        "FORMA PAGO": "",
        "VENCIMIENTO": "",
        "TOTAL" : "",
        "DEUDA" : "TOTAL IMPORTE",
        "ESTADO" : redondeardecimales(this.totalimporte, 2)
      }
      json.push(obj);

      obj = {
        "Nº FACT." : "",
        "Nº IDENTIFICACIÓN" : "",
        "CLIENTE": "",
        "FECHA" : "",
        "FORMA PAGO": "",
        "VENCIMIENTO": "",
        "TOTAL" : "",
        "DEUDA" : "TOTAL DEUDA",
        "ESTADO" : redondeardecimales(this.totaldeuda, 2)
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
      titulo[0] = { text: "Nº FACT.", bold: true };
      titulo[1] = { text: "CLIENTE", bold: true };
      titulo[2] = { text: "FORMA PAGO", bold: true };
      titulo[3] = { text: "VENCIMIENTO", bold: true };
      titulo[4] = { text: "TOTAL", bold: true };
      titulo[5] = { text: "DEUDA", bold: true };
      titulo[6] = { text: "ESTADO", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_factura;
        fila[1] = `${element.cedula}\n${element.cliente}`;
        fila[2] = `${element.fecha_hora}\n${element.forma_pago}`;
        fila[3] = element.plazo + " " + element.tiempo;
        fila[4] = element.importetotal;
        fila[5] = element.deuda_valor;
        fila[6] = element.estado_pago;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "TOTAL IMPORTE";
      fila[6] = redondeardecimales(this.totalimporte, 2);
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "TOTAL DEUDA";
      fila[6] = redondeardecimales(this.totaldeuda, 2);
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
            text: 'Reporte de forma pago vencimiento',
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
                        text: 'CLIENTE: ' + this.cliente,
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
                        text: 'FORMA COBRO: ' + this.forma_pago,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'FECHA CORTE: ' + this.fechahasta,
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
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
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

    this.fechahasta = moment().format('YYYY-MM-DD');
    this.cod_tipo_documento = "0";

    this.cod_cliente = "0";
    this.cliente = "Todos los clientes";
    this.chkcliente = true;

    this.tipo_documento = "TODOS";
    this.forma_pago = "TODOS";

    this.reiniciarValores();
  }

  reiniciarValores()
  {
    this.datos = [];
    this.page = 1;
    this.filterpost="";
    this.totalimporte = 0;
    this.totaldeuda = 0;
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
    
    this.abonoventaservice.listarFormaPagoVencimiento(this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.id_forma_pago, this.cod_cliente).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      if(data.length>0)
      {
        data.forEach(element => {
          this.totalimporte = this.totalimporte + parseFloat(element.importetotal);
          this.totaldeuda = this.totaldeuda + parseFloat(element.deuda_valor);
        });
        this.totalimporte = redondeardecimales(this.totalimporte, 2);
        this.totaldeuda = redondeardecimales(this.totaldeuda, 2);
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
      this.childlistadocliente.listarClientes();
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

  changechkcliente()
  {
    this.cod_cliente = "0";
    this.cliente = "";
    if(this.chkcliente==true){
      this.chkcliente = false;
    }else{
      this.chkcliente = true;
      this.cliente = "Todos los clientes";
    }
  }

  recibirDatosCliente(datosrecibidoscliente: any)
  {
    this.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.chkcliente = false;
    $("#mymodallistarclientes").modal("hide");
  }

  listarClientes()
  {
    this.childlistadocliente.page = 1;
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}