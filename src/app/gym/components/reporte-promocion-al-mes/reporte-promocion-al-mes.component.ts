import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { SocioService } from '../../services/socio.service';
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
  selector: 'app-reporte-promocion-al-mes',
  templateUrl: './reporte-promocion-al-mes.component.html',
  styleUrls: ['./reporte-promocion-al-mes.component.css']
})
export class ReportePromocionAlMesComponent implements OnInit {
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;

  datosmes = [
    {
      "cod_mes" : "0",
      "mes" : "SELECCIONE UN MES"
    },
    {
      "cod_mes" : "1",
      "mes" : "ENERO"
    },
    {
      "cod_mes" : "2",
      "mes" : "FEBRERO"
    },
    {
      "cod_mes" : "3",
      "mes" : "MARZO"
    },
    {
      "cod_mes" : "4",
      "mes" : "ABRIL"
    },
    {
      "cod_mes" : "5",
      "mes" : "MAYO"
    },
    {
      "cod_mes" : "6",
      "mes" : "JUNIO"
    },
    {
      "cod_mes" : "7",
      "mes" : "JULIO"
    },
    {
      "cod_mes" : "8",
      "mes" : "AGOSTO"
    },
    {
      "cod_mes" : "9",
      "mes" : "SEPTIEMBRE"
    },
    {
      "cod_mes" : "10",
      "mes" : "OCTUBRE"
    },
    {
      "cod_mes" : "11",
      "mes" : "NOVIEMBRE"
    },
    {
      "cod_mes" : "12",
      "mes" : "DICIEMBRE"
    }
  ];

  cod_sucursal : string = "";
  cod_mes : string = "0";

  loadinglistado : boolean = false;

  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");
  mes: string = "SELECCIONE UN MES";

  opcionesprivilegios : any;
  
  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private socioservice : SocioService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService) { }

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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "CLIENTE" : element.cliente,
          "CELULAR": element.celular,
          "CORREO" : element.correo,
          "FECHA NACIMIENTO": element.fecha_nacimiento
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

      titulo[0] = { text: "CLIENTE", bold: true };
      titulo[1] = { text: "CELULAR", bold: true };
      titulo[2] = { text: "CORREO", bold: true };
      titulo[3] = { text: "FECHA NACIMIENTO", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.cliente;
        fila[1] = element.celular;
        fila[2] = element.correo;
        fila[3] = element.fecha_nacimiento;
        tabla.push(fila);
      });

      const fechaActual = new Date().toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const pdfDefinition: any = {
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
            text: 'Reporte de Cumpleañers del Mes',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'
          },

          {
          columns: [
                  {
                    stack: [
                      {
                        text: 'MES: ' + this.mes,
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
              widths: ['*', 'auto', 'auto', 'auto'],
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

  changeMes(event: any): void {
    const elemento = event.target.value;
    this.cod_mes = elemento;
    const resultado = this.datosmes.find( (valor : any) => valor.cod_mes == this.cod_mes );
    this.mes = resultado.mes;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      if(this.cod_mes == "0")
      {
        this.toastr.warning("Selecciona un mes para buscar", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.listarUsuarioMesCumpleanios();
      }
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

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
   
    this.cod_mes = "0";
    this.mes = "SELECCIONE UN MES";
  }
 
  listarUsuarioMesCumpleanios()
  {
    this.page = 1;
    this.filterpost="";

    this.loadinglistado = true;
    this.socioservice.listarUsuarioMesCumpleanios(this.cod_sucursal, this.cod_mes).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
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
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}