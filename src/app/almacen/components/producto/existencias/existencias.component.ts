import { Component, OnInit } from '@angular/core';
import { ExistenciasService } from 'src/app/almacen/services/existencias.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ProductoService } from 'src/app/almacen/services/producto.service';
declare var $:any;

@Component({
  selector: 'app-existencias',
  templateUrl: './existencias.component.html',
  styleUrls: ['./existencias.component.css']
})
export class ExistenciasComponent implements OnInit {
  kardex : string = "";
  control_estricto_inventario : string = "0";
  fraccionado : string = "";
  unidades_denominacion : number = 0;
  cod_producto : string = "";
  descripcion : string = "";
  ban : number = 1;

  loading : boolean = false;
  datosexistencias : any;

  constructor(private toastr: ToastrService, private error:ErrorService, private existenciaservice:ExistenciasService, private usersession: UserSessionService, private sucursalesservice:SucursalesService, private productoservice:ProductoService) { }

  ngOnInit(): void {
    this.control_estricto_inventario = this.usersession.getConfiguracion("control_estricto_inventario");
  }

  changeHabilitar(index: number): void {
    if(this.kardex == "1") {
      this.toastr.warning("No se puede editar las existencias mientras el Kardex esta habilitado, debe ingresar mercaderia o dar de baja", "INFORMACIÓN DEL SISTEMA");
    }

    if(this.datosexistencias[index].habilitar==true){
      this.datosexistencias[index].habilitar = false;
    }else{
      this.datosexistencias[index].habilitar = true;
    }
  }

  keyUpCalcularExistencias(index: number): void {
    this.datosexistencias[index].total_unidades = parseFloat(this.datosexistencias[index].cantidad_denominacion) * this.unidades_denominacion;
    this.datosexistencias[index].existencia = this.datosexistencias[index].total_unidades;
  }

  keyUpAjustarExistencias(index: number): void {
    let existencia = 0;

    if(this.fraccionado=="SI")
    {
      existencia = parseFloat(this.datosexistencias[index].total_unidades) + parseFloat(this.datosexistencias[index].ajustar_existencia);
    }
    else
    {
      existencia = parseFloat(this.datosexistencias[index].total_unidades) + this.datosexistencias[index].ajustar_existencia =="NaN" ? 0 : parseFloat(this.datosexistencias[index].ajustar_existencia);
    }
    this.datosexistencias[index].existencia = existencia;
  }

  actualizarexistencia()
  {
    this.loading = true;

    const parametros = {
      'cod_producto' : this.cod_producto,
      'existencias' : this.datosexistencias
    };

    this.existenciaservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.toastr.success("Existencias Actualizada Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Existencias no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });

  }

   listarExistenciasProducto()
  {    
    this.loading = true;
    

    this.datosexistencias = [];

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {

      for (let item of data){
        let cod_existencias = this.cod_producto + "_" + item.cod_sucursal;
        
        let sucursal = {
            habilitar : false,
            cod_existencias : cod_existencias,
            cod_sucursal : item.cod_sucursal,
            sucursal : item.sucursal,
            cantidad_denominacion : "0",
            total_unidades : "0",
            ajustar_existencia : "0",
            existencia : "0"
        }
        
        this.datosexistencias.push(sucursal);
      }

      this.listarExistenciasProducto2();

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  listarExistenciasProducto2()
  {    
    this.loading = true;
    
    //this.datosexistencias = [];


    this.existenciaservice.listarExistenciasProducto(this.cod_producto).subscribe( (data : any) =>
    {
      //console.log(data);

      for (let item of data)
      {
        let cod_sucursal = item.cod_sucursal;
        if(this.fraccionado == "SI")
        {
          item.total_unidades = this.unidades_denominacion * item.cantidad_denominacion;
        }

        this.datosexistencias.map(function(dato){
          if(dato.cod_sucursal == cod_sucursal){
            
            let habilitar = true;

            dato.habilitar = habilitar,
            dato.cod_existencias = item.cod_existencias,
            dato.cod_sucursal = item.cod_sucursal,
            dato.sucursal = item.sucursal,
            dato.cantidad_denominacion = item.cantidad_denominacion,
            dato.total_unidades = item.total_unidades,
            dato.ajustar_existencia = "0",
            dato.existencia = item.existencia
          }
          
          return dato;
        });
       
      }
      //console.log(this.datosexistencias);

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  buscarProducto(cod_producto: string)
  {
    this.cod_producto = cod_producto;   
    this.loading = true;
    this.productoservice.buscarProducto(this.cod_producto).subscribe( (data : any) =>
    {
      this.loading = false;
      this.descripcion = data.descripcion;
      this.fraccionado = data.fraccionado;
      this.unidades_denominacion = data.unidades_denominacion;
      this.listarExistenciasProducto();

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

}
