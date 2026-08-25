import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { RolesService } from 'src/app/administrar/services/roles.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { lastValueFrom } from 'rxjs';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  datosidentificacion : any;
  datosroles : any;
  datosgenero : string[] = ["MASCULINO", "FEMENINO"];

  cod_empleado : string = "";
  cedula : string = "";
  rrpp : string = "";
  apellido : string = "";
  nombre : string = "";
  genero : string = "";
  convencional : string = "";
  celular : string = "";
  correo : string = "";
  direccion : string = "";
  titulo : string = "";
  cod_roles : string = "0";
  roles: string = "";

  flagocultarboton : boolean = false;

  flagidentificacion : boolean = false;
  flagcedula : boolean = false;
  flagapellido : boolean = false;
  flagnombre : boolean = false;
  /*
  flagrrpp : boolean = false;
  flagconvencional : boolean = false;
  flagcelular : boolean = false;
  flagcorreo : boolean = false;
  flagdireccion : boolean = false;
  flagtitulo : boolean = false;
  */
  flagroles : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";

  loadingform : boolean = false;


  constructor(private empleadoservice:EmpleadoService, private toastr: ToastrService, private error:ErrorService, private rolesservice:RolesService, private swalservice: SwalService) { 
  }

  ngOnInit(): void {
    this.cargarCombos();
  }

  async cargarCombos()
  {
    await this.formularioNormal();
    this.listarroles();
  }

  onchangegenero(event: any): void {
    const elemento = event.target.value;
    this.genero = elemento;
  }

  agregar(item: any)
  {
      this.flagNormal();

      this.cod_empleado = item.cod_empleado;
      this.cedula = item.cedula;
      this.rrpp = item.rrpp;
      this.apellido = item.apellido;
      this.nombre = item.nombre;
      this.genero = item.genero;
      this.direccion = item.direccion;
      this.titulo = item.titulo;
      this.convencional = item.convencional;
      this.celular = item.celular;
      this.correo = item.correo;
      this.cod_roles = item.cod_roles;
      this.roles = item.roles;
      this.flagocultarboton = true;
      this.codigotemporal=this.cedula;
      this.ban=1;
  }

  clickCerrar()
  {
    this.formularioNormal();
  }

  async clickGuardar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      const ok = await this.swalservice.alertAviso("Algunos campos no estan llenos, son obligatorios");
    }
    else
    {
      this.swalservice.iniciarLoading("Almacenando...");
      try
      {
        await this.buscar();
      } catch (err: any) {
        const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      } finally {
        this.swalservice.close();
      } 
    }
  }

  async clickActualizar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      const ok = await this.swalservice.alertAviso("Algunos campos no estan llenos, son obligatorios");
    }
    else
    {
      this.swalservice.iniciarLoading("Actualizando...");
      try
      {
        if(this.cedula==this.codigotemporal)
        {
          await this.actualizar();
        }
        else
        {
          await this.buscar();
        }
      } catch (err: any) {
        const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      } finally {
        this.swalservice.close();
      } 
      
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.cedula.length==0)
    {
      this.flagcedula=true;
      valor=true;
    }

    if(this.apellido.length==0)
    {
      this.flagapellido = true;
      valor=true;
    }

    if(this.nombre.length==0)
    {
      this.flagnombre = true;
      valor=true;
    }

    /*
    if(this.rrpp.length==0)
    {
      this.flagrrpp = true;
      valor=true;
    }

    if(this.convencional.length==0)
    {
      this.flagconvencional = true;
      valor=true;
    }

    if(this.celular.length==0)
    {
      this.flagcelular = true;
      valor=true;
    }

    if(this.correo.length==0)
    {
      this.flagcorreo = true;
      valor=true;
    }

    if(this.direccion.length==0)
    {
      this.flagdireccion = true;
      valor=true;
    }

    if(this.titulo.length==0)
    {
      this.flagtitulo = true;
      valor=true;
    }
    */

    if(this.cod_roles=="0")
    {
      this.flagroles=true;
      valor=true;
    }
    return valor;
  }

  flagNormal()
  {
    this.flagidentificacion = false;
    this.flagcedula = false;
    this.flagapellido = false;
    this.flagnombre = false;
    /*
    this.flagrrpp = false;
    this.flagconvencional = false;
    this.flagcelular = false;
    this.flagcorreo = false;
    this.flagdireccion = false;
    this.flagtitulo = false;
    */
    this.flagroles=false;
  }
  
  onChangeRoles(event: any): void {
    const elemento = event.target.value;
    this.cod_roles = elemento;
  }
 
  async buscar()
  {
    let data: any = await lastValueFrom(this.empleadoservice.buscar(this.cedula));

    if (data.cod_empleado == false)//No existe
    {
        if (this.ban == 0)
        {
          await this.guardar();
        }
        else
        {
          await this.actualizar();         
        }
    }
    else
    {
      const ok = await this.swalservice.alertAviso("Empleado se encuentra registrado, vuelva a intertarlo por favor");    
    }
  }

  async guardar()
  {
    const parametros = {
      'cod_empleado' : this.cod_empleado,
      'cedula' : this.cedula,
      'rrpp' : this.rrpp,
      'apellido' : this.apellido,
      'nombre' : this.nombre,
      'genero' : this.genero,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      'titulo' : this.titulo,
      'cod_roles' :this.cod_roles
    };

    let data: any = await lastValueFrom(this.empleadoservice.guardar(parametros));

    if (data.estado == true)
    {
      this.datosenvio.emit();
      this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      const ok = await this.swalservice.alertError("Registro no se pudo Almacenar, vuelva a intertarlo por favor");
    }
    
  }
  
  async actualizar()
  {    

    const parametros = {
      'cod_empleado' : this.cod_empleado,
      'cedula' : this.cedula,
      'rrpp' : this.rrpp,
      'apellido' : this.apellido,
      'nombre' : this.nombre,
      'genero' : this.genero,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      'titulo' : this.titulo,
      'cod_roles' :this.cod_roles
    };

    let data: any = await lastValueFrom(this.empleadoservice.actualizar(parametros));

    if (data.estado == true)
    {
      this.datosenvio.emit();
      this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      const ok = await this.swalservice.alertError("Registro no se pudo Actualizar, vuelva a intertarlo por favor");
    }
    

  }
  
  async formularioNormal()
  {
    this.cod_empleado = moment().unix().toString();
    this.cedula = "";
    this.rrpp = "";
    this.apellido = "";
    this.nombre = "";
    this.genero = "";
    this.convencional = "";
    this.celular = "";
    this.correo = "";
    this.direccion = "";
    this.titulo = "";
    this.cod_roles = "0";
    this.roles = "";

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.codigotemporal="";
    
    this.ban=0;
  }

  listarroles()
  {    
    this.loadingform = true;
    this.rolesservice.listarroles().subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datosroles = data;

      const objetotipocliente = {
        cod_roles: "0",
        roles: "SELECCIONE UN ROL",
        estado: 1
      };
      this.datosroles.unshift(objetotipocliente);

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
    });
  }
}