import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { SalidaMercaderiaService } from '../../services/salida-mercaderia.service';
import { TipoSalidaMercaderiaService } from '../../services/tipo-salida-mercaderia.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { redondeardecimales } from '../../../shared/js/decimales.js';

@Component({
  selector: 'app-reporte-salida-mercaderia-valoradas',
  templateUrl: './reporte-salida-mercaderia-valoradas.component.html',
  styleUrls: ['./reporte-salida-mercaderia-valoradas.component.css']
})
export class ReporteSalidaMercaderiaValoradasComponent implements OnInit {
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;

  datostiposalidamercaderia : any;
  cod_sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  cod_tipo_salida_mercaderia : string = "";

  loadinglistado : boolean = false;
  

  disabledbtneditar : boolean = false;
  disabledbtnanular : boolean = false;

  chkempleado : boolean = true;
  cod_usuario : string = "";
  empleado : string = "";

  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");
  tiposalidamercaderia: string = "";

  opcionesprivilegios : any;

  totalcosto: number = 0;
  totalprecioventa: number = 0;

  cantidad_registros : number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private salidamercaderiaservice:SalidaMercaderiaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private tiposalidamercaderiaservice:TipoSalidaMercaderiaService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
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
          "Nº SALIDA" : element.numero_salida,
          "FECHA": element.fecha_hora,
          "USUARIO" : element.usuario,
          "TIPO SALIDA" : element.tipo_salida_mercaderia,
          "PRODUCTO": element.detalle,
          "UNIDADES": element.cantidad_unidad,
          "COSTO": element.costo,
          "TOTAL COSTO": element.total_costo,
          "PRECIO VENTA": element.precio_venta,
          "TOTAL PRECIO VENTA": element.total_precio_venta
        }
        json.push(obj);
      });

      let obj = {
        "Nº SALIDA" : "",
        "FECHA": "",
        "USUARIO" : "",
        "TIPO SALIDA" : "",
        "PRODUCTO": "",
        "UNIDADES": "",
        "COSTO": "",
        "TOTAL COSTO": "",
        "PRECIO VENTA": "TOTAL COSTO",
        "TOTAL PRECIO VENTA": this.totalcosto
      }
      json.push(obj);

      obj = {
        "Nº SALIDA" : "",
        "FECHA": "",
        "USUARIO" : "",
        "TIPO SALIDA" : "",
        "PRODUCTO": "",
        "UNIDADES": "",
        "COSTO": "",
        "TOTAL COSTO": "",
        "PRECIO VENTA": "TOTAL PRECIO VENTA",
        "TOTAL PRECIO VENTA": this.totalprecioventa
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
      titulo[0] = { text: "Nº", bold: true };
      titulo[1] = { text: "FECHA", bold: true };
      titulo[2] = { text: "USUARIO", bold: true };
      titulo[3] = { text: "TIPO SALIDA", bold: true };
      titulo[4] = { text: "PRODUCTO", bold: true };
      titulo[5] = { text: "UNIDADES", bold: true };
      titulo[6] = { text: "COSTO", bold: true };
      titulo[7] = { text: "TOTAL C", bold: true };
      titulo[8] = { text: "PRECIO V", bold: true };
      titulo[9] = { text: "TOTAL", bold: true };
      
      
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_salida;
        fila[1] = element.fecha_hora;
        fila[2] = element.usuario;
        fila[3] = element.tipo_salida_mercaderia;
        fila[4] = element.detalle;
        fila[5] = element.cantidad_unidad;
        fila[6] = element.costo;
        fila[7] = element.total_costo;
        fila[8] = element.precio_venta;
        fila[9] = element.total_precio_venta;
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
      fila[7] = "";
      fila[8] = "TOTAL COSTO";
      fila[9] = this.totalcosto;
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "";
      fila[7] = "";
      fila[8] = "TOTAL PRECIO";
      fila[9] = this.totalprecioventa;
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
            text: 'Reporte de salida de Mercadería Valoradas',
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
                        text: 'TIPO SALIDA MERCADERÍA: ' + this.tiposalidamercaderia,
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
                      },
                      {
                        text: '',
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
              widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
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

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    const sucursal = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = sucursal.sucursal;
  }

  changeTipoSalidaMercaderia(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_salida_mercaderia = elemento;
    const resultado = this.datostiposalidamercaderia.find( (valor : any) => valor.cod_tipo_salida_mercaderia == this.cod_tipo_salida_mercaderia );
    this.tiposalidamercaderia = resultado.tipo_salida_mercaderia;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarSalidasValoradas();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal()
  {
    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.cod_tipo_salida_mercaderia = "T";
    this.tiposalidamercaderia = "TODOS";

    this.reiniciarValores();
  }

  reiniciarValores()
  {
    this.page = 1;
    this.filterpost="";
    this.datos = [];

    this.totalcosto = 0;
    this.totalprecioventa = 0;

    this.cantidad_registros = 0;
  }
 
  listarSalidasValoradas()
  {
    this.loadinglistado = true;
    this.reiniciarValores();
    this.salidamercaderiaservice.listarSalidasValoradas(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_salida_mercaderia).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;

      if(data.length>0)
      {
        data.forEach(element => {
          this.totalcosto = this.totalcosto + parseFloat(element.total_costo);
          this.totalprecioventa = this.totalprecioventa + parseFloat(element.total_precio_venta);
        });
        this.totalcosto = redondeardecimales(this.totalcosto, 2);
        this.totalprecioventa = redondeardecimales(this.totalprecioventa, 2);
      }

      this.datos = data;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  listarSucursales()
  {    
    this.loadinglistado = true;
    

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.listartiposalidamercaderia();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listartiposalidamercaderia()
  {    
    this.loadinglistado = true;
    

    this.tiposalidamercaderiaservice.listarTipoSalidaMercaderias().subscribe( (data : any) =>
    {
      let datostiposalida = [
        {
          "cod_tipo_salida_mercaderia" : "T",
          "tipo_salida_mercaderia" : "TODOS"
        }
      ];

      data.forEach(element => {
        let obj = {
          "cod_tipo_salida_mercaderia" : element.cod_tipo_salida_mercaderia,
          "tipo_salida_mercaderia" : element.tipo_salida_mercaderia
        }
        datostiposalida.push(obj);
      });

      this.datostiposalidamercaderia = datostiposalida;
      this.loadinglistado = false;
      
      this.formularioNormal();
      this.childlistadoempleado.listarEmpleadosUsuarios();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
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

  handlePageChange(event: number): void {
    this.page = event;
  }

}