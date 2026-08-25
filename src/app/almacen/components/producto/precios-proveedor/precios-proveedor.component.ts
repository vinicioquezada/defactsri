import { Component, OnInit } from '@angular/core';
import { ProveedorProductoService } from 'src/app/compra/services/proveedor-producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr'
declare var $:any;


@Component({
  selector: 'app-precios-proveedor',
  templateUrl: './precios-proveedor.component.html',
  styleUrls: ['./precios-proveedor.component.css']
})
export class PreciosProveedorComponent implements OnInit {
  datospreciosproveedor : any;

  cod_producto : string = "";
  descripcion : string = "";
  
  loading : boolean = false;
  loadinglistado : boolean = false;

  pagepreciosproveedor = 1;
  countpreciosproveedor = 0;
  pagesizepreciosproveedor = 5;

  constructor(private toastr: ToastrService, private error:ErrorService, private proveedorproductoservice : ProveedorProductoService) { }

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

  listarproductoproveedores()
  {    
    this.loadinglistado = true;
    

    this.proveedorproductoservice.listarProductoProveedor(this.cod_producto).subscribe( (data : any) =>
    {
      this.datospreciosproveedor = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  handlePageChangepreciosproveedor(event: number): void {
    this.pagepreciosproveedor = event;
  }

 

}