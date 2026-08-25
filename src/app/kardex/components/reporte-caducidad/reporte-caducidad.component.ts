import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CategoriaService } from 'src/app/almacen/services/categoria.service';
import { SubcategoriaService } from 'src/app/almacen/services/subcategoria.service';
import { KardexService } from '../../services/kardex.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ListadoProductoGeneralComponent } from 'src/app/shared/components/listado-producto/listado-producto-general/listado-producto-general.component';
import * as moment from 'moment';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-caducidad',
  templateUrl: './reporte-caducidad.component.html',
  styleUrls: ['./reporte-caducidad.component.css']
})
export class ReporteCaducidadComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoProductoGeneralComponent) childlistadoproductogeneral!: ListadoProductoGeneralComponent;

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
  subcategoria : string = "";
  
  loadinglistado : boolean = false;

  chkproducto : boolean = true;
  cod_producto : string = "";
  producto : string = "";

  fechahasta : string = "";

  cantidadactivo : number = 0;
  cantidadporcaducar : number = 0;
  cantidadcaducados : number = 0;
  cantidadnoasignado : number = 0;

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

  constructor(private kardexservice:KardexService, private toastr: ToastrService, private error:ErrorService, private categoriaservice:CategoriaService, private subcategoriaservice:SubcategoriaService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
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
          "T. COSTO 0" : element.cantidadactivo2,
          "T. COSTO + IMP." : element.cantidadporcaducar2,
          "EXISTENCIA" : element.cantidadcaducados2
        }
        c++;
        json.push(obj);
      });

      let obj = {
        "Nº" : "",
        "CÓDIGO" : "",
        "CATEGORíA" : "",
        "SUBCATEGORíA": "",
        "MARCA" : "",
        "DESCRIPCIÓN" : "",
        "T. COSTO 0" : "",
        "T. COSTO + IMP." : "T. COSTO",
        "EXISTENCIA" : this.cantidadactivo
      }
      json.push(obj);

      obj = {
        "Nº" : "",
        "CÓDIGO" : "",
        "CATEGORíA" : "",
        "SUBCATEGORíA": "",
        "MARCA" : "",
        "DESCRIPCIÓN" : "",
        "T. COSTO 0" : "",
        "T. COSTO + IMP." : "T. COSTO IMP",
        "EXISTENCIA" : this.cantidadporcaducar
      }
      json.push(obj);

      obj = {
        "Nº" : "",
        "CÓDIGO" : "",
        "CATEGORíA" : "",
        "SUBCATEGORíA": "",
        "MARCA" : "",
        "DESCRIPCIÓN" : "",
        "T. COSTO 0" : "",
        "T. COSTO + IMP." : "EXISTENCIA",
        "EXISTENCIA" : this.cantidadcaducados
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
      titulo[1] = { text: "CÓDIGO", bold: true };
      titulo[2] = { text: "CATEGORíA", bold: true };
      titulo[3] = { text: "SUBCATEGORíA", bold: true };
      titulo[4] = { text: "MARCA", bold: true };
      titulo[5] = { text: "DESCRIPCIÓN", bold: true };
      titulo[6] = { text: "FECHA CADUCIDAD", bold: true };
      titulo[7] = { text: "ESTADO", bold: true };
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
        fila[6] = element.fecha_caducidad;
        fila[7] = element.estado;
        tabla.push(fila);
        c++;
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "ACTIVOS";
      fila[7] = this.cantidadactivo;
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "POR CADUCAR";
      fila[7] = this.cantidadporcaducar;
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "CADUCADOS";
      fila[7] = this.cantidadcaducados;
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "NO ASIGNADO";
      fila[7] = this.cantidadnoasignado;
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
            text: 'Reporte de caducidad de productos',
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
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  },


                  {
                    stack: [
                      {
                        text: 'PRODUCTO: ' + this.producto,
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
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  }
                ],
                margin: [0, 0, 0, 10]
          },

          {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto'],
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
    this.categoria = "TODAS";
    this.cod_subcategoria = "";
    this.subcategoria = "TODAS";

    this.cod_producto = "0";
    this.producto = "Todos los productos";
    this.chkproducto = true;

    this.listarSucursales();
    this.listarCategorias();
    this.listarsubcategoriasgenerales();

    this.cantidad_registros = 0;
    this.page = 1;
    this.filterpost="";
    this.datos = [];

    this.fechahasta = moment().format('YYYY-MM-DD');

    this.cantidadactivo = 0;
    this.cantidadporcaducar = 0;
    this.cantidadcaducados = 0;
    this.cantidadnoasignado = 0;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscar() {
    if(this.cod_subcategoria==null)
      {
        this.cod_subcategoria="";
      }
     
      this.listarproductoscaducidad();
  }

  changechkproducto()
  {
    this.cod_producto = "0";
    this.producto = "";
    if(this.chkproducto==true){
      this.chkproducto = false;
    }else{
      this.chkproducto = true;
      this.producto = "Todos los productos";
    }
  }

  recibirDatosProducto(datosrecibidosproducto: any)
  {
    this.cod_producto = datosrecibidosproducto.cod_producto;
    this.producto = datosrecibidosproducto.descripcion;
    this.chkproducto = false;
    $("#mymodallistarproductos").modal("hide");
  }
  clickListarProductos()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    $("#mymodallistarproductos").modal("show");
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
    this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }
  
  listarproductoscaducidad()
  {
    this.page = 1;
    this.filterpost="";

    this.loadinglistado = true;
    

    this.kardexservice.listarProductosCaducidad(this.cod_sucursal, this.cod_categoria, this.cod_subcategoria, this.cod_producto, this.fechahasta).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidadactivo = 0;
			this.cantidadporcaducar = 0;
			this.cantidadcaducados = 0;
      this.cantidadnoasignado = 0;
      if(data.length>0)
      {
        const format = 'YYYY-MM-DD'; 
        let fechahasta = moment(this.fechahasta, format);
        data.forEach(element => {
          if(element.fecha_caducidad == "2000-01-01") {
            this.cantidadnoasignado = this.cantidadnoasignado + 1;
            element.estado = "NO ASIGNADO";
          } else {
            let fechacaducidad = moment(element.fecha_caducidad, format);
            if(fechacaducidad.isAfter(fechahasta)) {
              //console.log("Si " + fechacaducidad.format('YYYY-MM-DD') + " es mayor igual que " + fechahasta.format('YYYY-MM-DD'));
              let fechaactual = moment(fechahasta, format);
              let nuevafecha = moment(fechaactual.add(21, 'days'), format);
              if(fechacaducidad.isAfter(nuevafecha)) {
                //console.log("Si " + fechacaducidad.format('YYYY-MM-DD') + " es mayor igual que " + nuevafecha.format('YYYY-MM-DD'));
                this.cantidadactivo = this.cantidadactivo + 1;
                element.estado = "ACTIVO";
              } else {
                //console.log("No " + fechacaducidad.format('YYYY-MM-DD') + " es mayor igual que " + nuevafecha.format('YYYY-MM-DD'));
                this.cantidadporcaducar = this.cantidadporcaducar + 1;
                element.estado = "POR CADUCAR";
              }
            } else {
              //console.log("No " + fechacaducidad.format('YYYY-MM-DD') + " es mayor igual que " + fechahasta.format('YYYY-MM-DD'));
              this.cantidadcaducados = this.cantidadcaducados + 1;
              element.estado = "CADUCADO";
            }
          }
        });
        this.cantidadactivo = redondeardecimales(this.cantidadactivo, 4);
        this.cantidadporcaducar = redondeardecimales(this.cantidadporcaducar, 2);
      }
      this.datos = data;
      this.cantidad_registros = data.length;
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
      
      this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
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
      this.loadinglistado = false;
      this.datoscategoria = data;
      const objeto = {
        cod_categoria: "",
        categoria: "TODAS",
      };
      this.datoscategoria.unshift(objeto);
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  listarSubCategorias()
  {
    this.loadinglistado = true;
    this.datossubcategoria = [];
    this.subcategoriaservice.listarSubCategoriasPorCategoria(this.cod_categoria).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datossubcategoria = data;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
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