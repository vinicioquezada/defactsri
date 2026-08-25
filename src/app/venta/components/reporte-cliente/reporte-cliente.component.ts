import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-reporte-cliente',
  templateUrl: './reporte-cliente.component.html',
  styleUrls: ['./reporte-cliente.component.css']
})
export class ReporteClienteComponent implements OnInit {

  cantidad_registros : number = 0;

  datos : any;
  filterpost = "";
  
  loadinglistado : boolean = false;

  
  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private clienteservice:ClienteService, private imageservice: ImageService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.formularioNormal();
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
          "IDENTIFICACIÓN" : element.cedula,
          "APELLIDOS" : element.apellido,
          "NOMBRES" : element.nombre,
          "CONVENCIONAL": element.convencional,
          "CELULAR" : element.celular,
          "CORREO" : element.correo,
          "DIRECCIÓN" : element.direccion
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

  async exportarPdf()
  {
    if(this.datos.length>0)
    {
      let tabla = [];
      let titulo = [];
      titulo[0] = { text: "Nº", bold: true };
      titulo[1] = { text: "APELLIDO", bold: true };
      titulo[2] = { text: "NOMBRE", bold: true };
      titulo[3] = { text: "CONVENCIONAL", bold: true };
      titulo[4] = { text: "CELULAR", bold: true };
      titulo[5] = { text: "CORREO", bold: true };
      titulo[6] = { text: "DIRECCIÓN", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.cedula;
        fila[1] = element.apellido;
        fila[2] = element.nombre;
        fila[3] = element.convencional;
        fila[4] = element.celular;
        fila[5] = element.correo;
        fila[6] = element.direccion;
        tabla.push(fila);
      });

      const fechaActual = new Date().toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      //const logoBase64 = await this.imageservice.getBase64ImageGeneralFromURL();

      const pdfDefinition: any = {
        //pageOrientation: 'portrait',
        pageOrientation: 'landscape',
        
        content: [
          /*
          {
          columns: [ 
            {
                image: logoBase64,
                alignment: 'left',
                margin: [0, 0, 0, 0],
                width: 80
              },
              {
                stack: [
                    {
                      text: 'LA HACIENDA',
                      alignment: 'center',
                      fontSize: 16,
                      bold: true,
                      color: '#047886'
                    },
                    {
                      text: 'Reporte de Clientes',
                      alignment: 'center',
                      fontSize: 16,
                      bold: true,
                      color: '#047886',
                      margin: [0, 5, 0, 0]
                    }
                  ],
                  margin: [0, 0, 0, 0]
              }
            ],
            margin: [0, 0, 0, 0]
          },
          */

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
            text: 'Reporte de Clientes',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886',
            margin: [0, 0, 0, 10]
          },

 
          {
            table: {
              widths: ['auto', '*', 'auto', 'auto', 'auto', 150, 150],
              body:
                tabla
            },
            style: 'tablaContenido'
          }
        ],
        styles: {
          tablaContenido: {
            fontSize: 10
          }
        }
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

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal(): void
  {
    this.cantidad_registros = 0;
    this.page = 1;
    this.filterpost="";
    this.datos = [];
    this.listarClientes();
  }
 
  listarClientes()
  {
    this.page = 1;
    this.filterpost="";
    
    this.loadinglistado = true;
    

    this.clienteservice.listar().subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
      this.cantidad_registros = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}