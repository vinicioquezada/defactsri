import { Component, OnInit, ViewChild } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import { ListadoClienteComponent } from 'src/app/shared/components/listado-cliente/listado-cliente.component';
import { ListadoVendedorComponent } from 'src/app/shared/components/listado-vendedor/listado-vendedor.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { TipoIdentificacionService } from 'src/app/venta/services/tipo-identificacion.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { firstValueFrom } from 'rxjs';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-venta-consolidado-vendedor',
  templateUrl: './reporte-venta-consolidado-vendedor.component.html',
  styleUrls: ['./reporte-venta-consolidado-vendedor.component.css']
})
export class ReporteVentaConsolidadoVendedorComponent implements OnInit {
  
  opcionesprivilegios : any;
  datosidentificacion : any;
  
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;
  @ViewChild(ListadoClienteComponent) childlistadocliente: any;
  @ViewChild(ListadoVendedorComponent) childlistadovendedor: any;

  cantidad_registros : number = 0;

  datos : any;
  datossucursal : any;

  cod_tipo_documento : string = "";
  datostipodocumento : any[] = [
    {
      "cod_tipo_documento" : 0,
      "tipo_documento" : "TODOS"
    },
    {
      "cod_tipo_documento" : 1,
      "tipo_documento" : "FACTURA ELECTRÓNICA"
    },
    {
      "cod_tipo_documento" : 2,
      "tipo_documento" : "FACTURA"
    },
    {
      "cod_tipo_documento" : 3,
      "tipo_documento" : "RECIBO"
    }
    // {
    //   "cod_tipo_documento" : 4,
    //   "tipo_documento" : "VENTA PENDIENTE"
    // }
  ];

  cod_tipo_deuda : string = "";
  datostipodeuda : any[] = [
    {
      "cod_tipo_deuda" : "T",
      "tipo_deuda" : "TODOS"
    },
    {
      "cod_tipo_deuda" : "0",
      "tipo_deuda" : "SIN DEUDA"
    },
    {
      "cod_tipo_deuda" : "1",
      "tipo_deuda" : "POR COBRAR"
    }
  ];

  filterpost = "";

  cod_sucursal : string = "";

  chkempleado : boolean = true;
  cod_usuario : string = "";
  empleado : string = "";

  chkvendedor : boolean = true;
  cod_vendedor : string = "";
  vendedor : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  tipo_venta : string = "";
  
  
  cod_identificacion : string = "0";

  loading : boolean = false;
  loadinglistado : boolean = false;

  chkcliente : boolean = true;
  cod_cliente : string = "";
  cliente : string = "";

  total :number = 0;

  cod_mes : string = "0";

  comision_venta : string = "";

  firmasruc: string = "";
  cod_ruc: string = "0";
  datosrucempresa : any = [];

  tipo_documento : string = "";
  tipo_deuda : string = "TODOS";
  identificacion : string = "TODOS";
  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");

  cod_estado_recaudacion : string = "";
  datosestadorecaudacion : any[] = [
    {
      "cod_estado_recaudacion" : "T",
      "estado_recaudacion" : "TODOS"
    },
    {
      "cod_estado_recaudacion" : "0",
      "estado_recaudacion" : "NO RECAUDADAS"
    },
    {
      "cod_estado_recaudacion" : "1",
      "estado_recaudacion" : "RECAUDADAS"
    }
  ];

  recaudador: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private ventaservice : VentaService, private tipoidentificacionservice:TipoIdentificacionService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.comision_venta = this.usersession.getConfiguracion("comision_venta");
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.comision_venta = this.usersession.getConfiguracion("comision_venta");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();

    if(this.opcionesprivilegios["soloventaselectronicas"])
    {
      this.datostipodocumento = [
        {
          "cod_tipo_documento" : 1,
          "tipo_documento" : "FACTURA ELECTRÓNICA"
        },
        {
          "cod_tipo_documento" : 2,
          "tipo_documento" : "FACTURA"
        }
      ];
    }

    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
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

  changeChkVendedor()
  {
    this.cod_vendedor = "0";
    this.vendedor = "";
    if(this.chkvendedor==true){
      this.chkvendedor = false;
    }else{
      this.chkvendedor = true;
      this.vendedor = "Todos los vendedores";
    }
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

  changeIdentificacion(event: any): void {
    const elemento = event.target.value;
    this.cod_identificacion = elemento;
    const resultado = this.datosidentificacion.find( (valor : any) => valor.cod_identificacion == this.cod_identificacion );
    this.identificacion = resultado.identificacion;
  }

  changeEstadoRecaudacion(event: any): void {
    const elemento = event.target.value;
    this.cod_estado_recaudacion = elemento;
  }

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "IDENTIFICACIÓN" : element.identificacion,
          "USUARIO VENDEDOR" : element.usuario,
          "TOTAL" : element.importetotal
        }
        json.push(obj);
      });

      let obj = {
        "IDENTIFICACIÓN" : "",
        "USUARIO VENDEDOR" : "TOTAL GENERAL",
        "TOTAL" : this.total
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

  async exportarPdf()
  {
    if(this.datos.length>0)
    {
      let tabla = [];
      let titulo = [];
      titulo[0] = { text: "IDENTIFICACIÓN", bold: true };
      titulo[1] = { text: "USUARIO VENDEDOR", bold: true };
      titulo[2] = { text: "TOTAL", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.identificacion;
        fila[1] = element.usuario;
        fila[2] = element.importetotal;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "TOTAL GENERAL";
      fila[2] = this.total;
      tabla.push(fila);

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
            text: 'Reporte de Consolidados de Vendedores',
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
                        alignment: 'left',
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
                        text: 'IDENTIFICACIÓN: ' + this.identificacion,
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
              widths: ['auto', '*', 'auto'],
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
    this.cantidad_registros = 0;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.cod_vendedor = "0";
    this.vendedor = "Todos los vendedores";
    this.chkvendedor = true;

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    
    if(this.opcionesprivilegios["soloventaselectronicas"])
    {
      this.cod_tipo_documento = "1";
    }
    else
    {
      this.cod_tipo_documento = "0";
    }

    this.cod_tipo_deuda = "T";

    this.cod_cliente = "0";
    this.cliente = "Todos los clientes";
    this.chkcliente = true;


    /*
    this.subtotalconimpuesto = 0;
    this.subtotal0 = 0;
    this.totalimpuesto = 0;
    */
    this.total = 0;

    this.cod_identificacion = "0";
    this.tipo_deuda = "TODOS";
    this.tipo_documento = "TODOS";
    this.identificacion = "TODOS";
    this.cod_ruc = "0";
    if(this.firmasruc=="1")
    {
      this.ruc = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );
    }

    this.cod_estado_recaudacion = "T";
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

    this.ventaservice.listarConsolidadosVendedores(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.cod_tipo_deuda, this.cod_cliente, this.cod_identificacion, this.cod_vendedor, this.cod_ruc, this.cod_estado_recaudacion).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      //this.subtotalconimpuesto = 0;
      //this.subtotal0 = 0;
      //this.totalimpuesto = 0;
      this.total = 0;

      if(data.length>0)
      {
        data.forEach(element => {
          //this.subtotalconimpuesto = this.subtotalconimpuesto + parseFloat(element.subtotalconimpuesto);
          //this.subtotal0 = this.subtotal0 + parseFloat(element.subtotalsinimpuesto);
          //this.totalimpuesto = this.totalimpuesto + parseFloat(element.total_iva);
          this.total = this.total + parseFloat(element.importetotal);
        });
        //this.subtotalconimpuesto = redondeardecimales(this.subtotalconimpuesto, 2);
        //this.subtotal0 = redondeardecimales(this.subtotal0, 2);
        //this.totalimpuesto = redondeardecimales(this.totalimpuesto, 2);
        this.total = redondeardecimales(this.total, 2);
      }
      
      this.datos = data;
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

  listarVendedor()
  {
    this.childlistadovendedor.page = 1;
    this.childlistadovendedor.filterpost="";
    $("#mymodallistarvendedor").modal("show");
  }

  recibirDatosVendedor(datosrecibidosvendedor: any)
  {
    this.cod_vendedor = datosrecibidosvendedor.cod_empleado;
    this.vendedor = datosrecibidosvendedor.apellido + " " + datosrecibidosvendedor.nombre;
    this.chkvendedor = false;
    $("#mymodallistarvendedor").modal("hide");
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

  async cargaListasDesplegables(): Promise<void> {
    try {
      await this.listarSucursales();
      await this.listarIdentificacion();
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
      this.childlistadovendedor.listarEmpleadosVendedores();

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

  async listarIdentificacion(): Promise<void> {
    try {
      this.loading = true;

      const data = await firstValueFrom(this.tipoidentificacionservice.listar());
      this.datosidentificacion = data;

      const objetoidentificacion = {
        cod_identificacion: "0",
        identificacion: "TODOS",
        estado: 1
      };

      this.datosidentificacion.unshift(objetoidentificacion);

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.loading = false;
    }
  }

  buscarComision()
  {
    this.page = 1;
    this.filterpost="";
    this.loadinglistado = true;

    this.ventaservice.listarConsolidadosComisiones(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.cod_tipo_deuda, this.cod_cliente, this.cod_identificacion, this.cod_vendedor, this.cod_ruc, this.cod_estado_recaudacion).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      this.total = 0;

      if(data.length>0)
      {
        data.forEach(element => {
          this.total = this.total + parseFloat(element.importetotal);
        });
        this.total = redondeardecimales(this.total, 2);
      }
      
      this.datos = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}