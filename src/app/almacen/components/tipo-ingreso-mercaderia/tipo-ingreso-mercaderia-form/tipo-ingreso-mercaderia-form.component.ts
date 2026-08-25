import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TipoIngresoMercaderiaService } from 'src/app/almacen/services/tipo-ingreso-mercaderia.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipo-ingreso-mercaderia-form',
  templateUrl: './tipo-ingreso-mercaderia-form.component.html',
  styleUrls: ['./tipo-ingreso-mercaderia-form.component.css']
})
export class TipoIngresoMercaderiaFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cod_tipo_ingreso_mercaderia : string = "";
  tipo_ingreso_mercaderia : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagtipoingresomercaderia : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private tipoingresomercaderiaservice: TipoIngresoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

  ngOnInit(): void {
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
      try {
        if(this.tipo_ingreso_mercaderia==this.codigotemporal)
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

    this.flagtipoingresomercaderia = false;

    if(this.tipo_ingreso_mercaderia.length==0)
    {
      this.flagtipoingresomercaderia=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagtipoingresomercaderia = false;
  }

  async buscar()
  {
      let data: any = await lastValueFrom(this.tipoingresomercaderiaservice.buscar(this.tipo_ingreso_mercaderia));

      if (data.cod_tipo_ingreso_mercaderia == false)//No existe
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
          const ok = await this.swalservice.alertAviso("Tipo ingreso de mercaderia ya se encuentra registrado");
      }
  }


  async guardar()
  {
      const parametros = {
        'cod_tipo_ingreso_mercaderia' : this.cod_tipo_ingreso_mercaderia,
        'tipo_ingreso_mercaderia' :this.tipo_ingreso_mercaderia,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.tipoingresomercaderiaservice.guardar(parametros));

      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_tipo_ingreso_mercaderia' : this.cod_tipo_ingreso_mercaderia,
          'tipo_ingreso_mercaderia' : this.tipo_ingreso_mercaderia,
          'observacion' : this.observacion,
          'estado' : 1
        };
        this.datosenvio.emit(parametrosenviar);
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
        'cod_tipo_ingreso_mercaderia' : this.cod_tipo_ingreso_mercaderia,
        'tipo_ingreso_mercaderia' :this.tipo_ingreso_mercaderia,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.tipoingresomercaderiaservice.actualizar(parametros));

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

  editar(item :any)
  {      
      this.cod_tipo_ingreso_mercaderia = item.cod_tipo_ingreso_mercaderia;
      this.tipo_ingreso_mercaderia = item.tipo_ingreso_mercaderia;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.tipo_ingreso_mercaderia;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_tipo_ingreso_mercaderia=moment().unix().toString();
    this.tipo_ingreso_mercaderia="";
    this.observacion="";
    this.swalservice.close();
    this.flagocultarboton = false;
    this.flagNormal();
    this.codigotemporal="";
    this.ban=0;
  }

}