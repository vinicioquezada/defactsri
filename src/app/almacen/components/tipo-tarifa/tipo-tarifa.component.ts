import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { TipoTarifaService } from '../../services/tipo-tarifa.service';
import { TipoTarifaFormComponent } from './tipo-tarifa-form/tipo-tarifa-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipo-tarifa',
  templateUrl: './tipo-tarifa.component.html',
  styleUrls: ['./tipo-tarifa.component.css']
})
export class TipoTarifaComponent implements OnInit {
  @ViewChild(TipoTarifaFormComponent) childtipotarifa!: TipoTarifaFormComponent;
  datos : any;
  filterpost = "";

  cod_tipo_tarifa : string = "";
  tipo_tarifa : string = "";

  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private tipotarifasservice: TipoTarifaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_tipo_tarifa: string, tipo_tarifa: string)
  {
    this.cod_tipo_tarifa = cod_tipo_tarifa;
    this.tipo_tarifa = tipo_tarifa;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.tipo_tarifa,
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
    this.childtipotarifa.formularioNormal();
  }

  editar(item : any)
  {
      this.childtipotarifa.nombreformulario = "EDITAR";
      this.childtipotarifa.editar(item);
      $("#mymodalformtipotarifa").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_tipo_tarifa' : this.cod_tipo_tarifa,
          'estado' : 0,
        };
    

        let data: any = await lastValueFrom(this.tipotarifasservice.eliminar(parametros));
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
    this.cod_tipo_tarifa=""
    this.tipo_tarifa="";
    this.filterpost="";
    
    try
    {
      this.loadinglistado = true;
      await this.listarTiposTarifas();
      this.childtipotarifa.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarTiposTarifas()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.tipotarifasservice.listarTiposTarifas());
    this.datos = data;
  }

  clickNuevaTipoTarifa()
  {
    this.childtipotarifa.nombreformulario = "NUEVA";
    this.childtipotarifa.formularioNormal();
    $("#mymodalformtipotarifa").modal("show");
  }

  recibirDatosTipoTarifa(): void
  {
      this.formularioNormal();
      this.childtipotarifa.formularioNormal();
      $("#mymodalformtipotarifa").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}