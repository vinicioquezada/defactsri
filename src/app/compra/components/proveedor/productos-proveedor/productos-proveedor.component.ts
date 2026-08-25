import { Component, OnInit, ViewChild } from '@angular/core';
import { ProveedorProductoService } from 'src/app/compra/services/proveedor-producto.service';
import { ProveedorService } from 'src/app/compra/services/proveedor.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ListadoProductoGeneralComponent } from 'src/app/shared/components/listado-producto/listado-producto-general/listado-producto-general.component';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-productos-proveedor',
  templateUrl: './productos-proveedor.component.html',
  styleUrls: ['./productos-proveedor.component.css']
})
export class ProductosProveedorComponent implements OnInit {

  cantidad_registros : number = 0;
  cantidad_registros_producto : number = 0;


  datosproductos : any;

  filterpostproductoproveedor = "";

  cod_producto_proveedor : string = "";
  producto : string = "";

  cod_proveedor : string = "";
  proveedor : string = "";

  loadingalmacenar : boolean = false;
  loadinglistado : boolean = false;
  loadingmodal : boolean = false;

  @ViewChild(ListadoProductoGeneralComponent) childlistadoproductogeneral!: ListadoProductoGeneralComponent;
  cod_sucursal : string = "";
  sucursal : string = "";
  multisucursal : string = "0";
  codigo_barra : string = "";
  cod_producto : string = "";
  descripcion : string = "";
  precio_base : number = 0;
  precio_venta : number = 0;


  flagtext : boolean = false;

  pageproductoproveedor = 1;
  countproductoproveedor = 0;
  pagesizeproductoproveedor = 5;

  constructor(private proveedorservice:ProveedorService, private proveedorproductoservice : ProveedorProductoService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService) { 
  }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    this.formularioNormal();
    setTimeout(()=>{
      this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
    }, 1000);
  }

  keyFiltradoProductoProveedor()
  {
    this.pageproductoproveedor = 1;
  }



  formularioNormal()
  {
    this.pageproductoproveedor = 1;
    this.filterpostproductoproveedor = "";

    this.cod_producto_proveedor = "",
    this.producto = "";

    this.cod_proveedor = "";
    this.proveedor = "";
  }


  revisarProductos(cod_proveedor : string, razon_social : string)
  {
      this.cod_proveedor = cod_proveedor;
      this.proveedor = razon_social;
      $("#mymodallistarproductosproveedor").modal("show");
      
      this.listarProveedorProducto();
  }

  clickEliminar(cod_producto_proveedor: string, descripcion: string)
  {
    this.cod_producto_proveedor = cod_producto_proveedor;
    this.producto = descripcion;
    
    Swal.fire({
        title: 'ELIMINAR REGISTRO '  + this.producto,
        text: 'Confirmar para eliminar el registro seleccionado',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'No, Eliminar'
      }).then((result) => {
        if (result.value) {
          this.eliminar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
    });
  }

  eliminar = () =>{
      this.loadingmodal = true;
      const parametros = {
        'cod_producto_proveedor' : this.cod_producto_proveedor,
        'estado' : 0,
      };
      
      this.proveedorproductoservice.eliminar(parametros).subscribe( (data : any) =>
      {
        this.loadingmodal = false;
        if (data.estado == true)
        {
          
          this.listarProveedorProducto();        

          this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          this.toastr.error("Registro no se pudo eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  listarProveedorProducto()
  {
    this.pageproductoproveedor = 1;
    this.filterpostproductoproveedor = "";

    this.loadingmodal = true;
    

    this.proveedorproductoservice.listarProveedorProducto(this.cod_proveedor).subscribe( (data : any) =>
    {
      this.loadingmodal = false;
      this.datosproductos = data;
      this.cantidad_registros_producto = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingmodal = false;
      
    });
  }

  agregarProducto()
  {
    $("#mymodalagregarproducto").modal("show");
  }

   /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  recibirDatosProducto(datosrecibidosproducto: any)
  {
    $("#mymodallistarproductos").modal("hide");
    this.cod_producto = datosrecibidosproducto.cod_producto;
    this.descripcion = datosrecibidosproducto.descripcion;
    this.precio_base = datosrecibidosproducto.precio_base;
    this.precio_venta = datosrecibidosproducto.precio_venta;
  }

  actualizarListadoProducto()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    this.childlistadoproductogeneral.listarProductosPorSucursal(this.cod_sucursal);
    this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  buscarCodigoProducto()
  {
    this.childlistadoproductogeneral.buscarcodigoproducto(this.codigo_barra);
    this.codigo_barra = "";
  }

  clickListarProductos()
  {
    this.childlistadoproductogeneral.page = 1;
    this.childlistadoproductogeneral.filterpost="";
    $("#mymodallistarproductos").modal("show");
  }
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/

  buscar()
  {
    this.loadingalmacenar = true;
    this.proveedorproductoservice.buscar(this.cod_producto, this.cod_proveedor).subscribe( (data : any) =>
    {
      this.loadingalmacenar = false;
      if (data.cod_producto_proveedor == false)//No existe
      {
          this.guardar();
      }
      else
      {
          this.toastr.warning("Producto ya se encuentra registrado con el proveedor, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadingalmacenar = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
  });
  }

  guardar() {
    this.loadingalmacenar = true;
    const parametros = {
      'cod_producto' : this.cod_producto,
      'cod_proveedor' : this.cod_proveedor
    };
    this.proveedorproductoservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loadingalmacenar = false;
      if (data.estado == true)
      {
        this.listarProveedorProducto();
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodalagregarproducto").modal("hide");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadingalmacenar = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  verificarProductoProveedor()
  {
    this.flagtext = false;
    if(this.cod_producto.length==0)
    {
      this.flagtext=true;
      this.toastr.warning("Seleccione un producto para agregar al proveedor", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.buscar();
    }
  }

  handlePageChangeProductoProveedor(event: number): void {
    this.pageproductoproveedor = event;
  }

}