import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { IngresoMercaderiaService } from '../../services/ingreso-mercaderia.service';
import { TipoIngresoMercaderiaService } from '../../services/tipo-ingreso-mercaderia.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';

import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';

import { Router } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-reporte-ingreso-mercaderia',
  templateUrl: './reporte-ingreso-mercaderia.component.html',
  styleUrls: ['./reporte-ingreso-mercaderia.component.css']
})
export class ReporteIngresoMercaderiaComponent implements OnInit {
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;

  datostipoingresomercaderia : any;
  cod_sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  cod_tipo_ingreso_mercaderia : string = "";

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
  tipoingresomercaderia: string = "";

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private ingresomercaderiaservice:IngresoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private tipoingresomercaderiaservice:TipoIngresoMercaderiaService, private usersession: UserSessionService) { }

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
          "Nº INGRESO" : element.numero_ingreso,
          "FECHA": element.fecha_hora,
          "USUARIO" : element.usuario,
          "TIPO INGRESO" : element.tipo_ingreso_mercaderia,
          "PRODUCTO": element.detalle,
          "C/U": element.cantidad_comprar,
          "C/P": element.cantidad_empaque,
          "C/AJ": element.fecha_cantidad_ajuste,
          "UNIDADES": element.cantidad_unidad
        }
        json.push(obj);
      });
    
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
      titulo[0] = { text: "Nº INGRESO", bold: true };
      titulo[1] = { text: "FECHA", bold: true };
      titulo[2] = { text: "USUARIO", bold: true };
      titulo[3] = { text: "TIPO INGRESO", bold: true };
      titulo[4] = { text: "PRODUCTO", bold: true };
      titulo[5] = { text: "C/U", bold: true };
      titulo[6] = { text: "C/P", bold: true };
      titulo[7] = { text: "C/AJ", bold: true };
      titulo[8] = { text: "UNIDADES", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_ingreso;
        fila[1] = element.fecha_hora;
        fila[2] = element.usuario;
        fila[3] = element.tipo_ingreso_mercaderia;
        fila[4] = element.detalle;
        fila[5] = element.cantidad_comprar;
        fila[6] = element.cantidad_empaque;
        fila[7] = element.cantidad_ajuste;
        fila[8] = element.cantidad_unidad;
        tabla.push(fila);
      });

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
            text: 'Reporte de Ingreso de Mercadería',
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
                        text: 'TIPO INGRESO MERCADERÍA: ' + this.tipoingresomercaderia,
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
              widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
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

  changeTipoIngresoMercaderia(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_ingreso_mercaderia = elemento;
    const resultado = this.datostipoingresomercaderia.find( (valor : any) => valor.cod_tipo_ingreso_mercaderia == this.cod_tipo_ingreso_mercaderia );
    this.tipoingresomercaderia = resultado.tipo_ingreso_mercaderia;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarIngresosMercaderias();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal(): void
  {
    this.page = 1;
    this.filterpost="";
    this.datos = [];

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.cod_tipo_ingreso_mercaderia = "T";
    this.tipoingresomercaderia = "TODOS";
  }
 
  listarIngresosMercaderias()
  {
    this.page = 1;
    this.filterpost="";

    this.loadinglistado = true;
    

    this.ingresomercaderiaservice.listarIngresosReporte(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_ingreso_mercaderia).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
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
      
      this.listartipoingresomercaderia();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listartipoingresomercaderia()
  {    
    this.loadinglistado = true;
    

    this.tipoingresomercaderiaservice.listarTipoIngresoMercaderias().subscribe( (data : any) =>
    {
      let datostipoingreso = [
        {
          "cod_tipo_ingreso_mercaderia" : "T",
          "tipo_ingreso_mercaderia" : "TODOS"
        }
      ];

      data.forEach(element => {
        let obj = {
          "cod_tipo_ingreso_mercaderia" : element.cod_tipo_ingreso_mercaderia,
          "tipo_ingreso_mercaderia" : element.tipo_ingreso_mercaderia
        }
        datostipoingreso.push(obj);
      });

      this.datostipoingresomercaderia = datostipoingreso;
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