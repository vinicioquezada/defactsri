import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ListadoEmpleadoComponent } from 'src/app/shared/components/listado-empleado/listado-empleado.component';
import { TipoIdentificacionService } from 'src/app/venta/services/tipo-identificacion.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';

@Component({
  selector: 'app-resumen-ventas',
  templateUrl: './resumen-ventas.component.html',
  styleUrls: ['./resumen-ventas.component.css']
})
export class ResumenVentasComponent implements OnInit {
  @ViewChild("imprimircuadroestadistico") imprimircuadroestadistico!: ElementRef;
  @ViewChild("imprimirresumendetallado") imprimirresumendetallado!: ElementRef;
  
  opcionesprivilegios : any;
  datosidentificacion : any;
  multisucursal : string = "0";

  @ViewChild(ListadoEmpleadoComponent) childlistadoempleado: any;

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

  cod_mes : string = "0";

  comision_venta : string = "";

  single: any[] = [];
  view: [number, number] = [0, 300];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Totales';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Movimientos';
  colorScheme = {
    domain: ['#28a745', '#3ada5f', '#dc3545', '#ffc107', '#ffec08', '#fffb08', '#28a745', '#dc3545']//#6610f2
  };

  firmasruc: string = "";
  cod_ruc: string = "0";
  datosrucempresa : any = [];

  page = 1;
  count = 0;
  pagesize = 5;

  ganancia: number = 0;
  total_ventas: number = 0;
  total_ingresos: number = 0;
  total_gastos: number = 0;
  total_compras: number = 0;

  constructor(private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private ventaservice : VentaService, private tipoidentificacionservice:TipoIdentificacionService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService, private bodyStyleService: BodyStyleService) { }

  ngOnInit(): void {
    this.comision_venta = this.usersession.getConfiguracion("comision_venta");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.listarSucursales();
    this.bodyStyleService.resetBodyStyles();
  }

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.setView();
    }
  
  setView() {
    const width = document.querySelector('.chart-container')?.clientWidth || 0;
    this.view = [width, 400];
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  keyFiltrado()
  {
    this.page = 1;
  }

  imprimirCuadroEstadisticos() {
    const content = this.imprimircuadroestadistico.nativeElement.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Impresión</title></head><body>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  imprimirResumenDetallado() {
    const content = this.imprimirresumendetallado.nativeElement.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Impresión</title></head><body>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
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

  formularioNormal(): void
  {
    this.page = 1;
    this.filterpost="";
    this.datos = [];
    this.cantidad_registros = 0;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.cod_ruc = "0";

    this.cod_usuario = "0";
    this.empleado = "Todo el personal";
    this.chkempleado = true;

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.total_ventas = 0;
    this.total_ingresos = 0;
    this.total_gastos = 0;
    this.total_compras = 0;

    this.ganancia = 0;
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

    this.ventaservice.resumenVentas(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_usuario, this.cod_ruc).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.cantidad_registros = data.length;

      this.datos = Object.values(data);

      this.total_ventas = (Number(data['venta'].total) + Number(data['abono_venta'].total)) - (Number(data['notas_credito'].total) + Number(data['pago_nota_credito'].total));
      this.total_ingresos = Number(data['ingresos'].total);
      this.total_gastos = Number(data['gastos'].total);
      this.total_compras = 0;//( Number(data.detalles[6].total) + Number(data.detalles[7].total) ) - Number(data.detalles[9].total);
      this.ganancia = redondeardecimales((this.total_ventas + this.total_ingresos) - (this.total_gastos + this.total_compras), 2);

      this.single= [
        {
          "name": "Ventas",
          "value":  Number(data['venta'].total)
        },
        {
          "name": "Abonos Ventas",
          "value": Number(data['abono_venta'].total)
        },
        {
          "name": "Devolución Ventas",
          "value": Number(data['notas_credito'].total)
        },
        {
          "name": "Pago Nota Créditos",
          "value": Number(data['pago_nota_credito'].total)
        },
        /*
        {
          "name": "Compras",
          "value": Number(0)
        },
        {
          "name": "Abonos Compras",
          "value": Number(0)
        },
        {
          "name": "Devolución Compras",
          "value": Number(0)
        },
        */
        {
          "name": "Ingresos",
          "value": Number(data['ingresos'].total)
        },
        {
          "name": "Gastos",
          "value": Number(data['gastos'].total)
        }
      ];
      Object.assign(this, this.single );
      this.setView();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }
  
  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    this.listarRucEmpresas();
  }

  changeEmpresa(event: any): void {
      const elemento = event.target.value;
      this.cod_ruc = elemento;
  }

  listarSucursales()
  {    
    this.loading = true;
    
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      this.childlistadoempleado.listarEmpleadosUsuarios();
      this.listarRucEmpresas();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarRucEmpresas()
  {    
    this.loading = true;
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosrucempresa = data;

      let objetoidentificacion = {
        "cod_ruc" : "0",
        "empresa": "TODOS"
      }
      this.datosrucempresa.unshift(objetoidentificacion);
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