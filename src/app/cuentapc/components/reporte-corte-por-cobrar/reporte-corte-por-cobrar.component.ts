import { Component, OnInit, ViewChild } from '@angular/core';
import { AbonoVentaService } from '../../services/abono-venta.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ListadoClienteComponent } from 'src/app/shared/components/listado-cliente/listado-cliente.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-corte-por-cobrar',
  templateUrl: './reporte-corte-por-cobrar.component.html',
  styleUrls: ['./reporte-corte-por-cobrar.component.css']
})
export class ReporteCortePorCobrarComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoClienteComponent) childlistadocliente: any;

  datos : any;
  datossucursal : any;

  filterpost = "";

  cod_sucursal : string = "";

  fechahasta : string = "";
  
  loadinglistado : boolean = false;
  


  chkcliente : boolean = true;
  cod_cliente : string = "";
  cliente : string = "";

  detalle : string = "";

  totalimporte : number = 0;
  totaldeuda : number = 0;

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

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private abonoventaservice : AbonoVentaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "CLIENTE" : element.cliente,
          "NUMERO FACTURA" : element.numero_factura,
          "FECHA VENTA" : element.fecha_registro,
          "ULT. FECH PAGO": element.fecha_ultimo_pago,
          "DÍA PAGO" : element.dia_pago,
          "CUOTAS. P." : element.cantidad_cuotas_pagadas,
          "ESTADO" : element.estado,
          "TOTAL" : element.importetotal,
          "DEUDA TOTAL" : element.deuda_valor
        }
        json.push(obj);
      });

      let obj = {
        "CLIENTE" : "",
        "NUMERO FACTURA" : "",
        "FECHA VENTA" : "",
        "ULT. FECH PAGO": "",
        "DÍA PAGO" : "",
        "CUOTAS. P." : "",
        "ESTADO" : "",
        "TOTAL" : "TOTAL IMPORTE",
        "DEUDA TOTAL" : redondeardecimales(this.totalimporte, 2)
      };
      json.push(obj);

      obj = {
        "CLIENTE" : "",
        "NUMERO FACTURA" : "",
        "FECHA VENTA" : "",
        "ULT. FECH PAGO": "",
        "DÍA PAGO" : "",
        "CUOTAS. P." : "",
        "ESTADO" : "",
        "TOTAL" : "TOTAL DEUDA",
        "DEUDA TOTAL" : redondeardecimales(this.totaldeuda, 2)
      };
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
      titulo[0] = { text: "CLIENTE", bold: true };
      titulo[1] = { text: "NUMERO FACTURA", bold: true };
      titulo[2] = { text: "FECHA VENTA", bold: true };
      titulo[3] = { text: "ULT. FECH PAGO", bold: true };
      titulo[4] = { text: "DÍA PAGO", bold: true };
      titulo[5] = { text: "CUOTAS. P.", bold: true };
      titulo[6] = { text: "ESTADO", bold: true };
      titulo[7] = { text: "TOTAL", bold: true };
      titulo[8] = { text: "DEUDA TOTAL", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
          fila[0] = element.cliente;
          fila[1] = element.numero_factura;
          fila[2] = element.fecha_registro;
          fila[3] = element.fecha_ultimo_pago;
          fila[4] = element.dia_pago;
          fila[5] = element.cantidad_cuotas_pagadas;
          fila[6] = element.estado;
          fila[7] = element.importetotal;
          fila[8] = element.deuda_valor;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "";
      fila[7] = "TOTAL IMPORTE";
      fila[8] = redondeardecimales(this.totalimporte, 2);
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "";
      fila[7] = "TOTAL DEUDA";
      fila[8] = redondeardecimales(this.totaldeuda, 2);
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
            text: 'Reporte de corte por cobrar',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'
          },

          {
          columns: [
                  {
                    stack: [
                      {
                        text: 'CLIENTE: ' + this.cliente,
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
              widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.cod_cliente = "0";
    this.cliente = "Todos los clientes";
    this.chkcliente = true;

    this.detalle = "";

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
    
    this.abonoventaservice.listarCortesCobrar(this.fechahasta, this.cod_sucursal, this.cod_cliente).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      let datos = [];
      if(data.length>0)
      {
        data.forEach(element => {
          
          let fecha_ultimo_pago="";
          if(element.fecha_ultimo_pago==null)
          {
            fecha_ultimo_pago = "SIN PAGO";
          }
          else
          {
            fecha_ultimo_pago = element.fecha_ultimo_pago;
          }
  
          let estado="";
          let cantidad_cuotas_pagadas=element.cantidad_cuotas_pagadas;
          let cantidad_cuotas_corte=element.cantidad_cuotas_corte;
          let dia_pago = element.dia_pago;
          if(dia_pago==0)
          {
            estado = "ADEUDADO";
          }
          else
          {
            if(parseInt(cantidad_cuotas_pagadas)>=parseInt(cantidad_cuotas_corte))
            {
              estado = "AL DIA";
            }
            else
            {
              estado = "ATRASADO";
            }
          }
          
          let importe=0;
          if(element.tipo_credito==1)
          {
            importe = parseFloat(element.importetotal);
          }
          else
          {
            importe = parseFloat(element.importe_deuda);
          }

          this.totalimporte = this.totalimporte + importe;
          this.totaldeuda = this.totaldeuda + parseFloat(element.deuda_valor);

          let fila = {
            "cliente" : element.cliente,
            "numero_factura" : element.numero_factura,
            "detalle" : element.detalle,
            "fecha_registro" : element.fecha_registro,
            "fecha_ultimo_pago" : fecha_ultimo_pago,
            "dia_pago" : element.dia_pago,
            "cantidad_cuotas_pagadas" : element.cantidad_cuotas_pagadas,
            "estado" : estado,
            "importetotal" : redondeardecimales(importe, 2),
            "deuda_valor" : redondeardecimales(element.deuda_valor, 2)
          }

          datos.push(fila);
        });
        this.totalimporte = redondeardecimales(this.totalimporte, 2);
        this.totaldeuda = redondeardecimales(this.totaldeuda, 2);
      }
      this.datos = datos;
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
    this.loadinglistado = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.childlistadocliente.listarClientes();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
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

  revisarDetalles(detalle : string)
  {
    this.detalle = detalle;
    $("#mymodalrevisardetalles").modal("show");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}