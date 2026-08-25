import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { TipoUsuarioGymService } from '../../services/tipo-usuario-gym.service';
import { SocioService } from '../../services/socio.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reporte-socios',
  templateUrl: './reporte-socios.component.html',
  styleUrls: ['./reporte-socios.component.css']
})
export class ReporteSociosComponent implements OnInit {
  cantidad_registros : number = 0;
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;

  datostipousuariogym : any;

  cod_sucursal : string = "";
  cod_tipo_usuario_gym : string = "T";

  loading : boolean = false;
  loadinglistado : boolean = false;

  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");
  tipo_usuario_gym: string = "";

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private socioservice:SocioService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private tipousuariogymservice:TipoUsuarioGymService, private usersession: UserSessionService) { }

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

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "CEDULA" : element.cedula,
          "CLIENTE": element.cliente,
          "CELULAR" : element.celular,
          "CORREO": element.correo,
          "TIPO_USUARIO": element.tipo_usuario_gym
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

      titulo[0] = { text: "CEDULA", bold: true };
      titulo[1] = { text: "CLIENTE", bold: true };
      titulo[2] = { text: "CELULAR", bold: true };
      titulo[3] = { text: "CORREO", bold: true };
      titulo[4] = { text: "TIPO_USUARIO", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.cedula;
        fila[1] = element.cliente;
        fila[2] = element.celular;
        fila[3] = element.correo;
        fila[4] = element.tipo_usuario_gym;
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
            text: 'Reporte de Socios',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'
          },

          {
          columns: [
                  {
                    stack: [
                      {
                        text: 'TIPO SOCIO: ' + this.tipo_usuario_gym,
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: '',
                        alignment: 'left',
                        fontSize: 11,
                        bold: true,
                        margin: [0, 0, 0, 3]
                      },
                      {
                        text: '',
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
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
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

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    const sucursal = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.sucursal = sucursal.sucursal;
  }

  changeTipoUsuarioGym(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_usuario_gym = elemento;
    const resultado = this.datostipousuariogym.find( (valor : any) => valor.cod_tipo_usuario_gym == this.cod_tipo_usuario_gym );
    this.tipo_usuario_gym = resultado.tipo_usuario_gym;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarSocios();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal(): void
  {
    this.cantidad_registros = 0;
    this.page = 1;
    this.filterpost="";
    this.datos = [];

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
   
    this.cod_tipo_usuario_gym = "T";
    this.tipo_usuario_gym = "TODOS";
  }

  
 
  listarSocios()
  {
    this.page = 1;
    this.filterpost="";
    this.cantidad_registros = 0;
    this.datos = [];

    this.loadinglistado = true;
    this.socioservice.listarSocios(this.cod_sucursal, this.cod_tipo_usuario_gym).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
      this.cantidad_registros = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
    
  }

  async cargaListasDesplegables(): Promise<void> {
      try {
        await this.listarSucursales();
        await this.listarTipoUsuarioGym();
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
      } catch (err) {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        throw err;
      } finally {
        this.loading = false;
      }
    }

  async listarTipoUsuarioGym(): Promise<void> {
    this.loading = true;
    try {
      const data = await firstValueFrom(this.tipousuariogymservice.listarTipoUsuarioGym());
      this.datostipousuariogym = data;
      const objetotipousuariogym = {
        cod_tipo_usuario_gym: "T",
        tipo_usuario_gym: "TODOS",
      };
      this.datostipousuariogym.unshift(objetotipousuariogym);
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