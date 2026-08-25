import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CategoriaService } from '../../services/categoria.service';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { ProductoService } from '../../services/producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-reporte-stock-producto',
  templateUrl: './reporte-stock-producto.component.html',
  styleUrls: ['./reporte-stock-producto.component.css']
})
export class ReporteStockProductoComponent implements OnInit {
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  datossubcategoria : any;
  datoscategoria : any;
  filterpost = "";

  cantidad_registros : number = 0;

  cod_sucursal : string = "";
  cod_categoria : string = "";
  categoria : string = "";
  cod_subcategoria : string = "";
  cantidad : string = "";
  chkminimoinventario : boolean = false;
  
  loadinglistado : boolean = false;
  
  subcategoria: string = "";
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

  constructor(private productoservice:ProductoService, private toastr: ToastrService, private error:ErrorService, private categoriaservice:CategoriaService, private subcategoriaservice:SubcategoriaService, private sucursalesservice:SucursalesService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    const sucursal = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = sucursal.sucursal;
  }

  changeCategoria(event: any): void {
    const elemento = event.target.value;
    this.cod_categoria = elemento;
    const resultado = this.datoscategoria.find( (valor : any) => valor.cod_categoria == this.cod_categoria );
    this.categoria = resultado.categoria;
    if(this.cod_categoria=="")
    {
      this.cod_subcategoria = "";
      this.listarsubcategoriasgenerales();
    }
    else
    {
      this.listarSubCategorias();
    }
  }

  changeSubCategoria(subcategoriaseleccionada: any): void {
    if (subcategoriaseleccionada) {
      this.subcategoria = subcategoriaseleccionada.subcategoria;
    } else {
      this.subcategoria = "";
    }
  }

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      //let element = document.getElementById("tabla");
      //const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      let json = [];
      let c=1;
      this.datos.forEach(element => {
        let obj = {
          "Nº" : c,
          "CÓDIGO" : element.codigo,
          "CATEGORíA" : element.categoria,
          "SUBCATEGORíA": element.subcategoria,
          "MARCA" : element.marca,
          "DESCRIPCIÓN" : element.descripcion,
          "COSTO" : element.costo,
          "P.V.P" : element.precio_venta,
          "EXISTENCIA" : element.existencia
        }
        c++;
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
      titulo[0] = { text: "Nº", bold: true };
      titulo[1] = { text: "CÓDIGO", bold: true };
      titulo[2] = { text: "CATEGORíA", bold: true };
      titulo[3] = { text: "SUBCATEGORíA", bold: true };
      titulo[4] = { text: "MARCA", bold: true };
      titulo[5] = { text: "DESCRIPCIÓN", bold: true };
      titulo[6] = { text: "COSTO", bold: true };
      titulo[7] = { text: "P.V.P", bold: true };
      titulo[8] = { text: "EXISTENCIA", bold: true };
      tabla.push(titulo);

      let c = 1;
      this.datos.forEach(element => {
        let fila = [];
        fila[0] = c;
        fila[1] = element.codigo;
        fila[2] = element.categoria;
        fila[3] = element.subcategoria;
        fila[4] = element.marca;
        fila[5] = element.descripcion;
        fila[6] = element.costo;
        fila[7] = element.precio_venta;
        fila[8] = element.existencia;
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
            text: 'Reporte de Stock de Productos',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'
          },

          {
          columns: [
                  {
                    stack: [
                      {
                        text: 'CATEGORÍA: ' + this.categoria,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'SUBCATEGORÍA: ' + this.subcategoria,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'MÍNIMO INVENTARIO: ' + this.cantidad,
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
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
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

  imprimir()
  {

  }

  formularioNormal(): void
  {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    
    this.cod_categoria = "";
    this.categoria = "TODOS";
    this.cod_subcategoria = "";
    this.subcategoria = "TODOS";
    this.cantidad = "";

    this.chkminimoinventario = false;

    this.listarSucursales();
    this.listarCategorias();
    this.listarsubcategoriasgenerales();

    this.cantidad_registros = 0;
    this.page = 1;
    this.filterpost="";
    this.datos = [];
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscarproductos()
  {
    if(this.cod_subcategoria==null)
    {
      this.cod_subcategoria="";
    }
   
    this.listarProductosStock();
  }
  
  listarProductosStock()
  {
    this.page = 1;
    this.filterpost="";

    this.loadinglistado = true;
    

    let cantidad = "0";
    if(this.cantidad.length == 0)
    {
      cantidad = "0";
    }
    else
    {
      cantidad = this.cantidad;
    }

    let inventario_minimo="0";
    if(this.chkminimoinventario)
    {
      inventario_minimo="1";
    }

    this.productoservice.listarProductosStock(this.cod_sucursal, cantidad,  this.cod_categoria, this.cod_subcategoria, inventario_minimo).subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
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
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }
  
  listarCategorias()
  {    
    this.loadinglistado = true;
    

    this.categoriaservice.listarCategorias().subscribe( (data : any) =>
    {
      this.datoscategoria = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarSubCategorias()
  {
    this.datossubcategoria = [];
    this.loadinglistado = true;
    

    this.subcategoriaservice.listarSubCategoriasPorCategoria(this.cod_categoria).subscribe( (data : any) =>
    {
      this.datossubcategoria = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    }); 
  }

  listarsubcategoriasgenerales()
  {
    this.datossubcategoria = [];
    this.loadinglistado = true;
    

    this.subcategoriaservice.listarSubCategorias().subscribe( (data : any) =>
    {
      this.datossubcategoria = data;
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