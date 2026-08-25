import { Component, OnInit } from '@angular/core';
import { NotaCreditoService } from 'src/app/venta/services/nota-credito.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';

@Component({
  selector: 'app-listar-nota-credito',
  templateUrl: './listar-nota-credito.component.html',
  styleUrls: ['./listar-nota-credito.component.css']
})
export class ListarNotaCreditoComponent implements OnInit {
  
  cod_factura_venta : string = "";
  numero_factura : string = "";
  cliente : string = "";

  loadinglistado : boolean = false;

  pagelistanotacreditoventa = 1;
  countlistanotacreditoventa = 0;
  pagesizelistanotacreditoventa = 5;

  datos : any;
  filterpost = "";

  constructor(private notacreditoservice: NotaCreditoService, private toastr: ToastrService, private error:ErrorService, private configService: ConfigService) { }

  ngOnInit(): void {
  }

  keyFiltrado()
  {
    this.pagelistanotacreditoventa = 1;
  }

  listarNotaCreditoVenta(item: any)
  {
    this.cod_factura_venta = item.cod_factura_venta;
    this.numero_factura = item.numero_factura;
    this.cliente = item.cliente;
    this.pagelistanotacreditoventa = 1;
    this.filterpost="";
    this.loadinglistado = true;
    this.notacreditoservice.listarNotaCreditoVenta(item.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datos = data;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  imprimir(item: any)
  {
      if(item.tipo_venta=="FACTURA" || item.tipo_venta=="ELECTRONICA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/notacredito?codnotacredito=" + item.cod_nota_credito, "Nota de Credito", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
      
      if(item.tipo_venta=="RECIBO")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/devolucionrecibo?codnotacredito=" + item.cod_nota_credito, "Devolución Nota de Venta", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
  }

  handlePageChangeListaNotaCreditoVenta(event: number): void {
    this.pagelistanotacreditoventa = event;
  }

}
