import { Component, OnInit, ViewChild } from '@angular/core';
import { GastosService } from '../../services/gastos.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriaGastosService } from '../../services/categoria-gastos.service';
import * as moment from 'moment';
declare var $:any;
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reporte-gastos',
  templateUrl: './reporte-gastos.component.html',
  styleUrls: ['./reporte-gastos.component.css']
})
export class ReporteGastosComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;

  datos : any;
  datossucursal : any;

  filterpost = "";

  cod_sucursal : string = "";
  cod_usuario : string = "";
  empleado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";  
  
  loadinglistado : boolean = false;
  
  cod_categoria_gastos : string = "0";
  datoscategoriagastos : any;

  datosformapago : any;
  id_forma_pago : string = "";
  forma_pago : string = "";

  chkempleado : boolean = true;

  totalvalor : number = 0;

  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");
  categoria_gastos: string = "";

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private formapagoservice : FormaPagoService, private gastosservice : GastosService, private categoriagastosservice: CategoriaGastosService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cargaListasDesplegables();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeChkEmpleado()
  {
    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    if(this.chkempleado==true){
      this.chkempleado = false;
    }else{
      this.chkempleado = true;
    }
  }

  changeCategoriaGastos(event: any): void {
    const elemento = event.target.value;
    this.cod_categoria_gastos = elemento;
    const resultado = this.datoscategoriagastos.find( (valor : any) => valor.cod_categoria_gastos == this.cod_categoria_gastos );
    this.categoria_gastos = resultado.categoria_gastos;
  }

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "CATEGORÍA" : element.categoria_gastos,
          "GASTO" : element.gastos,
          "FECHA REGISTRO" : element.fecha_registro,
          "VALOR": element.valor,
        }
        json.push(obj);
      });

      let obj = {
        "CATEGORÍA" : "",
        "GASTO" : "",
        "FECHA REGISTRO" : "TOTAL GENERAL",
        "VALOR": this.totalvalor
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
      titulo[1] = { text: "GASTO", bold: true };
      titulo[2] = { text: "FECHA REGISTRO", bold: true };
      titulo[3] = { text: "VALOR", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.categoria_gastos;
        fila[1] = element.gastos;
        fila[2] = element.fecha_registro;
        fila[3] = element.valor;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "TOTAL GENERAL";
      fila[3] = this.totalvalor;
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
            text: 'Reporte de Gastos',
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
                        text: 'FORMA COBRO: ' + this.forma_pago,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: 'CATEGORÍA GASTOS: ' + this.categoria_gastos,
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
              widths: ['auto', '*', 'auto', 'auto'],
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

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";
    this.datos = [];

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    this.id_forma_pago = "0";
    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    this.chkempleado = true;

    this.forma_pago = "TODOS";
    this.cod_categoria_gastos = "0";
    this.categoria_gastos = "TODOS";

    this.totalvalor = 0;
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
    this.gastosservice.listarGastosPorFechas(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.id_forma_pago, this.cod_categoria_gastos).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.totalvalor = 0;
      if(data.length>0)
      {
        this.totalvalor = data.map(element =>element.valor).reduce((total, acumulador) => parseFloat(total) + parseFloat(acumulador));
        this.totalvalor = redondeardecimales(this.totalvalor, 2);
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
    const sucursal = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = sucursal.sucursal;
  }

  async cargaListasDesplegables(): Promise<void> {
    try {
      await this.listarSucursales();
      await this.listarFormaPagos();
      await this.listarCategoriaGastos();

      this.formularioNormal();
    } catch (error) {
      this.toastr.error("Ocurrió un error al cargar los datos", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async listarSucursales(): Promise<void> {
    this.loadinglistado = true;

    try {
      const data = await firstValueFrom(this.sucursalesservice.listarSucursales());
      this.datossucursal = data;
      this.childlistadoempleado.listarEmpleadosUsuarios();
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loadinglistado = false;
    }
  }
  
  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
    this.forma_pago = resultado.forma_pago;
  }

  async listarFormaPagos(): Promise<void> {
    this.datosformapago = [];
    this.loadinglistado = true;

    try {
      const data = await firstValueFrom(this.formapagoservice.listarFormaPagos());

      this.datosformapago = data;

      const formapago = {
        id_forma_pago: "0",
        forma_pago: "TODOS",
        cod_tipo_tarjeta: 0,
        estado: 1
      };

      this.datosformapago.unshift(formapago);

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loadinglistado = false;
    }
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

  async listarCategoriaGastos(): Promise<void> {
    this.loadinglistado = true;
    this.datoscategoriagastos = [];

    try {
      const data = await firstValueFrom(this.categoriagastosservice.listarCategoriaGastos());

      this.datoscategoriagastos = data;

      const categorias = {
        cod_categoria_gastos: "0",
        categoria_gastos: "TODOS"
      };

      this.datoscategoriagastos.unshift(categorias);

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loadinglistado = false;
    }
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}