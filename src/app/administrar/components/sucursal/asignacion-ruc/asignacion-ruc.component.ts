import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';

@Component({
  selector: 'app-asignacion-ruc',
  templateUrl: './asignacion-ruc.component.html',
  styleUrls: ['./asignacion-ruc.component.css']
})
export class AsignacionRucComponent implements OnInit {

  cod_sucursal: string = "";
  sucursal: string = "";

  cod_ruc: string = "1";
  datosruc : any = [];
  datosrucempresa : any = [];

  constructor(private toastr: ToastrService, private error:ErrorService, private rucempresaservice:RucEmpresaService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.listarRucActivos();
  }

  changeEmpresa(event: any): void {
      const elemento = event.target.value;
      this.cod_ruc = elemento;
  }

 async listarRucActivos(): Promise<void> {
    this.swalservice.iniciarLoading("Cargando...");

    try {
      const data = await lastValueFrom(this.rucempresaservice.listarRucActivos());
      this.datosruc = data;
     
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.swalservice.close();
    }
  }

  async listarRucEmpresas(): Promise<void> {
    this.swalservice.iniciarLoading("Cargando...");

    try {
      const data = await lastValueFrom(this.rucempresaservice.listarRucEmpresas(this.cod_sucursal));
      console.log(data);
      this.datosrucempresa = data;
     
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.swalservice.close();
    }
  }

  guardarAsignacion()
  {
    this.swalservice.iniciarLoading("Almacenando...");

    const parametros = {
      'cod_sucursal' : this.cod_sucursal,
      'cod_ruc' : this.cod_ruc
    };
    
    this.rucempresaservice.guardarAsignacion(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.listarRucEmpresas();
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

  eliminarAsignacion(id_sucursal_ruc_empresa: number)
  {
    this.swalservice.iniciarLoading("Eliminando...");

    const parametros = {
      'id_sucursal_ruc_empresa' : id_sucursal_ruc_empresa
    };
    
    this.rucempresaservice.eliminarAsignacion(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Eliminado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.listarRucEmpresas();
      }
      else
      {
        this.toastr.error("Registro no se pudo Eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

  asignarRucFijo(id_sucursal_ruc_empresa: number, cod_ruc: number)
  {
    this.swalservice.iniciarLoading("Almacenando...");

    const parametros = {
      'id_sucursal_ruc_empresa' : id_sucursal_ruc_empresa,
      'cod_sucursal' : this.cod_sucursal,
      'cod_ruc' : cod_ruc
    };
    
    this.rucempresaservice.asignarRucFijo(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Asignado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.listarRucEmpresas();
      }
      else
      {
        this.toastr.error("Registro no se pudo Asignado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

}
