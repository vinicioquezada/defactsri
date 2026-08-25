import { Component, OnInit, ViewChild } from '@angular/core';
import { RetencionService } from '../../services/retencion.service';
import { TipoImpuestoService } from '../../services/tipo-impuesto.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import { ListadoProveedorComponent } from 'src/app/shared/components/listado-proveedor/listado-proveedor.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-reporte-retencion',
  templateUrl: './reporte-retencion.component.html',
  styleUrls: ['./reporte-retencion.component.css']
})
export class ReporteRetencionComponent implements OnInit {
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;
  @ViewChild(ListadoProveedorComponent) childlistadoproveedor: any;

  cantidad_registros : number = 0;

  datos : any;
  datossucursal : any;

  filterpost = "";

  datostipoimpuesto : any;
  codigo_tipo_impuesto: string = "0";

  cod_sucursal : string = "";

  chkempleado : boolean = true;
  cod_usuario : string = "";
  empleado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
  
  loading : boolean = false;
  loadinglistado : boolean = false;

  chkproveedor : boolean = true;
  cod_proveedor : string = "";
  proveedor : string = "";

  total_retenido :number = 0;

  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private retencionservice : RetencionService, private tipoimpuestoservice: TipoImpuestoService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.listarSucursales();
    this.formularioNormal();
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

  changeTipoImpuesto(event: any): void {
    const elemento = event.target.value;
    this.codigo_tipo_impuesto = elemento;
  }

  exportarExcel()
  {
    if(this.datos.length>0)
    {
      let json = [];
      this.datos.forEach(element => {
        let obj = {
          "Nº COMPROBANTE" : element.numero_retencion,
          "ESTADO" : element.estado,
          "DOCUMENTO" : element.ruc,
          "PROVEEDOR": element.proveedor,
          "FECHA RET" : element.fecha_hora,
          "TIPO IMP" : element.tipo_impuesto,
          "FECHA COMP" : element.fecha_documento,
          "VALOR RETENIDO" : element.valor_retenido
        }
        json.push(obj);
      });

      let obj = {
        "Nº COMPROBANTE" : "",
        "ESTADO" : "",
        "DOCUMENTO" : "",
        "PROVEEDOR" : "",
        "FECHA RET": "",
        "TIPO IMP" : "",
        "FECHA COMP" : "TOTAL RETENIDO",
        "VALOR RETENIDO" : this.total_retenido
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
      titulo[0] = { text: "Nº COMPROBANTE", bold: true };
      titulo[1] = { text: "ESTADO", bold: true };
      titulo[2] = { text: "DOCUMENTO", bold: true };
      titulo[3] = { text: "PROVEEDOR", bold: true };
      titulo[4] = { text: "FECHA RET", bold: true };
      titulo[5] = { text: "TIPO IMP", bold: true };
      titulo[6] = { text: "FECHA COMP", bold: true };
      titulo[7] = { text: "VALOR RETENIDO", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.numero_retencion;
        fila[1] = element.estado;
        fila[2] = element.ruc;
        fila[3] = element.proveedor;
        fila[4] = element.fecha_hora;
        fila[5] = element.tipo_impuesto;
        fila[6] = element.fecha_documento;
        fila[7] = element.valor_retenido;
        tabla.push(fila);
      });

      let fila = [];
      fila[0] = "";
      fila[1] = "";
      fila[2] = "";
      fila[3] = "";
      fila[4] = "";
      fila[5] = "";
      fila[6] = "TOTAL RETENIDO";
      fila[7] = this.total_retenido;
      tabla.push(fila);

      const pdfDefinition: any = {
        //pageOrientation: 'portrait',
        pageOrientation: 'landscape',
        
        content: [
          {
            text: 'Reporte de Retenciones',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'  
          },
          {
            table: {
              widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
              body:
                tabla
            }
          }
        ]
      }
      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.open();
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
    this.cantidad_registros = 0;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");

    this.codigo_tipo_impuesto = "0";

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.cod_proveedor = "0";
    this.proveedor = "Todos los proveedores";
    this.chkproveedor = true;

    this.total_retenido = 0;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  buscar()
  {
    this.datos = [];
    this.page = 1;
    this.filterpost="";
    this.loadinglistado = true; 
    this.retencionservice.listarReporteRetenciones(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_proveedor, this.codigo_tipo_impuesto).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      this.total_retenido = 0;
      if(data.length>0)
      {
        data.forEach(element => {
          this.total_retenido = this.total_retenido + redondeardecimales(parseFloat(element.valor_retenido), 4);
        });
        this.total_retenido = redondeardecimales(this.total_retenido, 2);
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
  }

  listarSucursales()
  {    
    this.loading = true;
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      this.childlistadoproveedor.listarProveedores();
      this.childlistadoempleado.listarEmpleadosUsuarios();
      this.listarTipoImpuesto();
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
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

  changeChkProveedor()
  {
    this.cod_proveedor = "0";
    this.proveedor = "";
    if(this.chkproveedor==true){
      this.chkproveedor = false;
    }else{
      this.chkproveedor = true;
      this.proveedor = "Todos los proveedores";
    }
  }

  recibirDatosProveedor(datosrecibidosproveedor: any)
  {
    this.cod_proveedor = datosrecibidosproveedor.cod_proveedor;
    this.proveedor = datosrecibidosproveedor.razon_social + " " + datosrecibidosproveedor.nombre_comercial;
    this.chkproveedor = false;
    $("#mymodallistarproveedores").modal("hide");
  }

  listarProveedores()
  {
    this.childlistadoproveedor.page = 1;
    this.childlistadoproveedor.filterpost="";
    $("#mymodallistarproveedores").modal("show");
  }

  listarTipoImpuesto()
  {
    this.loading = true;
    this.datostipoimpuesto = [];
    this.tipoimpuestoservice.listarTipoImpuestos().subscribe( (data : any) =>
    {
      this.loading = false;
      let formapago = {
        "codigo_tipo_impuesto" : "0",
        "tipo_impuesto" : "TODOS"
      }
      this.datostipoimpuesto.push(formapago);
      data.forEach(element => {
        let formapago = {
          "codigo_tipo_impuesto" : element.codigo_tipo_impuesto,
          "tipo_impuesto" : element.tipo_impuesto
        }
        this.datostipoimpuesto.push(formapago);
      });
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}