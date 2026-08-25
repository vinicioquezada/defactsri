import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
declare var $:any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @ViewChild(UsuarioFormComponent) childusuarioform!: UsuarioFormComponent;
  datos : any;
  filterpost = "";

  datossucursalesusuario : any;

  cod_usuario : Number = 0;
  persona : string = "";
  usuario : string = "";
  password : string = "";


  loadinglistado : boolean = false;
  loadinglistadosucursales : boolean = false;

  cod_empleado_eliminar : string = "";
  empleado_eliminar : string = "";
  

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private usuarioservice:UsuarioService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private swalservice: SwalService, private empleadoservice:EmpleadoService) {
  }

  ngOnInit(): void {
    this.listarusuarios()
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  clickactualizarlistado()
  {
    this.filterpost="";
    this.listarusuarios();
  }

  listarusuarios()
  {
    this.page = 1;
    this.filterpost = "";
    
    this.loadinglistado = true;
    

    this.usuarioservice.listarUsuarios().subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

 agregarsucursal = (cod_usuario: Number) =>{
  $("#mymodallistarsucursalesusuario").modal("show");
  this.cod_usuario = cod_usuario;
  this.listarsucursalesusuario(cod_usuario);
 }

 actualizarusuariocuenta = (cod_usuario : Number, apellido : string, nombre : string, usuario : string) =>{
  $("#mymodalactualizarusuario").modal("show");
  this.cod_usuario = cod_usuario;
  this.persona = apellido + " " + nombre;
  this.usuario = usuario;
 }

activar = (cod_usuario: Number, valor_estado: String) =>{
  let mensaje: string = "";
  let mensajeloader = ""
  if(valor_estado=='HABILITADO')
  {
    mensaje = "habilitado";
    mensajeloader = "Activando";
  }
  else
  {
    mensaje = "deshabilitado";
    mensajeloader = "Desactivando";
  }

  this.swalservice.iniciarLoading(mensajeloader + " Usuario...");

  const parametros = {
    'cod_usuario' : cod_usuario,
    'estado' : valor_estado,
  };

  this.usuarioservice.activarUsuario(parametros).subscribe( (data : any) =>
  {
    this.swalservice.close();
    
    if (data.estado == true)
    {
      if(valor_estado=='HABILITADO')
      {
        this.datos.find((x:any) => x.cod_usuario === cod_usuario).estado = 'HABILITADO';
      }
      else
      {
        this.datos.find((x:any) => x.cod_usuario === cod_usuario).estado = 'DESHABILITADO';
      }
      this.toastr.success("Registro " + mensaje + " satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.toastr.error("Registro no se pudo " + mensaje + ", vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
    }
  }, err => {
    this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    this.swalservice.close();
});

}

guardarsucursalusuario = (cod_sucursal: Number) =>{
  this.swalservice.iniciarLoading("Asignando en local...");
  

  const parametros = {
    'cod_sucursal' : cod_sucursal,
    'cod_usuario' : this.cod_usuario,
  };

  this.usuarioservice.guardarSucursalUsuario(parametros).subscribe( (data : any) =>
  {
    this.swalservice.close();
    
   
    if (data.estado == true)
    {
      this.datossucursalesusuario.find((x:any) => x.cod_sucursal === cod_sucursal).estado_sucursal = 1;
      this.toastr.success("Registro activado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.toastr.error("Registro no se pudo activar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
    }
    
  }, err => {
    this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    this.swalservice.close();
    
});

}

eliminarsucursalusuario = (cod_sucursal: Number) =>{
  this.swalservice.iniciarLoading("Eliminando asignación local...");
  

  const parametros = {
    'cod_sucursal' : cod_sucursal,
    'cod_usuario' : this.cod_usuario,
  };

  this.usuarioservice.eliminarSucursalUsuario(parametros).subscribe( (data : any) =>
  {
    this.swalservice.close();
    
   
    if (data.estado == true)
    {
      this.datossucursalesusuario.find((x:any) => x.cod_sucursal === cod_sucursal).estado_sucursal = 0;
      this.toastr.success("Registro desactivado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.toastr.error("Registro no se pudo desactivar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
    }
    
  }, err => {
    this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    this.swalservice.close();
});

}

actualizarusuario = () =>{
  this.swalservice.iniciarLoading("Actualizando Usuario...");

  const parametros = {
    'cod_usuario' : this.cod_usuario,
    'usuario' : this.usuario,
    'password' : this.password
  };

  this.usuarioservice.actualizarUsuario(parametros).subscribe( (data : any) =>
  {
    this.swalservice.close();
    
   
    if (data.estado == true)
    {
      this.toastr.success("Registro de usuario actualizado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      $("#mymodalactualizarusuario").modal("hide");
      this.usuario = "";
      this.password = "";
      this.filterpost="";
      this.listarusuarios();
    }
    else
    {
      this.toastr.error("Registro de usuaio no se pudo actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
    }
    
  }, err => {
    this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    this.swalservice.close();
  });

}

crearcuentausuario = (cod_empleado : Number, usuario : string) =>{
  this.swalservice.iniciarLoading("Creando cuenta...");

  const parametros = {
    'cod_empleado' : cod_empleado,
    'usuario' : usuario,
    'password' : '12345'
  };

  this.usuarioservice.crearCuentaUsuario(parametros).subscribe( (data : any) =>
  {
    this.swalservice.close();
    
   
    if (data.estado == true)
    {
      this.toastr.success("Cuenta de usuario creada satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      this.listarusuarios();
    }
    else
    {
      this.toastr.error("Cuenta de usuario no se pudo crear, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
    }
    
  }, err => {
    this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    this.swalservice.close();
    
});

}


listarsucursalesusuario(cod_usuario: Number)
  {    
    this.loadinglistadosucursales = true;
    

    this.usuarioservice.listarSucursalesUsuario(cod_usuario).subscribe( (data : any) =>
    {
      this.datossucursalesusuario = data;
      this.loadinglistadosucursales = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistadosucursales = false;
      
    });
    
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  async clickEliminar(cod_empleado_eliminar: string, empleado_eliminar: string)
  {
    this.cod_empleado_eliminar = cod_empleado_eliminar;
    this.empleado_eliminar = empleado_eliminar;
    
    const ok = await this.swalservice.alertConfirmRequerido({
      title: "ELIMINAR REGISTRO "  + this.empleado_eliminar,
      text: "Confirmar para eliminar el registro seleccionado",
      icon: "info",
      confirmText: "Si, Eliminar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      await this.eliminar();
    }
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
    
      const parametros = {
        'cod_empleado' : this.cod_empleado_eliminar,
        'estado' : 0,
      };

      let data: any = await lastValueFrom(this.empleadoservice.eliminar(parametros));


      if (data.estado == true)
      {
          this.listarusuarios();

        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo Eliminar, vuelva a intertarlo por favor");
      }

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }

  editar(item : any)
  {
      this.childusuarioform.nombreformulario = "EDITAR";
      this.childusuarioform.cedula = item.cedula;
      this.childusuarioform.agregar(item);
      $("#mymodalformempleado").modal("show");
  }

  recibirDatosUsuario()
  {
    this.listarusuarios();
    this.childusuarioform.formularioNormal();
    $("#mymodalformempleado").modal("hide");
  }

  clickNuevoCliente()
  {
    this.childusuarioform.nombreformulario = "NUEVO";
    this.childusuarioform.formularioNormal();
    $("#mymodalformempleado").modal("show");
  }
}