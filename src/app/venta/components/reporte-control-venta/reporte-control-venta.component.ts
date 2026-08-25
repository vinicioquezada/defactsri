import { Component, OnInit, ViewChild } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
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
import { TipoIdentificacionService } from 'src/app/venta/services/tipo-identificacion.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-reporte-control-venta',
  templateUrl: './reporte-control-venta.component.html',
  styleUrls: ['./reporte-control-venta.component.css']
})
export class ReporteControlVentaComponent implements OnInit {
  
  opcionesprivilegios : any;
  datosidentificacion : any;
  
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;
  @ViewChild(ListadoClienteComponent) childlistadocliente: any;

  cantidad_registros : number = 0;

  datos : any;
  datossucursal : any;

  filterpost = "";

  cod_sucursal : string = "";

  chkempleado : boolean = true;
  cod_usuario : string = "";
  empleado : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  loading : boolean = false;
  loadinglistado : boolean = false;

  subtotalconimpuesto : number = 0;
  subtotal0 : number = 0;
  totalimpuesto : number = 0;
  total :number = 0;

  tipo_documento : string = "";
  sucursal: string = this.usersession.getConfiguracion("sucursal");
  ruc: any = {
    razonsocial: this.usersession.getConfiguracion("razonsocial"),
    nombrecomercial: this.usersession.getConfiguracion("nombrecomercial"),
    direccion_establecimiento: this.usersession.getConfiguracion("direccion_establecimiento")
  };
  usuario: string = this.usersession.getConfiguracion("usuario");

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private formapagoservice : FormaPagoService, private ventaservice : VentaService, private tipoidentificacionservice:TipoIdentificacionService,private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.listarSucursales();
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
        let tipo_venta = "";
        let numero_factura = "";
        if(element.tipo_venta=='0')
        {
          tipo_venta ="NO REGISTRADA";
        }
        else
        {
          tipo_venta = element.tipo_venta;
        }

        if(element.numero_factura=='0')
        {
          numero_factura ="NO REGISTRADA";
        }
        else
        {
          numero_factura = element.numero_factura;
        }

        let obj = {
          "FECHA REGISTRO" : element.fecha_registro,
          "USUARIO" : element.usuario,
          "TIPO VENTA" : tipo_venta,
          "NUMERO COMPROBANTE" : numero_factura
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

      titulo[0] = { text: "FECHA REGISTRO", bold: true };
      titulo[1] = { text: "USUARIO", bold: true };
      titulo[2] = { text: "TIPO VENTA", bold: true };
      titulo[3] = { text: "NUMERO COMPROBANTE", bold: true };
      tabla.push(titulo);

      this.datos.forEach(element => {
        let fila = [];
        fila[0] = element.fecha_registro;
        fila[1] = element.usuario;
        if(element.tipo_venta=='0')
        {
          fila[2] ="NO REGISTRADA";
        }
        else
        {
          fila[2] = element.tipo_venta;
        }

        if(element.numero_factura=='0')
        {
          fila[3] ="NO REGISTRADA";
        }
        else
        {
          fila[3] = element.numero_factura;
        }
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
            text: 'Reporte de Control de Ventas',
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'
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
    this.cantidad_registros = 0;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
  

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.subtotalconimpuesto = 0;
    this.subtotal0 = 0;
    this.totalimpuesto = 0;
    this.total = 0;
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

    this.ventaservice.listarControlVentas(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;
      this.subtotalconimpuesto = 0;
      this.subtotal0 = 0;
      this.totalimpuesto = 0;
      this.total = 0;

      if(data.length>0)
      {
        data.forEach(element => {
          this.subtotalconimpuesto = this.subtotalconimpuesto + parseFloat(element.subtotalconimpuesto);
          this.subtotal0 = this.subtotal0 + parseFloat(element.subtotalsinimpuesto);
          this.totalimpuesto = this.totalimpuesto + parseFloat(element.total_iva);
          this.total = this.total + parseFloat(element.importetotal);
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

  
  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
  }

  listarSucursales()
  {    
    this.loading = true;
    
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loading = false;
      this.childlistadoempleado.listarEmpleadosUsuarios();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
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

  handlePageChange(event: number): void {
    this.page = event;
  }
}