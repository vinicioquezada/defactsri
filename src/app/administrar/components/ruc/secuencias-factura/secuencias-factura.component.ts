import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';

@Component({
  selector: 'app-secuencias-factura',
  templateUrl: './secuencias-factura.component.html',
  styleUrls: ['./secuencias-factura.component.css']
})
export class SecuenciasFacturaComponent implements OnInit {
  cod_ruc: string = "";
  empresa: string = "";
  serieestab: string = "";
  ptoemi: string = ""; 

  datossecuenciasfactura: any = [];

  constructor(private toastr: ToastrService, private error:ErrorService, private rucempresaservice:RucEmpresaService, private swalservice: SwalService) { }

  ngOnInit(): void {

  }

  async listarSecuenciasFacturas(): Promise<void> {
    this.swalservice.iniciarLoading("Cargando...");

    try {
      const data = await lastValueFrom(this.rucempresaservice.listarSecuenciasFacturas(this.serieestab, this.ptoemi, this.cod_ruc));
      this.datossecuenciasfactura = data;
     
    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      throw err;
    } finally {
      this.swalservice.close();
    }
  }

  async clickGenerarSecuencias()
  {
    const ok = await this.swalservice.alertConfirmRequerido({
      title: "Control del Sistema",
      text: "¿Está seguro de generar secuencias factura?",
      icon: "info",
      confirmText: "Sí, Generar",
      cancelText: "No, Cerrar"
    });

    if (ok) {
      this.generarSecuencias();
    }
  }

  generarSecuencias()
  {
    this.swalservice.iniciarLoading("Almacenando..."); 
    const parametros = {
      'cod_ruc' : this.cod_ruc,
      'serieestab' : this.padLeft(this.serieestab, 3),
      'ptoemi' : this.padLeft(this.ptoemi, 3)
    };

    this.rucempresaservice.generarSecuencias(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");

          this.listarSecuenciasFacturas();
        
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

  actualizarSecuanciaFactura(item: any)
  {
    this.swalservice.iniciarLoading("Almacenando...");

    const parametros = {
      'id_secuencias_factura' : item.id_secuencias_factura,
      'serieestab' : this.padLeft(this.serieestab, 3),
      'ptoemi' : this.padLeft(this.ptoemi, 3),
      'ultimo_numero' : item.ultimo_numero
    };

    this.rucempresaservice.actualizarSecuanciaFactura(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");

          this.listarSecuenciasFacturas();
        
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

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

}
