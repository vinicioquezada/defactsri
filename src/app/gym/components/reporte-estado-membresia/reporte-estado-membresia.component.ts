import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { MembresiaService } from '../../services/membresia.service';
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
  selector: 'app-reporte-estado-membresia',
  templateUrl: './reporte-estado-membresia.component.html',
  styleUrls: ['./reporte-estado-membresia.component.css']
})
export class ReporteEstadoMembresiaComponent implements OnInit {
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;

  datosestadomembresia = [
    {
      "cod_estado_membresia" : "CADUCADO",
      "estado_membresia" : "CADUCADO"
    },
    {
      "cod_estado_membresia" : "POR CADUCAR",
      "estado_membresia" : "POR CADUCAR"
    },
    {
      "cod_estado_membresia" : "POR INICIAR",
      "estado_membresia" : "POR INICIAR"
    },
    {
      "cod_estado_membresia" : "ACTIVO",
      "estado_membresia" : "ACTIVO"
    },
    {
      "cod_estado_membresia" : "CONGELADO",
      "estado_membresia" : "CONGELADO"
    },
  ];

  cod_sucursal : string = "";
  cod_estado_membresia : string = "CADUCADO";

  loadinglistado : boolean = false;

  cantidad_registros : number = 0;

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
  pagesize = 5;

  constructor(private router : Router, private membresiaservice:MembresiaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService) { }

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
          "MEMBRESIA" : element.plan,
          "FECHA INICIO": element.fecha_inicio,
          "FECHA FIN": element.fecha_fin
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
      titulo[2] = { text: "MEMBRESIA", bold: true };
      titulo[3] = { text: "FECHA INICIO", bold: true };
      titulo[4] = { text: "FECHA FIN", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.cliente;
        fila[1] = element.celular;
        fila[2] = element.plan;
        fila[3] = element.fecha_inicio;
        fila[4] = element.fecha_fin;
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
            text: 'Reporte de Estados de Membresía',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'
          },

          {
          columns: [
                  {
                    stack: [
                      {
                        text: 'TIPO MEMBRESÍA: ' + this.cod_estado_membresia,
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
              widths: ['*', 'auto', 'auto', 'auto', 'auto'],
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

  changeestadomembresia(event: any): void {
    const elemento = event.target.value;
    this.cod_estado_membresia = elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarEstadosMembresias();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";
    this.datos = [];

    this.cantidad_registros = 0;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
   
    this.cod_estado_membresia = "CADUCADO";
  }
 
  listarEstadosMembresias()
  {
    this.page = 1;
    this.filterpost="";

    this.loadinglistado = true;
    this.membresiaservice.listarEstadosMembresias(this.cod_sucursal, this.cod_estado_membresia).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
      this.cantidad_registros = data.length;
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