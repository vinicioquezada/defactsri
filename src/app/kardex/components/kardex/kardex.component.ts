import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { KardexService } from '../../services/kardex.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UsuarioService } from 'src/app/administrar/services/usuario.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { ListadoProductoGeneralComponent } from 'src/app/shared/components/listado-producto/listado-producto-general/listado-producto-general.component';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoProductoGeneralComponent) childlistadoproductogeneral!: ListadoProductoGeneralComponent;

  datos : any;
  datossucursal : any;

  filterpost = "";

  sucursal: string = this.usersession.getConfiguracion("sucursal");
  cod_sucursal : string = "";
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");

  fechadesde : string = "";
  fechahasta : string = "";
  
  loadinglistado : boolean = false;

  chkproducto : boolean = true;
  cod_producto : string = "";
  producto : string = "";

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private kardexservice : KardexService, private usuarioService: UsuarioService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
    this.bodyStyleService.resetBodyStyles();
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
          "FECHA_HORA" : element.fecha_hora,
          "PRODUCTO" : element.descripcion,
          "MOVIMIENTO" : element.transaccion,
          "NÚMERO DOCUMENTO": element.numero_documento,
          "COSTO $" : element.costo,
          "CANT. ENTRADA" : element.cantidad_entrada,
          "TOTAL ENTRADA $" : element.total_entrada,
          "CANT. SALIDA" : element.cantidad_salida,
          "TOTAL SALIDA $" : element.total_salida,
          //"EXISTENCIA" : element.cantidad_existencia,
          //"TOTAL EXISTENCIA $" : element.total_existencia
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
      titulo[0] = { text: "FECHA_HORA", bold: true };
      titulo[1] = { text: "PRODUCTO", bold: true };
      titulo[2] = { text: "MOVIMIENTO", bold: true };
      titulo[3] = { text: "NÚMERO DOCUMENTO", bold: true };
      titulo[4] = { text: "COSTO $", bold: true };
      titulo[5] = { text: "CANT. ENTRADA", bold: true };
      titulo[6] = { text: "TOTAL ENTRADA $", bold: true };
      titulo[7] = { text: "CANT. SALIDA", bold: true };
      titulo[8] = { text: "TOTAL SALIDA $", bold: true };
      //titulo[9] = { text: "EXISTENCIA", bold: true };
      //titulo[10] = { text: "TOTAL EXISTENCIA $", bold: true };
      tabla.push(titulo);

      let c = 1;
      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.fecha_hora;
        fila[1] = element.descripcion;
        fila[2] = element.transaccion;
        fila[3] = element.numero_documento;
        fila[4] = element.costo;
        fila[5] = element.cantidad_entrada;
        fila[6] = element.total_entrada;
        fila[7] = element.cantidad_salida;
        fila[8] = element.total_salida;
        //fila[9] = element.cantidad_existencia;
        //fila[10] = element.total_existencia;
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
          text: 'Reporte de Movimientos Kardex',
          fontSize: 16,  
          alignment: 'center',  
          color: '#047886'
        },

        {
        columns: [
                {
                  stack: [
                    {
                      text: 'FECHA DESDE: ' + this.fechadesde,
                      alignment: 'left',
                      fontSize: 11,
                      bold: true,
                      margin: [0, 0, 0, 3]
                    },
                    {
                      text: 'FECHA HASTA: ' + this.fechahasta,
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
                    }
                  ],
                  margin: [0, 0, 0, 0]
                }
              ],
              margin: [0, 0, 0, 10]
          },
          {
            table: {
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.cod_producto = "0";
    this.producto = "Todos los productos";
    this.chkproducto = true;
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
    
    this.kardexservice.listarMovimientosPorProducto(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_producto).subscribe( (data : any) =>
    {
      /*
      if(data.length>0)
      {
				let cantidad_existencia = 0;
				let total_existencia = 0;

        data.forEach(element => {
          if(element.estado_peps==1)
          {
            cantidad_existencia = cantidad_existencia + parseFloat(element.cantidad_existencia);
            total_existencia = total_existencia + parseFloat(element.total_existencia);
          }
        });
        
        let totales = {
          "fecha_hora" : "",
          "descripcion" : "",
          "transaccion" : "",
          "numero_documento" : "",
          "costo" : "",
          "cantidad_entrada" : "",
          "total_entrada" : "",
          "cantidad_salida" : "",
          "total_salida" : "TOTAL",
          "cantidad_existencia" : redondeardecimales(cantidad_existencia, 2),
          "total_existencia" : redondeardecimales(total_existencia, 2)
        }
        data.push(totales);
      }
      */
      
      this.datos = data;
      
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  
  }

  
  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
  }

  listarSucursales()
  {    
    this.loadinglistado = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.formularioNormal();
      this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
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
  
  clickCrearInventarioInicial()
  {
    Swal.fire({
      title: "Crear Inventario Inicial",
      input: "password",
      text: "Está seguro de crear inventario inicial, al crear el inventario inicial, se borrarán los datos del Kardex, además debes tener un precio de costo en cada producto, si estás seguro escribe la contraseña de usuario administrador",
      icon: "warning",
      inputAttributes: {
        autocapitalize: "off"
      },
      confirmButtonText: "Crear",
      showLoaderOnConfirm: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      
      preConfirm: async (password) => {
          return {
            "password" : password
          };
      },

    }).then((result) => {
      if (result.isConfirmed) {
        this.verificarAdministrador(result.value.password);
      }
    });
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
    this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  clickListarProductos()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    $("#mymodallistarproductos").modal("show");
  }

  verificarAdministrador = (password: string) =>{
    this.loadinglistado = true;
    const parametros = {
      'password' : password,
    };

    this.usuarioService.verificarAdministrador(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      if (data.estado == false)
      {
        this.toastr.error("Sus credenciales son incorrectas, para hacer la acción debe ser el usuario administrador", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.CrearInventarioInicial();
      }
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
  });
  }

  CrearInventarioInicial() {
    this.loadinglistado = true;
    const parametros = {
      'cod_sucursal' : this.cod_sucursal
    };
    this.kardexservice.crearInventarioInicial(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      if (data.estado == true)
      {
        this.toastr.success("Inventario restablecido y creado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.formularioNormal();
      }
      else
      {
        this.toastr.error("No se pudo completar el proceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
  });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}