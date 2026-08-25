import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-reporte-proveedor',
  templateUrl: './reporte-proveedor.component.html',
  styleUrls: ['./reporte-proveedor.component.css']
})
export class ReporteProveedorComponent implements OnInit {
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

  constructor(private toastr: ToastrService, private error:ErrorService, private proveedorservicee:ProveedorService, private usersession: UserSessionService) { }

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
          "Nº IDENTIFICACIÓN" : element.ruc,
          "RAZÓN SOCIAL" : element.razon_social,
          "NOMBRE COMERCIAL" : element.nombre_comercial,
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

  exportarPdf()
  {
    if(this.datos.length>0)
    {
      let tabla = [];
      let titulo = [];
      titulo[0] = { text: "Nº IDENTIFICACIÓN", bold: true };
      titulo[1] = { text: "RAZÓN SOCIAL", bold: true };
      titulo[2] = { text: "NOMBRE COMERCIAL", bold: true };
      titulo[3] = { text: "CONVENCIONAL", bold: true };
      titulo[4] = { text: "CELULAR", bold: true };
      titulo[5] = { text: "CORREO", bold: true };
      titulo[6] = { text: "DIRECCIÓN", bold: true };
      tabla.push(titulo);

      let c = 1;
      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.ruc;
        fila[1] = element.razon_social;
        fila[2] = element.nombre_comercial;
        fila[3] = element.convencional;
        fila[4] = element.celular;
        fila[5] = element.correo;
        fila[6] = element.direccion;
        tabla.push(fila);
        c++;
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
            text: 'Reporte de Proveedores',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886',
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
    

    this.proveedorservicee.listar().subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
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