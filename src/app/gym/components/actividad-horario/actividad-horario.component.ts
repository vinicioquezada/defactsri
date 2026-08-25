import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActividadHorarioService } from '../../services/actividad-horario.service';
import { ActividadHorarioFormComponent } from './actividad-horario-form/actividad-horario-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-actividad-horario',
  templateUrl: './actividad-horario.component.html',
  styleUrls: ['./actividad-horario.component.css']
})
export class ActividadHorarioComponent implements OnInit {
  @ViewChild(ActividadHorarioFormComponent) childactividadhorario!: ActividadHorarioFormComponent;
  datos : any;
  filterpost = "";

  cod_actividad : string = "";
  actividad : string = "";
  cod_actividad_horario : string = "";
  actividad_horario : string = "";

  loadinglistado : boolean = false;
  
  tipoformulario: string = "normal";

  page = 1;
  count = 0;
  pagesize = 20;

  constructor(private actividadhorarioservice: ActividadHorarioService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private rutaActiva: ActivatedRoute, private bodyStyleService: BodyStyleService) {
  }

  ngOnInit(): void {
    this.cod_actividad = this.rutaActiva.snapshot.paramMap.get("cod_actividad")!;
    this.actividad = this.rutaActiva.snapshot.paramMap.get("actividad")!;
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  clickEliminar(item: any)
  {
    this.cod_actividad_horario = item.cod_actividad_horario;
    
    Swal.fire({
      title: 'ELIMINAR REGISTRO '  + item.dia + " (" + item.hora_inicio + " - " + item.hora_fin + ")",
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
  
  clickDeshacer()
  {
    this.formularioNormal();
    this.childactividadhorario.formularioNormal();
  }

  editar(item: any)
  {
      this.childactividadhorario.tipoformulario = "EDITAR";
      this.childactividadhorario.editar(item);
      $("#mymodalformactividadhorario").modal("show");
  }
 
  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
      const parametros = {
        'cod_actividad_horario' : this.cod_actividad_horario,
        'estado' : 0,
      };
      
      let data: any = await lastValueFrom(this.actividadhorarioservice.eliminar(parametros));
      this.swalservice.close();

      if (data.estado == true)
      {
        await this.formularioNormal();
        this.childactividadhorario.formularioNormal();
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
    this.cod_actividad_horario=""
    this.actividad_horario="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.listarActividadHorarios();
      this.childactividadhorario.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarActividadHorarios()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.actividadhorarioservice.listarActividadHorarios(this.cod_actividad));
    this.datos = data;
  }

  recibirDatosCategoria(): void {
    this.formularioNormal();
    this.childactividadhorario.formularioNormal();
  }

  clickNuevaActividad()
  {
    this.childactividadhorario.tipoformulario = "NUEVA";
    this.childactividadhorario.formularioNormal();
    this.childactividadhorario.cod_actividad = this.cod_actividad;
    $("#mymodalformactividadhorario").modal("show");
  }

  recibirDatosActividadHorario(): void
  {
      this.formularioNormal();
      this.childactividadhorario.formularioNormal();
      $("#mymodalformactividadhorario").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}