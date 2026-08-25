import { Component, OnInit, ViewChild } from '@angular/core';
import { NotaCreditoService } from '../../services/nota-credito.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
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
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { firstValueFrom } from 'rxjs';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-saldo-nota-credito',
  templateUrl: './reporte-saldo-nota-credito.component.html',
  styleUrls: ['./reporte-saldo-nota-credito.component.css']
})
export class ReporteSaldoNotaCreditoComponent implements OnInit {
  
  opcionesprivilegios : any;
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;
  @ViewChild(ListadoClienteComponent) childlistadocliente: any;

  cod_tipo_documento : string = "";
  datostipodocumento : any[] = [
    {
      "cod_tipo_documento" : 0,
      "tipo_documento" : "TODOS"
    },
    {
      "cod_tipo_documento" : 1,
      "tipo_documento" : "FACTURA ELECTRÓNICA"
    },
    {
      "cod_tipo_documento" : 2,
      "tipo_documento" : "FACTURA"
    },
    {
      "cod_tipo_documento" : 3,
      "tipo_documento" : "RECIBO"
    }
    // {
    //   "cod_tipo_documento" : 4,
    //   "tipo_documento" : "VENTA PENDIENTE"
    // }
  ];

  cantidad_registros : number = 0;

  datos : any;
  datossucursal : any;  

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

  chkcliente : boolean = true;
  cod_cliente : string = "";
  cliente : string = "";

  subtotalconimpuesto : number = 0;
  subtotal0 : number = 0;
  totalimpuesto : number = 0;
  total :number = 0;

  firmasruc: string = "";
  cod_ruc: string = "0";
  datosrucempresa : any = [];

  tipo_documento : string = "";
  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");

  saldototal: number = 0;

  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private notacreditoservice :  NotaCreditoService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();

    if(this.opcionesprivilegios["soloventaselectronicas"])
    {
      this.datostipodocumento = [
        {
          "cod_tipo_documento" : 1,
          "tipo_documento" : "FACTURA ELECTRÓNICA"
        },
        {
          "cod_tipo_documento" : 2,
          "tipo_documento" : "FACTURA"
        }
      ];
    }
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "Nº NOTA CREDITO" : element.numero_nota_credito,
          "ESTADO" : element.estado,
          "IDENTIFICACIÓN" : element.cedula,
          "CLIENTE" : element.cliente,
          "FECHA": element.fecha_hora,
          "TIPO VENTA": element.tipo_venta,
          "TOTAL" : element.importetotal,
          "SALDO" : element.saldo_favor
        }
        json.push(obj);
      });

      let obj = {
        "Nº NOTA CREDITO" : "",
        "ESTADO" : "",
        "IDENTIFICACIÓN" : "",
        "CLIENTE" : "",
        "FECHA": "",
        "TIPO VENTA" : "SUBTOTAL IMP",
        "TOTAL" : this.subtotalconimpuesto,
        "SALDO" : ""
      }
      json.push(obj);

      obj = {
        "Nº NOTA CREDITO" : "",
        "ESTADO" : "",
        "IDENTIFICACIÓN" : "",
        "CLIENTE" : "",
        "FECHA": "",
        "TIPO VENTA" : "SUBTOTAL 0",
        "TOTAL" : this.subtotal0,
        "SALDO" : ""
      }
      json.push(obj);

      obj = {
        "Nº NOTA CREDITO" : "",
        "ESTADO" : "",
        "IDENTIFICACIÓN" : "",
        "CLIENTE" : "",
        "FECHA": "",
        "TIPO VENTA" : "TOTAL IMP",
        "TOTAL" : this.totalimpuesto,
        "SALDO" : ""
      }
      json.push(obj);
      
      obj = {
        "Nº NOTA CREDITO" : "",
        "ESTADO" : "",
        "IDENTIFICACIÓN" : "",
        "CLIENTE" : "",
        "FECHA": "",
        "TIPO VENTA" : "TOTAL GENERAL",
        "TOTAL" : this.total,
        "SALDO" : ""
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
      titulo[0] = { text: "Nº NOTA CREDITO", bold: true };
      titulo[1] = { text: "ESTADO", bold: true };
      titulo[2] = { text: "DOCUMENTO", bold: true };
      titulo[3] = { text: "CLIENTE", bold: true };
      titulo[4] = { text: "FECHA", bold: true };
      titulo[5] = { text: "TIPO VENTA", bold: true };
      titulo[6] = { text: "TOTAL", bold: true };
      titulo[7] = { text: "SALDO A FAVOR", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_nota_credito;
        fila[1] = element.estado;
        fila[2] = element.cedula;
        fila[3] = element.cliente;
        fila[4] = element.fecha_hora;
        fila[5] = element.tipo_venta;
        fila[6] = element.importetotal;
        fila[7] = element.saldo_favor;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "SUBTOTAL IMP";
      fila[6] = this.subtotalconimpuesto;
      fila[7] = "";
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "SUBTOTAL 0";
      fila[6] = this.subtotal0;
      fila[7] = "";
      tabla.push(fila);
      
      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "TOTAL IMP";
      fila[6] = this.totalimpuesto;
      fila[7] = "";
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "TOTAL GENERAL";
      fila[6] = this.total;
      fila[7] = "";
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
            text: 'Reporte de Saldo de Nota de Crédito',
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
              widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
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

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    if(this.opcionesprivilegios["soloventaselectronicas"])
    {
      this.cod_tipo_documento = "1";
      this.tipo_documento = "FACTURA ELECTRONICA";
    }
    else
    {
      this.cod_tipo_documento = "0";
      this.tipo_documento = "TODOS";
    }

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.cod_cliente = "0";
    this.cliente = "Todos los clientes";
    this.chkcliente = true;

    this.cod_ruc = "0";
    if(this.firmasruc=="1")
    {
      this.ruc = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );
    }
    this.reiniciarValores();
  }

  reiniciarValores()
  {
    this.subtotalconimpuesto = 0;
    this.subtotal0 = 0;
    this.totalimpuesto = 0;
    this.total = 0;
    this.saldototal = 0;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscar()
  {
    this.page = 1;
    this.filterpost="";
    this.loadinglistado = true;
    this.reiniciarValores();
    
    this.notacreditoservice.listarReporteSaldoNotasCreditos(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_cliente, this.cod_tipo_documento, this.cod_ruc).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      this.subtotalconimpuesto = 0;
      this.subtotal0 = 0;
      this.totalimpuesto = 0;
      this.total = 0;
      if(data.length>0)
      {
        data.forEach(element => {
          this.subtotalconimpuesto = this.subtotalconimpuesto + parseFloat(element.subtotalconimpuesto);
          this.subtotal0 = this.subtotal0 + parseFloat(element.subtotalsinimpuesto);
          this.totalimpuesto = this.totalimpuesto + parseFloat(element.total_iva);
          this.total = this.total + parseFloat(element.importetotal);
          this.saldototal = this.saldototal + parseFloat(element.saldo_favor);
        });
        this.subtotalconimpuesto = redondeardecimales(this.subtotalconimpuesto, 2);
        this.subtotal0 = redondeardecimales(this.subtotal0, 2);
        this.totalimpuesto = redondeardecimales(this.totalimpuesto, 2);
        this.total = redondeardecimales(this.total, 2);
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
    this.listarRucEmpresas();
    const sucursal = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = sucursal.sucursal;
  }

  changeEmpresa(event: any): void {
      const elemento = event.target.value;
      this.cod_ruc = elemento;
      this.ruc = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );
  }

  changeTipoDocumento(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_documento = elemento;
    const resultado = this.datostipodocumento.find( (valor : any) => valor.cod_tipo_documento == this.cod_tipo_documento );
    this.tipo_documento = resultado.tipo_documento;
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

  async cargaListasDesplegables(): Promise<void> {
    try {
      await this.listarSucursales();
      await this.listarRucEmpresas();

      this.formularioNormal();

    } catch (error) {
      this.toastr.error("Ocurrió un error al cargar los datos", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async listarSucursales(): Promise<void> {
    this.loading = true;

    try {
      const data = await firstValueFrom(this.sucursalesservice.listarSucursales());
      this.datossucursal = data;
      this.childlistadocliente.listarClientes();
      this.childlistadoempleado.listarEmpleadosUsuarios();
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async listarRucEmpresas(): Promise<void> {
    this.loading = true;

    try {
      const data = await firstValueFrom(
        this.rucempresaservice.listarRucEmpresas(this.cod_sucursal)
      );

      this.datosrucempresa = data;

      const objetoIdentificacion = {
        cod_ruc: "0",
        empresa: "TODOS",
        razonsocial: "",
        nombrecomercial: "",
        direccion_establecimiento: ""
      };

      this.datosrucempresa.unshift(objetoIdentificacion);

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loading = false;
    }
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}