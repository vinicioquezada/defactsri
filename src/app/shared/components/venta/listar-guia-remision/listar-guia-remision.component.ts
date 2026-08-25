import { Component, OnInit } from '@angular/core';
import { GuiaRemisionService } from 'src/app/venta/services/guia-remision.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';

@Component({
  selector: 'app-listar-guia-remision',
  templateUrl: './listar-guia-remision.component.html',
  styleUrls: ['./listar-guia-remision.component.css']
})
export class ListarGuiaRemisionComponent implements OnInit {
 
  cod_factura_venta : string = "";
  numero_factura : string = "";
  cliente : string = "";

  loadinglistado : boolean = false;

  pagelistaguiaremisionventa = 1;
  countlistaguiaremisionventa = 0;
  pagesizelistaguiaremisionventa = 5;

  datos : any;
  filterpost = "";

  constructor(private guiaremisionservice: GuiaRemisionService, private toastr: ToastrService, private error:ErrorService, private configService: ConfigService) { }

  ngOnInit(): void {
  }

  keyFiltrado()
  {
    this.pagelistaguiaremisionventa = 1;
  }

  listarGuiaRemisionVenta(item: any)
  {
    this.cod_factura_venta = item.cod_factura_venta;
    this.numero_factura = item.numero_factura;
    this.cliente = item.cliente;
    this.pagelistaguiaremisionventa = 1;
    this.filterpost="";
    this.loadinglistado = true;
    this.guiaremisionservice.listarGuiaRemisionVenta(item.cod_factura_venta).subscribe( (data : any) =>
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
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/guiaremision?codguiaremision=" + item.cod_guia_remision, "Guia Remisión", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  handlePageChangeGuiaRemisionVentaVenta(event: number): void {
    this.pagelistaguiaremisionventa = event;
  }

}