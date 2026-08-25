import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { VentaService } from 'src/app/venta/services/venta.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { ConfigService } from 'src/app/shared/services/config.service';

@Component({
  selector: 'app-listar-facturas-ventas',
  templateUrl: './listar-facturas-ventas.component.html',
  styleUrls: ['./listar-facturas-ventas.component.css']
})
export class ListarFacturasVentasComponent implements OnInit {
 
  cod_factura_venta : string = "";
  detalle : string = "";
  tipo_venta: string = "";

  electronico : string = "0";

  loadinglistado : boolean = false;

  pagelistafacturasventas = 1;
  countlistafacturasventas = 0;
  pagesizelistafacturasventas = 5;

  recaudador: string = "";
  
  firmasruc: string = "";

  datos : any;
  filterpost = "";

  constructor(private ventaservice: VentaService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.electronico = this.usersession.getConfiguracion("electronico");
  }

  keyFiltrado()
  {
    this.pagelistafacturasventas = 1;
  }

  listarNotaCreditoVenta(item: any)
  {
    this.pagelistafacturasventas = 1;
    this.filterpost = "";
    this.ventaservice.listarFacturasVentasPorProducto(item.fechadesde, item.fechahasta, item.cod_sucursal, item.cod_usuario, item.cod_tipo_documento, item.cod_tipo_deuda, item.cod_cliente, item.cod_ruc, item.cod_producto).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  imprimirVenta(item: any)
  {
    if(item.tipo_venta=="FACTURA" || item.tipo_venta=="ELECTRONICA")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventa?codfacturaventa=" + item.cod_factura_venta + "&electronico=" + this.electronico, "Factura de Venta", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }
    
    if(item.tipo_venta=="RECIBO")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/recibo?codfacturaventa=" + item.cod_factura_venta, "Nota de Venta", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }
  
    if(item.tipo_venta=="PROFORMA")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/proforma?codfacturaventa=" + item.cod_factura_venta, "Proforma", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }
  }

  handlePageChangelistaFacturasVentas(event: number): void {
    this.pagelistafacturasventas = event;
  }

}