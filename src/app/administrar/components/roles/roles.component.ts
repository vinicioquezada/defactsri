import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { RolesService } from '../../services/roles.service';
import { RolesFormComponent } from './roles-form/roles-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { FuncionalidadComponent } from './funcionalidad/funcionalidad.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  @ViewChild(RolesFormComponent) childroles!: RolesFormComponent;
  @ViewChild(FuncionalidadComponent) childfuncionalidad!: FuncionalidadComponent;
  datos : any;
  filterpost = "";

  cod_roles : string = "";
  roles : string = "";
  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private rolesservice: RolesService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_roles: string, roles: string)
  {
    this.cod_roles = cod_roles;
    this.roles = roles;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.roles,
          text: "Confirmar para eliminar el registro seleccionado",
          icon: "info",
          confirmText: "Si, Eliminar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.eliminar();
        }
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
    this.childroles.formularioNormal();
  }

  editar(item : any)
  {
      this.childroles.nombreformulario = "EDITAR";
      this.childroles.editar(item);
      $("#mymodalformroles").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_roles' : this.cod_roles,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.rolesservice.eliminar(parametros));

        this.swalservice.close();

        if (data.estado == true)
        {
          this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          await this.formularioNormal();
        }
        else
        {
          const ok = await this.swalservice.alertError("Registro no se pudo Eliminar, vuelva a intertarlo por favor");
        }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }
  
  async formularioNormal()
  {
    this.cod_roles=""
    this.roles="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.listarRoles();
      this.childroles.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarRoles()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.rolesservice.listarroles());
    this.datos = data;
  }

  

  clickNuevaRoles()
  {
    this.childroles.nombreformulario = "NUEVA";
    this.childroles.formularioNormal();
    $("#mymodalformroles").modal("show");
  }

  recibirDatosRoles(): void
  {
      this.formularioNormal();
      this.childroles.formularioNormal();
      $("#mymodalformroles").modal("hide");
  }

  clickfuncionalidad(cod_roles_funcionalidad: string, roles_funcionalidad: string)
  {
    this.childfuncionalidad.cod_roles_funcionalidad = cod_roles_funcionalidad;
    this.childfuncionalidad.roles_funcionalidad = roles_funcionalidad;
    this.childfuncionalidad.listarfuncionalidades();
    $("#mymodallistarfuncionalidades").modal("show");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}