import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { TipoTarifaService } from 'src/app/almacen/services/tipo-tarifa.service';
import { TarifaService } from 'src/app/almacen/services/tarifa.service';
import { CompraService } from 'src/app/compra/services/compra.service';
import { ProveedorProductoService } from 'src/app/compra/services/proveedor-producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../../shared/js/decimales.js';
import * as moment from 'moment';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit {
  precios_completos : string = "0";
  tarifas : string = "0";
  datostarifa : any;

  cod_producto : string = "";
  descripcion : string = "";
  

  loading : boolean = false;
  loadinglistado : boolean = false;
  

  datostipotarifa : any;
  flagocultarboton : boolean = false;
  ban : number = 0;
  codigotemporal : string = "";
  cod_tarifa : string = "";
  cod_tipo_tarifa : string = "0";
  tipo_tarifa : string = "";
  cantidad_unidad : string = "";
  utilidad : string = "";
  iva : string = "";
  costo_base_tarifa : string = "";
  costo_compra_tarifa : string = "";
  precio_base_tarifa : string = "";
  precio_venta_tarifa : string = "";
  observacion : string = "";
  flagtipotarifa : boolean = false;
  flagcostobasetarifa : boolean = false;
  flagcostocompratarifa : boolean = false;
  flagcantidadunidad : boolean = false;
  flagpreciobasetarifa : boolean = false;
  flagprecioventatarifa : boolean = false;
  flagporx : boolean = false;
  flagmayorigual : boolean = false;

  cod_tarifa_eliminar : string = "";
  tarifa_eliminar : string = "";

  codigo : string = "";

  costo_base : string = "";
  costo_compra : string = "";
  precio_base : string = "";
  precio_venta : string = "";


  pagefacturaproveedor = 1;
  countfacturaproveedor = 0;
  pagesizefacturaproveedor = 5;

  pagepreciosproveedor = 1;
  countpreciosproveedor = 0;
  pagesizepreciosproveedor = 5;

  bcodigo : boolean = false;
  bporx : boolean = false;
  bmayorigual : boolean = false;
  porx : string = "";
  mayorigual : string = "";
  cod_forma_tarifa: string = "0";
  datosformatarifa : any[] = [
    {
      "cod_forma_tarifa" : "0",
      "forma_tarifa" : "MANUAL"
    },
    {
      "cod_forma_tarifa" : "1",
      "forma_tarifa" : "PROMOCIÓN (POR X)"
    },
    {
      "cod_forma_tarifa" : "2",
      "forma_tarifa" : "MAYOREO (>=)"
    }
  ];

  constructor(private productoservice:ProductoService, private toastr: ToastrService, private error:ErrorService, private tarifaservice:TarifaService, private tipotarifaservice:TipoTarifaService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.precios_completos = this.usersession.getConfiguracion("precios_completos");
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.formularioNormal();
  }

  changeFormaTarifa(event: any): void {
    const elemento = event.target.value;
    this.cod_forma_tarifa = elemento;

    this.codigo = "";
    this.porx = "0";
    this.mayorigual = "0";

    if(elemento == "0")
    {
      this.bcodigo = true;
      this.bporx = false;
      this.bmayorigual = false;
    }
    
    if(elemento == "1")
    {
      this.bcodigo = false;
      this.bporx = true;
      this.bmayorigual = false;
    }

    if(elemento == "2")
    {
      this.bcodigo = false;
      this.bporx = false;
      this.bmayorigual = true;
    }

    this.cantidad_unidad = "1";
    this.utilidad = "0";
    this.precio_base_tarifa = "0";
    this.precio_venta_tarifa = "0";
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

  agregartarifas(item: any)
  {
    this.cod_producto = item.cod_producto;
    this.descripcion = item.descripcion;
    this.costo_base = item.costo_base;
    this.costo_compra = item.costo_compra;
    this.precio_base = item.precio_base;
    this.precio_venta = item.precio_venta;
    this.costo_base_tarifa = item.costo_base;
    this.costo_compra_tarifa = item.costo_compra;
    this.iva = item.iva;

    this.formularionormaltarifa();
    $("#mymodalagregartarifas").modal("show");
  }

  agregartarifaeditar(item: any)
  {
    this.cod_tarifa = item.cod_tarifa;
    this.cod_tipo_tarifa = item.cod_tipo_tarifa;
    this.tipo_tarifa = item.tipo_tarifa;
    this.cantidad_unidad = item.cantidad_unidad;
    this.precio_base_tarifa = item.precio_base;
    this.precio_venta_tarifa = item.precio_venta;
    this.costo_base_tarifa = item.costo_base;
    this.costo_compra_tarifa = item.costo_compra;
    this.cod_forma_tarifa = item.cod_forma_tarifa;
    this.observacion = item.observacion;

    this.codigo = "";
    this.porx = "0";
    this.mayorigual = "0";

    if(this.cod_forma_tarifa == "0")
    {
      this.codigo = item.codigo;
      this.codigotemporal = this.codigo;
      this.bcodigo = true;
      this.bporx = false;
      this.bmayorigual = false;
    }
    
    if(this.cod_forma_tarifa == "1")
    {
      this.porx = item.porx;
      this.bcodigo = false;
      this.bporx = true;
      this.bmayorigual = false;
    }

    if(this.cod_forma_tarifa == "2")
    {
      this.mayorigual = item.mayorigual;
      this.bcodigo = false;
      this.bporx = false;
      this.bmayorigual = true;
    }

    this.flagnormaltarifa();
    this.flagocultarboton = true;
    this.ban=1;
  }

  onchangetipotarifa(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_tarifa = elemento;
  }

  clickguardartarifa()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.codigo.length==0)
      {
          this.guardartarifa();
      }
      else
      {
        this.buscar();
      }
    }
  }
  
  clickactualizartarifa()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.codigo.length==0)
      {
          this.actualizartarifa();         
      }
      else
      {
        if(this.codigo==this.codigotemporal)
        {
          this.actualizartarifa();
        }
        else
        {
          this.buscar();
        }
      }
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagnormaltarifa();

    if(this.cod_tipo_tarifa == "0")
    {
      this.flagtipotarifa=true;
      valor=true;
    }

    if(this.cantidad_unidad.length==0 || Number(this.cantidad_unidad) <= 0)
    {
      this.flagcantidadunidad=true;
      valor=true;
    }

    if(this.precio_base_tarifa.length==0 || Number(this.precio_base_tarifa)==0)
    {
      this.flagpreciobasetarifa=true;
      valor=true;
    }

    if(this.precio_venta_tarifa.length==0 || Number(this.precio_venta_tarifa)==0)
    {
      this.flagprecioventatarifa=true;
      valor=true;
    }

    if(this.bporx == true)
    {
      if(this.porx.length==0)
      {
        this.flagporx=true;
        valor=true;
      }
    }

    if(this.bmayorigual == true)
    {
      if(this.mayorigual.length==0)
      {
        this.flagmayorigual=true;
        valor=true;
      }
    }



    return valor;
  }

  flagnormaltarifa()
  {
    this.flagtipotarifa = false;
    this.flagcantidadunidad = false;
    this.flagpreciobasetarifa = false;
    this.flagprecioventatarifa = false;
    this.flagcostobasetarifa = false;
    this.flagcostocompratarifa = false;
    this.flagporx = false;
    this.flagmayorigual = false;
  }

  clickdeshacertarifa()
  {
    this.formularionormaltarifa();
  }

  clickEliminartarifa(cod_tarifa_eliminar: string, tarifa_eliminar: string)
  {
    this.cod_tarifa_eliminar = cod_tarifa_eliminar;
    this.tarifa_eliminar = tarifa_eliminar;
    
    Swal.fire({
      title: 'ELIMINAR REGISTRO '  + this.tarifa_eliminar,
      text: 'Confirmar para eliminar el registro seleccionado',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Eliminar'
    }).then((result) => {
      if (result.value) {
        this.eliminartarifa();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  formularionormaltarifa()
  {
    this.cod_tarifa=moment().unix().toString();
    this.flagocultarboton = false;
    this.flagnormaltarifa();

    this.codigotemporal = "";
    this.cod_tipo_tarifa = "0";
    this.tipo_tarifa = "";
    this.cantidad_unidad = "1";
    this.costo_base_tarifa = "0";
    this.costo_compra_tarifa = "0";
    this.utilidad = "0";
    this.precio_base_tarifa = "0";
    this.precio_venta_tarifa = "0";
    this.observacion = "";
    this.codigo = "";

    this.bcodigo = true;
    this.bporx = false;
    this.bmayorigual = false;
    this.porx = "0";
    this.mayorigual = "0";
    this.cod_forma_tarifa = "0";

    this.ban = 0;

    this.listarTiposTarifas();

    this.listarTarifas();
  }

  guardartarifa = () =>{
    this.loading = true;
    const parametros = {
      'cod_tarifa' : this.cod_tarifa,
      'cod_tipo_tarifa' : this.cod_tipo_tarifa,
      'costo_base' : this.costo_base_tarifa,
      'costo_compra' : this.costo_compra_tarifa,
      'utilidad' : this.utilidad,
      'precio_base' : this.precio_base_tarifa,
      'precio_venta' : this.precio_venta_tarifa,
      'observacion' : this.observacion,
      'cod_producto' : this.cod_producto,
      'cantidad_unidad' : this.cantidad_unidad,
      'codigo' : this.codigo,
      'cod_forma_tarifa' : this.cod_forma_tarifa,
      'porx' : this.porx,
      'mayorigual' : this.mayorigual,
      'estado' : 1
    };

    this.tarifaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.formularionormaltarifa();
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });

  }

  actualizartarifa = () =>{
    this.loading = true;
    const parametros = {
      'cod_tarifa' : this.cod_tarifa,
      'cod_tipo_tarifa' : this.cod_tipo_tarifa,
      'costo_base' : this.costo_base_tarifa,
      'costo_compra' : this.costo_compra_tarifa,
      'utilidad' : this.utilidad,
      'precio_base' : this.precio_base_tarifa,
      'precio_venta' : this.precio_venta_tarifa,
      'observacion' : this.observacion,
      'cod_producto' : this.cod_producto,
      'cantidad_unidad' : this.cantidad_unidad,
      'codigo' : this.codigo,
      'cod_forma_tarifa' : this.cod_forma_tarifa,
      'porx' : this.porx,
      'mayorigual' : this.mayorigual,
      'estado' : 1
    };

    this.tarifaservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.formularionormaltarifa();
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });

  }

  activarTarifa(cod_tarifa: Number, valor_estado: number)
  {
    this.loadinglistado = true;
    let mensaje: string = "";
    if(valor_estado==1)
    {
      mensaje = "habilitado";
    }
    else
    {
      mensaje = "deshabilitado";
    }

    const parametros = {
      'cod_tarifa' : cod_tarifa,
      'estado' : valor_estado,
    };

    this.tarifaservice.activarTarifa(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      
      if (data.estado == true)
      {
        if(valor_estado==1)
        {
          this.datostarifa.find((x:any) => x.cod_tarifa == cod_tarifa).estado_visible = 1;
        }
        else
        {
          this.datostarifa.find((x:any) => x.cod_tarifa == cod_tarifa).estado_visible = 0;
        }
        this.toastr.success("Registro " + mensaje + " satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo " + mensaje + ", vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
  });

  }

  buscar()
  {
    this.loading = true;
    

    this.tarifaservice.buscar(this.codigo).subscribe( (data : any) =>
    {
      if (data.cod_tarifa == false)//No existe
      {
          if (this.ban == 0)
          {
            this.guardartarifa();
          }
          else
          {
            this.actualizartarifa();         
          }
      }
      else
      {
          this.toastr.warning("Tarifa se encuentra registrado con el codigo de barra ingresado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });
  }

  eliminartarifa = () =>{

    this.loadinglistado = true;

    const parametros = {
      'cod_tarifa' : this.cod_tarifa_eliminar,
      'estado' : 0,
    };
    
    this.tarifaservice.eliminar(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      

      if (data.estado == true)
      {
        
        this.formularionormaltarifa();        

        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
  });
  }

  listarTiposTarifas()
  {    
    this.loadinglistado = true;
    

    this.tipotarifaservice.listarTiposTarifas().subscribe( (data : any) =>
    {
      this.datostipotarifa = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarTarifas()
  {    
    this.loadinglistado = true;
    

    this.tarifaservice.listarTarifas(this.cod_producto).subscribe( (data : any) =>
    {
      this.datostarifa = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  calcularcostobasetarifa()
  {
    let porcentaje_iva = ( parseFloat(this.costo_base_tarifa) * parseFloat(this.iva)) / 100;
    this.costo_compra_tarifa = (parseFloat(this.costo_base_tarifa) + porcentaje_iva).toFixed(6);
  }
  
  calcularcostocompratarifa()
  {
    let porcentaje_iva = ( parseFloat(this.iva) /100) + 1;
    let costo_base_tarifa = parseFloat(this.costo_compra_tarifa) / porcentaje_iva;
    this.costo_base_tarifa = costo_base_tarifa.toFixed(6);
  }

  calcularUtilidad()
  {
		let iva = parseFloat(this.iva);
		let iva2=iva;
		iva = iva/100;	

    let total_normal = (parseFloat(this.costo_base) * parseFloat(this.utilidad))/100;
		let precio_base = parseFloat(this.costo_base) + total_normal;
		this.precio_base_tarifa = precio_base.toFixed(6);
		let precio_venta = precio_base + (precio_base * iva);
		this.precio_venta_tarifa = redondeardecimales(precio_venta, 2);
  }

  calcularPrecioBase()
  {
    let porcentaje_iva = ( parseFloat(this.precio_base_tarifa) * parseFloat(this.iva)) / 100;
    let precioventatarifa = parseFloat(this.precio_base_tarifa) + porcentaje_iva;
    this.precio_venta_tarifa = redondeardecimales(precioventatarifa, 2);
  }
  
  calcularPrecioVenta()
  {
    let porcentaje_iva = ( parseFloat(this.iva) /100) + 1;
    let precio_base_tarifa = parseFloat(this.precio_venta_tarifa) / porcentaje_iva;
    this.precio_base_tarifa = precio_base_tarifa.toFixed(6);
  }

  buscarProducto(cod_producto: string)
  {
    this.cod_producto = cod_producto;   
    this.loading = true;
    this.productoservice.buscarProducto(this.cod_producto).subscribe( (data : any) =>
    {
      this.loading = false;
      this.descripcion = data.descripcion;
      this.cod_producto = data.cod_producto;
      this.descripcion = data.descripcion;
      this.costo_base = data.costo_base;
      this.costo_compra = data.costo;
      this.precio_base = data.precio_base;
      this.precio_venta = data.precio_venta;
      this.costo_base_tarifa = data.costo_base;
      this.costo_compra_tarifa = data.costo;
      this.iva = data.iva;

      this.formularionormaltarifa();

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }
}