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
import { FormaPagoService } from '../../services/forma-pago.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { firstValueFrom } from 'rxjs';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-pago-nota-credito',
  templateUrl: './reporte-pago-nota-credito.component.html',
  styleUrls: ['./reporte-pago-nota-credito.component.css']
})
export class ReportePagoNotaCreditoComponent implements OnInit {
  
  opcionesprivilegios : any;
  datosidentificacion : any;
  datosformapago : any;
  id_forma_pago : string = "";
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
  forma_pago: string = "";

  recaudador: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private ventaservice : VentaService, private tipoidentificacionservice:TipoIdentificacionService, private formapagoservice : FormaPagoService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.comision_venta = this.usersession.getConfiguracion("comision_venta");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.recaudador = this.usersession.getConfiguracion("recaudador");

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

  changeIdentificacion(event: any): void {
    const elemento = event.target.value;
    this.cod_identificacion = elemento;
    const resultado = this.datosidentificacion.find( (valor : any) => valor.cod_identificacion == this.cod_identificacion );
    this.identificacion = resultado.identificacion;
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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "Nº FACTURA" : element.numero_factura,
          "IDENTIFICACIÓN" : element.cedula,
          "CLIENTE" : element.cliente,
          "FECHA": element.fecha_registro,
          "TIPO VENTA" : element.tipo_venta,
          "Nº NOTA DE CRÉDITO" : element.numero_nota_credito,
          "FORMA PAGO" : element.forma_pago,
          "TOTAL" : element.valor
        }
        json.push(obj);
      });
      
      let obj = {
        "Nº FACTURA" : "",
        "IDENTIFICACIÓN" : "",
        "CLIENTE" : "",
        "FECHA": "",
        "TIPO VENTA" : "",
        "Nº NOTA DE CRÉDITO" : "",
        "FORMA PAGO" : "TOTAL GENERAL",
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

  exportarPdf()
  {
    if(this.datos.length>0)
    {
      let tabla = [];
      let titulo = [];
      titulo[0] = { text: "Nº FACTURA", bold: true };
      titulo[1] = { text: "DOCUMENTO", bold: true };
      titulo[2] = { text: "CLIENTE", bold: true };
      titulo[3] = { text: "FECHA", bold: true };
      titulo[4] = { text: "TIPO VENTA", bold: true };
      titulo[5] = { text: "Nº NOTA CRÉDITO", bold: true };
      titulo[6] = { text: "FORMA PAGO", bold: true };
      titulo[7] = { text: "TOTAL", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_factura;
        fila[1] = element.cedula;
        fila[2] = element.cliente;
        fila[3] = element.fecha_registro;
        fila[4] = element.tipo_venta;
        fila[5] = element.numero_nota_credito;
        fila[6] = element.forma_pago;
        fila[7] = element.valor;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "TOTAL GENERAL";
      fila[7] = this.total;
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
            text: 'Reporte de Pagos con Notas de Créditos en Ventas',
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
                      }
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
                        text: 'FORMA COBRO: ' + this.forma_pago,
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
              widths: ['auto', 'auto', 200, 'auto', 'auto', 'auto', 'auto', 'auto'],
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

    this.cod_tipo_deuda = "0";

    this.cod_cliente = "0";
    this.cliente = "Todos los clientes";
    this.chkcliente = true;

    this.total = 0;

    this.cod_identificacion = "0";
    this.id_forma_pago = "0";
    this.tipo_deuda = "SIN DEUDA";
    this.tipo_documento = "TODOS";
    this.identificacion = "TODOS";
    this.cod_ruc = "0";
    if(this.firmasruc=="1")
    {
      this.ruc = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );
    }
    this.forma_pago = "TODOS";
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
    this.datos = [];

    this.ventaservice.listarPagosNotasCreditosVentas(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.cod_tipo_deuda, this.cod_cliente, this.cod_identificacion, this.cod_vendedor, this.id_forma_pago, this.cod_ruc).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      this.total = 0;

      if(data.length>0)
      {
        data.forEach(element => {
          this.total = this.total + parseFloat(element.valor);
        });
        this.total = redondeardecimales(this.total, 2);
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
      await this.listarFormaPagos();

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

  async listarFormaPagos(): Promise<void> {
    this.datosformapago = [];
    this.loadinglistado = true;

    try {
      const data = await firstValueFrom(this.formapagoservice.listarFormaPagos());

      this.datosformapago = data;

      const formapago = {
        id_forma_pago: 0,
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

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
    this.forma_pago = resultado.forma_pago;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}