import { Component, OnInit, ViewChild } from '@angular/core';
import { MembresiaService } from '../../services/membresia.service';
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
import { SubcategoriaService } from 'src/app/almacen/services/subcategoria.service';
import { CategoriaService } from 'src/app/almacen/services/categoria.service';

@Component({
  selector: 'app-reporte-ventas-socios',
  templateUrl: './reporte-ventas-socios.component.html',
  styleUrls: ['./reporte-ventas-socios.component.css']
})
export class ReporteVentasSociosComponent implements OnInit {
  
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

  subtotalconimpuesto : number = 0;
  subtotal0 : number = 0;
  totalimpuesto : number = 0;
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

  cantidadcobrado: number = 0;
  cantidadporcobrar: number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  selecteditemsruc = [];

  cod_categoria : string = "";
  categoria : string = "";
  cod_subcategoria : string = "";
  subcategoria : string = "";
  datoscategoria : any = [];
  datossubcategoria : any = [];

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private membresiaservice : MembresiaService, private tipoidentificacionservice:TipoIdentificacionService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService, private configService: ConfigService, private categoriaservice:CategoriaService, private subcategoriaservice:SubcategoriaService) { }

  ngOnInit(): void {
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
    this.datosrucempresa = [];
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    if(this.cod_sucursal=="0")
    {
      this.cod_ruc = "0";
      this.selecteditemsruc = [];
      this.listarRucGenerales();
    }
    else
    {
      this.cod_ruc = "0";
      this.selecteditemsruc = [];
      this.listarRucEmpresas();
    }
    
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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {

        let obj = {
          "Nº FACTURA" : element.numero_factura,
          "FECHA" : element.fecha_registro,
          "IDENTIFICACIÓN" : element.cedula,
          "SOCIO" : element.socio,
          "PLAN" : element.plan,
          "CATEGORIA": element.categoria,
          "SUBCATEGORIA" : element.subcategoria,
          "TIPO VENTA" : element.tipo_venta
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
      titulo[0] = { text: "Nº FACTURA", bold: true };
      titulo[1] = { text: "FECHA", bold: true };
      titulo[2] = { text: "IDENTIFICACIÓN", bold: true };
      titulo[3] = { text: "SOCIO", bold: true };
      titulo[4] = { text: "PLAN", bold: true };
      titulo[5] = { text: "CATEGORIA", bold: true };
      titulo[6] = { text: "SUBCATEGORIA", bold: true };
      titulo[7] = { text: "TIPO VENTA", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_factura;
        fila[1] = element.fecha_registro;
        fila[2] = element.cedula;
        fila[3] = element.socio;
        fila[4] = element.plan;
        fila[5] = element.categoria;
        fila[6] = element.subcategoria;
        fila[7] = element.tipo_venta;
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
            text: 'Reporte de Ventas',
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
                    ],
                    margin: [0, 0, 0, 0]
                  }
                ],
                margin: [0, 0, 0, 10]
          },
          
          {
            table: {
              widths: ['auto', 'auto', 'auto', '*', 200, 'auto', 'auto', 'auto'],
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

    this.cod_identificacion = "0";
    this.tipo_deuda = "TODOS";
    this.tipo_documento = "TODOS";
    this.identificacion = "TODOS";
    this.cod_ruc = "0";
    this.selecteditemsruc = [];
    if(this.firmasruc=="1")
    {
      this.ruc = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );
    }

    this.reiniciarValores();

    this.cod_categoria = "";
    this.categoria = "TODAS";
    this.cod_subcategoria = "";
    this.subcategoria = "TODAS";
  }

  reiniciarValores()
  {
    this.datos = [];
    this.page = 1;
    this.filterpost="";
    this.cantidad_registros = 0;

    this.subtotalconimpuesto = 0;
    this.subtotal0 = 0;
    this.totalimpuesto = 0;
    this.total = 0;  
    this.cantidadcobrado = 0;
    this.cantidadporcobrar = 0;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscar()
  {
    let codigos_ruc = [];
    if(this.selecteditemsruc.length>0)
    {
      codigos_ruc = this.selecteditemsruc;
    }
    else
    {
      codigos_ruc.push(this.cod_ruc);
    }

    this.reiniciarValores();
    this.loadinglistado = true;
    this.membresiaservice.listarVentasSocios(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_tipo_documento, this.cod_tipo_deuda, this.cod_cliente, this.cod_identificacion, this.cod_vendedor, codigos_ruc, this.cod_categoria, this.cod_subcategoria).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      
      if(data.length>0)
      {
        data.forEach(element => {
          this.subtotalconimpuesto = this.subtotalconimpuesto + parseFloat(element.subtotalconimpuesto);
          this.subtotal0 = this.subtotal0 + parseFloat(element.subtotalsinimpuesto);
          this.totalimpuesto = this.totalimpuesto + parseFloat(element.total_iva);
          this.total = this.total + parseFloat(element.importetotal);
          
          if(element.deudor==1)
          {
            this.cantidadporcobrar++;
          }
          else
          {
            this.cantidadcobrado++;
          }


        });
        this.subtotalconimpuesto = redondeardecimales(this.subtotalconimpuesto, 2);
        this.subtotal0 = redondeardecimales(this.subtotal0, 2);
        this.totalimpuesto = redondeardecimales(this.totalimpuesto, 2);
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

      const objetosucursal = {
        cod_sucursal: "0",
        sucursal: "TODOS"
      };

      this.datossucursal.unshift(objetosucursal);

      this.childlistadocliente.listarClientes();
      this.childlistadoempleado.listarEmpleadosUsuarios();
      this.childlistadovendedor.listarEmpleadosVendedores();
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

  async listarRucGenerales(): Promise<void> {
    this.loading = true;

    try {
      const data = await firstValueFrom(
        this.rucempresaservice.listarRucGenerales()
      );

      this.datosrucempresa = data;

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

  handlePageChange(event: number): void {
    this.page = event;
  }
}