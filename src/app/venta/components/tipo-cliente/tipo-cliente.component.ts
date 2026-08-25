import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { TipoClienteService } from '../../services/tipo-cliente.service';
import { TipoClienteFormComponent } from './tipo-cliente-form/tipo-cliente-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipo-cliente',
  templateUrl: './tipo-cliente.component.html',
  styleUrls: ['./tipo-cliente.component.css']
})
export class TipoClienteComponent implements OnInit {
  @ViewChild(TipoClienteFormComponent) childtipocliente!: TipoClienteFormComponent;
  datos : any;
  filterpost = "";

  cod_tipo_cliente : string = "";
  tipo_cliente : string = "";
  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private tipoclientesservice: TipoClienteService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_tipo_cliente: string, tipo_cliente: string)
  {
    this.cod_tipo_cliente = cod_tipo_cliente;
    this.tipo_cliente = tipo_cliente;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.tipo_cliente,
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
    this.childtipocliente.formularioNormal();
  }

  editar(item : any)
  {
      this.childtipocliente.nombreformulario = "EDITAR";
      this.childtipocliente.editar(item);
      $("#mymodalformtipocliente").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_tipo_cliente' : this.cod_tipo_cliente,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.tipoclientesservice.eliminar(parametros));
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
    this.cod_tipo_cliente=""
    this.tipo_cliente="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.listarTiposClientes()
      this.childtipocliente.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarTiposClientes()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.tipoclientesservice.listar());
    this.datos = data;
  }

  clickNuevaTipoCliente()
  {
    this.childtipocliente.nombreformulario = "NUEVA";
    this.childtipocliente.formularioNormal();
    $("#mymodalformtipocliente").modal("show");
  }

  recibirDatosTipoCliente(): void
  {
      this.formularioNormal();
      this.childtipocliente.formularioNormal();
      $("#mymodalformtipocliente").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}