import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CuponService } from 'src/app/gym/services/cupon.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-cupon-form',
  templateUrl: './cupon-form.component.html',
  styleUrls: ['./cupon-form.component.css']
})
export class CuponFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cod_cupon : string = "";
  cupon : string = "";
  fecha_sorteo : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagcupon : boolean = false;
  flagfechasorteo : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private cuponservice: CuponService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

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
        if(this.cupon==this.codigotemporal)
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

    if(this.cupon.length==0)
    {
      this.flagcupon=true;
      valor=true;
    }

    if(this.fecha_sorteo.length==0)
    {
      this.flagfechasorteo=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagcupon = false;
    this.flagfechasorteo = false;
  }

  async buscar()
  {
      let data: any = await lastValueFrom(this.cuponservice.buscar(this.cupon));

      if (data.cod_cupon == false)//No existe
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
          const ok = await this.swalservice.alertAviso("Cupon ya se encuentra registrado");
      }
  }


  async guardar()
  {
      const parametros = {
        'cod_cupon' : this.cod_cupon,
        'cupon' :this.cupon,
        'fecha_sorteo' : this.fecha_sorteo,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.cuponservice.guardar(parametros));

      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_cupon' : this.cod_cupon,
          'cupon' : this.cupon,
          'fecha_sorteo' : this.fecha_sorteo,
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
        'cod_cupon' : this.cod_cupon,
        'cupon' :this.cupon,
        'fecha_sorteo' : this.fecha_sorteo,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.cuponservice.actualizar(parametros));

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
      this.cod_cupon = item.cod_cupon;
      this.cupon = item.cupon;
      this.fecha_sorteo = item.fecha_sorteo;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.cupon;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_cupon=moment().unix().toString();
    this.cupon="";
    this.fecha_sorteo="";
    this.observacion="";
    this.swalservice.close();
    this.flagocultarboton = false;
    this.flagNormal();
    this.codigotemporal="";
    this.ban=0;
  }

}