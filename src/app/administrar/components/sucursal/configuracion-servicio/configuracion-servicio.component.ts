import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';

@Component({
  selector: 'app-configuracion-servicio',
  templateUrl: './configuracion-servicio.component.html',
  styleUrls: ['./configuracion-servicio.component.css']
})
export class ConfiguracionServicioComponent implements OnInit {
  cod_proyecto: string = "";
  multisucursal: number = 0;
  urlproyecto: string = "";

  constructor(private swalservice: SwalService, private toastr: ToastrService, private sucursalesservice:SucursalesService, private error:ErrorService) { }

  ngOnInit(): void {
  }

  async buscarConfiguracion(): Promise<void> {
    this.swalservice.iniciarLoading("Cargando...");

    try {
      const data = await lastValueFrom(this.sucursalesservice.buscarConfiguracion());
      this.cod_proyecto = data[0].cod_proyecto;
      this.multisucursal = data[0].multisucursal;
      this.urlproyecto = data[0].urlproyecto;
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.swalservice.close();
    }
  }

  actualizar()
  {
    this.swalservice.iniciarLoading("Actualizando...");

    const parametros = {
      'cod_proyecto' : this.cod_proyecto,
      'multisucursal' :this.multisucursal,
      'urlproyecto' : this.urlproyecto
    };
    
    this.sucursalesservice.actualizarConfiguracion(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

  changeChkMultiSucursal()
  {
    if(this.multisucursal==1){
      this.multisucursal =0;
    }else{
      this.multisucursal = 1;
    }
  }

}
