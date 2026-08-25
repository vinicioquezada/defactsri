import { Component, OnInit, ViewChild } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CategoriaService } from 'src/app/almacen/services/categoria.service';
import { SubcategoriaService } from 'src/app/almacen/services/subcategoria.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
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
  selector: 'app-reporte-venta-por-categoria',
  templateUrl: './reporte-venta-por-categoria.component.html',
  styleUrls: ['./reporte-venta-por-categoria.component.css']
})
export class ReporteVentaPorCategoriaComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;
  @ViewChild(ListadoClienteComponent) childlistadocliente: any;

  datos : any;
  datossucursal : any;

  datoscategoria : any;
  datossubcategoria : any;

  cod_tipo_documento : string = "";
  datostipodocumento : any[] = [
    {
      "cod_tipo_documento" : 0,
      "tipo_documento" : "TODOS",
    },
    {
      "cod_tipo_documento" : 1,
      "tipo_documento" : "FACTURA ELECTRÓNICA",
    },
    {
      "cod_tipo_documento" : 2,
      "tipo_documento" : "FACTURA",
    },
    {
      "cod_tipo_documento" : 3,
      "tipo_documento" : "RECIBO",
    }
    // {
    //   "cod_tipo_documento" : 4,
    //   "tipo_documento" : "VENTA PENDIENTE",
    // }
  ];

  cod_tipo_deuda : string = "";
  datostipodeuda : any[] = [
    {
      "cod_tipo_deuda" : "T",
      "tipo_deuda" : "TODOS",
    },
    {
      "cod_tipo_deuda" : "0",
      "tipo_deuda" : "SIN DEUDA",
    },
    {
      "cod_tipo_deuda" : "1",
      "tipo_deuda" : "POR COBRAR",
    }
  ];

  filterpost = "";

  cod_sucursal : string = "";
  cod_usuario : string = "";
  empleado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  tipo_venta : string = "";
  
  loading : boolean = false;
  loadinglistado :boolean = false;

  chkempleado : boolean = true;

  chkcliente : boolean = true;
  cod_cliente : string = "";
  cliente : string = "";

  cod_categoria : string = "";
  categoria : string = "";
  cod_subcategoria : string = "";
  subcategoria : string = "";

  total : number = 0;
  totalimpuesto : number = 0;
  totalfinal : number = 0;

  firmasruc: string = "";
  cod_ruc: string = "0";
  datosrucempresa : any = [];

  tipo_documento : string = "";
  tipo_deuda : string = "TODOS";
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

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private formapagoservice : FormaPagoService, private ventaservice : VentaService, private categoriaservice:CategoriaService, private subcategoriaservice:SubcategoriaService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
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
          "CATEGORÍA" : element.categoria,
          "SUBCATEGORÍA" : element.subcategoria,
          "DETALLE" : element.detalle,
          "TARIFA": element.tarifa,
          "PRECIO" : element.precio,
          "CANTIDAD" : element.cantidad_comprar,
          "TOTAL" : element.total,
          "TOTAL IMP." : element.total_iva,
          "TOTAL FINAL" : element.total_final
        }
        json.push(obj);
      });

      let obj = {
        "CATEGORÍA" : "",
        "SUBCATEGORÍA" : "",
        "DETALLE" : "",
        "TARIFA": "",
        "PRECIO" : "",
        "CANTIDAD" : "",
        "TOTAL" : "",
        "TOTAL IMP." : "SUBTOTAL",
        "TOTAL FINAL" : this.total
      }
      json.push(obj);

      obj = {
        "CATEGORÍA" : "",
        "SUBCATEGORÍA" : "",
        "DETALLE" : "",
        "TARIFA": "",
        "PRECIO" : "",
        "CANTIDAD" : "",
        "TOTAL" : "",
        "TOTAL IMP." : "TOTAL IMP",
        "TOTAL FINAL" : this.totalimpuesto
      }
      json.push(obj);

      obj = {
        "CATEGORÍA" : "",
        "SUBCATEGORÍA" : "",
        "DETALLE" : "",
        "TARIFA": "",
        "PRECIO" : "",
        "CANTIDAD" : "",
        "TOTAL" : "",
        "TOTAL IMP." : "TOTAL",
        "TOTAL FINAL" : this.totalfinal
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
      titulo[0] = { text: "CATEGORÍA", bold: true };
      titulo[1] = { text: "SUBCATEGORÍA", bold: true };
      titulo[2] = { text: "DETALLE", bold: true };
      titulo[3] = { text: "TARIFA", bold: true };
      titulo[4] = { text: "PRECIO", bold: true };
      titulo[5] = { text: "CANTIDAD", bold: true };
      titulo[6] = { text: "TOTAL", bold: true };
      titulo[7] = { text: "TOTAL IMP.", bold: true };
      titulo[8] = { text: "TOTAL FINAL", bold: true };
      tabla.push(titulo);

      let c = 1;
      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.categoria;
        fila[1] = element.subcategoria;
        fila[2] = element.detalle;
        fila[3] = element.tarifa;
        fila[4] = element.precio;
        fila[5] = element.cantidad_comprar;
        fila[6] = element.total;
        fila[7] = element.total_iva;
        fila[8] = element.total_final;
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
      fila[6] = "";
      fila[7] = "SUBTOTAL";
      fila[8] = this.total;
      tabla.push(fila);

      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "";
      fila[7] = "TOTAL IMP";
      fila[8] = this.totalimpuesto;
      tabla.push(fila);
      
      fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "";
      fila[7] = "TOTAL";
      fila[8] = this.totalfinal;
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
            text: 'Reporte de Ventas Por Categorías',
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
                      },
                      {
                        text: 'TIPO DEUDA: ' + this.tipo_deuda,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                    ],
                    margin: [0, 0, 0, 0]
                  },


                  {
                    stack: [
                      {
                        text: 'CATEGORÍA: ' + this.categoria,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'SUBCATEGORÍA: ' + this.subcategoria,
                        alignment: 'right',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
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
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  }
                ],
                margin: [0, 0, 0, 10]
          },
          
          {
            table: {
              widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
    
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    this.cod_tipo_documento = "0";
    this.cod_tipo_deuda = "T";
    

    this.cod_cliente = "0";
    this.cliente = "Todos los clientes";
    this.chkcliente = true;

    this.cod_categoria = "";
    this.categoria = "TODAS";
    this.cod_subcategoria = "";
    this.subcategoria = "TODAS";

    this.reiniciarValores();

    this.tipo_deuda = "TODOS";
    this.tipo_documento = "TODOS";
    this.cod_ruc = "0";
    if(this.firmasruc=="1")
    {
      this.ruc = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );
    }
  }

  reiniciarValores()
  {
    this.total = 0;
    this.totalimpuesto = 0;
    this.totalfinal = 0;
    this.cantidad_registros = 0;
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
    
    this.ventaservice.listarVentasCategorias(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.cod_tipo_deuda, this.cod_cliente, this.cod_categoria, this.cod_subcategoria, this.cod_ruc).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;

      if(data.length>0)
      {
        data.forEach(element => {
          this.total = this.total + parseFloat(element.total);
          this.totalimpuesto = this.totalimpuesto + parseFloat(element.total_iva);
          this.totalfinal = this.totalfinal + parseFloat(element.total_final);
        });
        this.total = redondeardecimales(this.total, 2);
        this.totalimpuesto = redondeardecimales(this.totalimpuesto, 2);
        this.totalfinal = redondeardecimales(this.totalfinal, 2);
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

  changeTipoDeuda(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_deuda = elemento;
    const resultado = this.datostipodeuda.find( (valor : any) => valor.cod_tipo_deuda == this.cod_tipo_deuda );
    this.tipo_deuda = resultado.tipo_deuda;
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

  listarCategorias()
  {    
    this.loading = true;
    

    this.categoriaservice.listarCategorias().subscribe( (data : any) =>
    {
      this.datoscategoria = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  changeCategoria(event: any): void {
    const elemento = event.target.value;
    this.cod_categoria = elemento;
    this.cod_subcategoria = "";
    const resultado = this.datoscategoria.find( (valor : any) => valor.cod_categoria == this.cod_categoria );
    this.categoria = resultado.categoria;
    this.listarSubCategorias();
  }

  changeSubCategoria(subcategoriaseleccionada: any): void {
    if (subcategoriaseleccionada) {
      this.subcategoria = subcategoriaseleccionada.subcategoria;
    } else {
      this.subcategoria = "";
    }
  }

  listarSubCategorias()
  {    
    this.loading = true;
    

    this.subcategoriaservice.listarSubCategoriasPorCategoria(this.cod_categoria).subscribe( (data : any) =>
    {
      this.datossubcategoria = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
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
      this.listarCategorias();
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