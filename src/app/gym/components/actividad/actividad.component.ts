import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActividadService } from '../../services/actividad.service';
import { ActividadFormComponent } from './actividad-form/actividad-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {
  @ViewChild(ActividadFormComponent) childactividad!: ActividadFormComponent;
  datos : any;
  filterpost = "";

  cod_actividad : string = "";
  actividad : string = "";
  loadinglistado : boolean = false;
  
  tipoformulario: string = "normal";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private actividadservice: ActividadService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_actividad: string, actividad: string)
  {
    this.cod_actividad = cod_actividad;
    this.actividad = actividad;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.actividad,
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
    this.childactividad.formularioNormal();
  }

  editar(item : any)
  {
      this.childactividad.tipoformulario = "EDITAR";
      this.childactividad.editar(item);
      $("#mymodalformactividad").modal("show");
  }
 
  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");

    try
    {
      const parametros = {
        'cod_actividad' : this.cod_actividad,
        'estado' : 0,
      };
      
      let data: any = await lastValueFrom(this.actividadservice.eliminar(parametros));
      this.swalservice.close();

      if (data.estado == true)
      {
        await this.formularioNormal();
        this.childactividad.formularioNormal();
        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
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
    this.cod_actividad=""
    this.actividad="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.listarActividades();;
      this.childactividad.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }

  async listarActividades()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.actividadservice.listarActividades());
    this.datos = data;
  }

  recibirDatosCategoria(): void {
    this.formularioNormal();
    this.childactividad.formularioNormal();
  }

  clickNuevaActividad()
  {
    this.childactividad.tipoformulario = "NUEVA";
    this.childactividad.formularioNormal();
    $("#mymodalformactividad").modal("show");
  }

  recibirDatosActividad(): void
  {
      this.formularioNormal();
      this.childactividad.formularioNormal();
      $("#mymodalformactividad").modal("hide");
  }

  registrarHorario(cod_actividad : string, actividad : string)
  {
     this.router.navigate(["/menugym/actividadhorario", cod_actividad, actividad]);
  }

  verHorarios(cod_actividad : string, actividad : string)
  {
     this.router.navigate(["/menugym/horarioreservaactividad", cod_actividad, actividad]);
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}