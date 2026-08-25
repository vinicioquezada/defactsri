import { Component, OnInit } from '@angular/core';
import { CompraService } from 'src/app/compra/services/compra.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr'
declare var $:any;

@Component({
  selector: 'app-factura-proveedor',
  templateUrl: './factura-proveedor.component.html',
  styleUrls: ['./factura-proveedor.component.css']
})
export class FacturaProveedorComponent implements OnInit {  
  datosfacturaproveedor : any;

  cod_producto : string = "";
  descripcion : string = "";
  
  loading : boolean = false;
  loadinglistado : boolean = false;
  
  pagefacturaproveedor = 1;
  countfacturaproveedor = 0;
  pagesizefacturaproveedor = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private compraservice : CompraService) { }

  ngOnInit(): void {
    this.formularioNormal();
  }

  formularioNormal()
  {
    this.cod_producto = "";
    this.descripcion = "";
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  listarProductoFacturasProveedor()
  {    
    this.loadinglistado = true;
    

    this.compraservice.listarProductoFacturasProveedor(this.cod_producto).subscribe( (data : any) =>
    {
      this.datosfacturaproveedor = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  handlePageChangeFacturaProveedor(event: number): void {
    this.pagefacturaproveedor = event;
  }
}