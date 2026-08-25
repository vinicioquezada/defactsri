import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { ExistenciasComponent } from './existencias/existencias.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { FacturaProveedorComponent } from './factura-proveedor/factura-proveedor.component';
import { PreciosProveedorComponent } from './precios-proveedor/precios-proveedor.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';
import { EliminacionProductoService } from '../../services/eliminacion-producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  @ViewChild(ProductoFormComponent) childproductoform: ProductoFormComponent;
  @ViewChild(ExistenciasComponent) childexistencias: ExistenciasComponent;
  @ViewChild(TarifasComponent) childtarifas: TarifasComponent;
  @ViewChild(FacturaProveedorComponent) childfacturaproveedor: FacturaProveedorComponent;
  @ViewChild(PreciosProveedorComponent) childpreciosproveedor: PreciosProveedorComponent;
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  cantidad_registros : number = 0;
  filterpost = "";
  cod_sucursal : string = "";
  cod_producto_eliminar : string = "";
  descripcion_eliminar : string = "";
  loadinglistado : boolean = false;
  opcionesprivilegios : any;
  opcionesmenu : any;
  tarifas : string = "0";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private productoservice:ProductoService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private swalservice: SwalService, private eliminacionproductoservice: EliminacionProductoService) {
  }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.opcionesmenu = this.usersession.getAllMenu();
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.cargarFormulario();
  }


  async cargarFormulario()
  {
    await this.listarSucursales();
    await this.formularioNormal();
  }

  async listarSucursales()
  {
    try
    {
      this.loadinglistado = true;
      let data: any = await lastValueFrom(this.sucursalesservice.listarUsuarioSucursales());
      let sucursal = {
        "cod_sucursal": 0,
        "sucursal" : "TODOS"
      }
      data.unshift(sucursal);
      this.datossucursal = data;
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal = elemento;

    this.page = 1;
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_producto_eliminar: string, descripcion_eliminar: string)
  {
    this.cod_producto_eliminar = cod_producto_eliminar;
    this.descripcion_eliminar = descripcion_eliminar;
    if(this.opcionesprivilegios["eliminacionporcodigo"]==1)
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "REGISTRO "  + this.descripcion_eliminar,
        text: "Realizar petición de eliminación del registro seleccionado",
        icon: "warning",
        confirmText: "Si, Enviar",
        cancelText: "No, Cerrar"
      });

      if (ok)
      {
        this.emitirSolicitudEliminacion("eliminar");
      }
    }
    else
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "ELIMINAR REGISTRO "  + this.descripcion_eliminar,
        text: "Confirmar para eliminar en todos los locales el registro seleccionado, una vez eliminado no se podrá restaurar, se eliminarán las existencias en todos los locales que lo utilicen",
        icon: "info",
        confirmText: "Si, Eliminar",
        cancelText: "No, Cerrar"
      });

      if (ok)
      {
        await this.eliminar();
      }
    }
  }

  async emitirSolicitudEliminacion(proceso: string)
  {
    this.swalservice.iniciarLoading("Realizando solicitud...");
    try
    {
      const parametros = {
        "cod_producto" : this.cod_producto_eliminar,
        "proceso" : proceso
      };
      let data: any = await lastValueFrom(this.eliminacionproductoservice.emitirSolicitudEliminacion(parametros));
      this.swalservice.close();
      if (data.estado == true)
      {
        await this.ingresarCodigo(proceso);
      }
      else
      {
        const ok = await this.swalservice.alertError("Solicitud no fue procesada, vuelva a intertarlo por favor");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }

  async ingresarCodigo(proceso: string)
  {
   let texto="";
   if(proceso=="eliminar")
    {
      texto = "eliminar el registro del producto en todos los locales, una vez eliminado no se podrá restaurar, se eliminarán las existencias en todos los locales que lo utilicen";
    }
    
    if(proceso=="eliminarlocal")
    {
      texto = "eliminar el registro del producto en el local, se eliminarán las existencias del local";
    }

    const codigo = await this.swalservice.alertTextoIngreso({
      title: "ELIMINAR REGISTRO "  + this.descripcion_eliminar,
      text: 'Ingresa el código de petición para ' + texto,
      valorInicial: '',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar'
    });

    if (codigo == null) {
      return;
    }
      
    this.verificarSolicitudEliminacion(this.cod_producto_eliminar, codigo, proceso);
       

       
  }

  async verificarSolicitudEliminacion(cod_producto: string, codigo: string, proceso: string)
  {
    try
    {
      this.swalservice.iniciarLoading("Verificando solicitud...");
      let data: any = await lastValueFrom(this.eliminacionproductoservice.verificarSolicitudEliminacion(cod_producto, codigo, proceso));
      this.swalservice.close();
      if (data.estado == true)
      {
        if(proceso=="eliminar")
        {
          this.eliminar();
        }
        
        if(proceso=="eliminarlocal")
        {
          this.eliminarProductoSucursal();
        }
      }
      else
      {
        const ok = await this.swalservice.alertError("Códido no valido, el codigo ingresado no existe o expiró, cada codigo tiene máximo 10 minutos de validez, vuelva a intertarlo por favor");
        this.ingresarCodigo(proceso);
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }
  
  async clickEliminarProductoSucursal(cod_producto_eliminar: string, descripcion_eliminar: string)
  {
    this.cod_producto_eliminar = cod_producto_eliminar;
    this.descripcion_eliminar = descripcion_eliminar;

    if(this.opcionesprivilegios["eliminacionporcodigo"]==1)
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "REGISTRO "  + this.descripcion_eliminar,
        text: "Realizar petición de eliminación del registro seleccionado",
        icon: "warning",
        confirmText: "Si, Enviar",
        cancelText: "No, Cerrar"
      });

      if (ok)
      {
        this.emitirSolicitudEliminacion("eliminarlocal");
      }
    }
    else
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "ELIMINAR REGISTRO "  + this.descripcion_eliminar,
        text: "Confirmar para eliminar el registro seleccionado en el local, solo se eliminará del local que esta seleccionado",
        icon: "info",
        confirmText: "Si, Eliminar",
        cancelText: "No, Cerrar"
      });

      if (ok)
      {
        await this.eliminarProductoSucursal();
      }
    }
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  editar(item: any)
  {
      this.childproductoform.nombreformulario = "EDITAR";
      let cod_producto = item.cod_producto;
      $("#mymodalformproducto").modal("show");
      this.childproductoform.buscarProducto(cod_producto);
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
      const parametros = {
        'cod_producto' : this.cod_producto_eliminar,
        'estado' : 0,
      };
      let data: any = await lastValueFrom(this.productoservice.eliminar(parametros));
      this.swalservice.close();
      if (data.estado == true)
      {
        this.formularioNormal();
        this.childproductoform.formularioNormal();      
        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo eliminar e, vuelva a intertarlo por favor");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }

  async eliminarProductoSucursal()
  {
    this.swalservice.iniciarLoading("Eliminando producto en local...");
    try
    {
      const parametros = {
        'cod_producto' : this.cod_producto_eliminar,
        'cod_sucursal' : this.cod_sucursal,
      };

      let data: any = await lastValueFrom(this.productoservice.eliminarProductoSucursal(parametros));
      this.swalservice.close();
      if (data.estado == true)
      {
        this.toastr.success("Registro de producto eliminado en el local satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        await this.formularioNormal();
        this.childproductoform.formularioNormal();
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo eliminar en el local, vuelva a intertarlo por favor");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }
  
  async formularioNormal()
  {
    this.cod_producto_eliminar=""
    this.descripcion_eliminar="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      if(this.cod_sucursal == "0")
      {
        await this.listarProductosGenerales();
      }
      else
      {
        await this.listarProductos();
      }
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }

    
  }

  async listarProductosGenerales()
  {
    this.page = 1;
    this.filterpost = "";
    this.datos = [];
    let data: any = await lastValueFrom(this.productoservice.listarProductosGenerales());
    this.datos = data;
    this.cantidad_registros = data.length;
  }
  
  async listarProductos()
  {
    this.page = 1;
    this.filterpost = "";
    this.datos = [];
    let data: any = await lastValueFrom(this.productoservice.listarProductos(this.cod_sucursal));
    this.datos = data;
    this.cantidad_registros = data.length;
  }

  recibirDatosProducto(): void {
    this.formularioNormal();
    this.childproductoform.formularioNormal();
    $("#mymodalformproducto").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  clickNuevoProducto()
  {
    this.childproductoform.nombreformulario = "NUEVA";
    this.childproductoform.formularioNormal();
    this.childproductoform.listarSucursales();
    $("#mymodalformproducto").modal("show");
  }


  
  agregarexistencias(cod_producto: string)
  {
    this.childexistencias.buscarProducto(cod_producto);
    $("#mymodalagregarexistencias").modal("show");
  }

  agregartarifas(cod_producto: string)
  {
   this.childtarifas.buscarProducto(cod_producto);
   $("#mymodalagregartarifas").modal("show");
  }

  revisarpreciosproductoproveedores(cod_producto: string, descripcion: string)
  {
    this.childpreciosproveedor.cod_producto = cod_producto;
    this.childpreciosproveedor.listarproductoproveedores();
    $("#mymodalpreciosproveedores").modal("show");
  }

  revisarfacturasproveedores(cod_producto: string, descripcion: string)
  {
    this.childfacturaproveedor.cod_producto = cod_producto;
    this.childfacturaproveedor.descripcion = descripcion;
    this.childfacturaproveedor.listarProductoFacturasProveedor();
    $("#mymodalfacturasproveedores").modal("show");
  }

}