import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TransportistaService } from 'src/app/venta/services/transportista.service';
import { TipoIdentificacionService } from 'src/app/venta/services/tipo-identificacion.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { SwalService } from 'src/app/shared/services/swal.service';
declare var $:any;

@Component({
  selector: 'app-transportista-form',
  templateUrl: './transportista-form.component.html',
  styleUrls: ['./transportista-form.component.css']
})
export class TransportistaFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cantidad_registros : number = 0;

  datosidentificacion : any;

  cod_transportista : string = "";
  cod_identificacion : string = "0";
  identificacion: string = "";
  cedula : string = "";
  apellido : string = "";
  nombre : string = "";
  convencional : string = "";
  celular : string = "";
  correo : string = "";
  direccion : string = "";

  flagocultarboton : boolean = false;

  flagidentificacion : boolean = false;
  flagcedula : boolean = false;
  flagapellido : boolean = false;
  /*
  flagnombre : boolean = false;
  flagconvencional : boolean = false;
  flagcelular : boolean = false;
  flagdireccion : boolean = false;
  */
  flagcorreo : boolean = false;
  flagtipotransportista : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";

  loadingform : boolean = false;

  flagocultarbotonagregar : boolean = false;

  lblcedula: string = "";
  lblapellido: string = "";
  lblnombre: string = "";

  constructor(private transportistaservice:TransportistaService, private toastr: ToastrService, private error:ErrorService, private tipoidentificacionservice:TipoIdentificacionService, private swalservice: SwalService) {
  }

  ngOnInit(): void {
    this.cargarCombos();
  }

  async cargarCombos()
  {
    await this.formularioNormal();
    this.cargarListas();
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
        await this.validarCedula();
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
      try
      {
        await this.validarCedulaActualizar();
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

    if(this.cod_identificacion=="0")
    {
      this.flagidentificacion=true;
      valor=true;
    }

    if(this.cedula.length==0)
    {
      this.flagcedula=true;
      valor=true;
    }

    if(this.apellido.length==0)
    {
      this.flagapellido = true;
      valor=true;
    }

    /*
    if(this.nombre.length==0)
    {
      this.flagnombre = true;
      valor=true;
    }

    if(this.convencional.length==0)
    {
      this.flagconvencional = true;
      valor=true;
    }

    if(this.celular.length==0)
    {
      this.flagcelular = true;
      valor=true;
    }
    */

    if(this.correo.length==0)
    {
      this.flagcorreo = true;
      valor=true;
    }

    /*
    if(this.direccion.length==0)
    {
      this.flagdireccion = true;
      valor=true;
    }
    */
    return valor;
  }

  flagNormal()
  {
    this.flagidentificacion = false;
    this.flagcedula = false;
    this.flagapellido = false;
    /*
    this.flagnombre = false;
    this.flagconvencional = false;
    this.flagcelular = false;
    this.flagdireccion = false;
    */
    this.flagcorreo = false;
    this.flagtipotransportista=false;
  }
  
  changeIdentificacion(event: any): void {
    const elemento = event.target.value;
    this.cod_identificacion = elemento;
    if(this.cod_identificacion=="04")
    {
      this.lblcedula = "Ruc:";
      this.lblapellido = "Razón Social:";
      this.lblnombre = "Nombre Comercial:";
    }
    else
    {
      if(this.cod_identificacion=="06")
      {
        this.lblcedula = "Pasaporte:";
      }
      else
      {
        if(this.cod_identificacion=="09")
        {
          this.lblcedula = "Placa:";
        }
        else
        {
          if(this.cod_identificacion=="08")
          {
            this.lblcedula = "Código:";
          }
          else
          {
            this.lblcedula = "Cédula:";
          }
        }
      }
      this.lblapellido = "Apellido:";
      this.lblnombre = "Nombre:";
    }
  }

  async validarCedula()
  {
    this.flagcedula = false;
    
    let data: any = await lastValueFrom(this.transportistaservice.validarCedula(this.cod_identificacion, this.cedula)); 

    if (data.estado == true)
    { 
        await this.buscar();
    }
    else
    {
      this.flagcedula = true;
      const ok = await this.swalservice.alertError("Identificación Incorrecta, ingrese una identificación válida por favor");
    } 
  }

  async validarCedulaActualizar()
  {
    this.flagcedula = false;

    let data: any = await lastValueFrom(this.transportistaservice.validarCedula(this.cod_identificacion, this.cedula)); 

    if (data.estado == true)
    { 
        if(this.cedula==this.codigotemporal)
        {
          await this.actualizar();
        }
        else
        {
          await this.validarCedula();//this.buscar();
        }
    }
    else
    {
      this.flagcedula = true;
      const ok = await this.swalservice.alertError("Identificación Incorrecta, ingrese una identificación válida por favor");
    }
  }

  async clickAgregar()
  {
    try
    {
        this.flagcedula = false;
        this.swalservice.iniciarLoading("Verificando...");
        if (this.cod_identificacion == "04" || this.cod_identificacion == "05")
        {
          this.cedula = this.cedula.replace(/[^0-9]/g, '');
        }

        let data: any = await lastValueFrom(this.transportistaservice.validarCedula(this.cod_identificacion, this.cedula)); 

        if (data.estado == true)
        { 
          const parametrosenviar = {
            'cod_transportista' : this.cod_transportista,
            'cod_identificacion' : this.cod_identificacion,
            'identificacion' : this.identificacion,
            'cedula' : this.cedula,
            'apellido' : this.apellido,
            'nombre' : this.nombre,
            'convencional' : this.convencional,
            'celular' : this.celular,
            'correo' : this.correo,
            'direccion' : this.direccion,
            'cod_tipo_transportista' : 1,
            'estado' : 1
          };

          this.datosenvio.emit(parametrosenviar);
          this.toastr.success("Transportista Agregado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          const ok = await this.swalservice.alertError("Identificación Incorrecta, ingrese una identificación válida por favor");
          this.flagcedula = true;
        }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    } 
  }
 
  async buscar()
  {
    let data: any = await lastValueFrom(this.transportistaservice.buscar(this.cedula));

    if (data.cod_transportista == false)//No existe
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
      const ok = await this.swalservice.alertAviso("Transportista se encuentra registrado, vuelva a intertarlo por favor");
    }
  }
  
  async guardar()
  {
    const parametros = {
      'cod_transportista' : this.cod_transportista,
      'cod_identificacion' : this.cod_identificacion,
      'cedula' : this.cedula,
      'apellido' : this.apellido,
      'nombre' : this.nombre,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      'cod_tipo_transportista' : 1
    };

    let data: any = await lastValueFrom(this.transportistaservice.guardar(parametros));

    if (data.estado == true)
    {
      const parametrosenviar = {
        'cod_transportista' : this.cod_transportista,
        'cod_identificacion' : this.cod_identificacion,
        'cedula' : this.cedula,
        'apellido' : this.apellido,
        'nombre' : this.nombre,
        'convencional' : this.convencional,
        'celular' : this.celular,
        'correo' : this.correo,
        'direccion' : this.direccion,
        'cod_tipo_transportista' : 1,
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
      'cod_transportista' : this.cod_transportista,
      'cod_identificacion' : this.cod_identificacion,
      'cedula' : this.cedula,
      'apellido' : this.apellido,
      'nombre' : this.nombre,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      'cod_tipo_transportista' : 1
    };

    let data: any = await lastValueFrom(this.transportistaservice.actualizar(parametros));

    if (data.estado == true)
    {
      const parametrosenviar = {
        'cod_transportista' : this.cod_transportista,
        'cod_identificacion' : this.cod_identificacion,
        'cedula' : this.cedula,
        'apellido' : this.apellido,
        'nombre' : this.nombre,
        'convencional' : this.convencional,
        'celular' : this.celular,
        'correo' : this.correo,
        'direccion' : this.direccion,
        'cod_tipo_transportista' : 1,
        'estado' : 1
      };

      this.datosenvio.emit(parametrosenviar);
      
      this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      const ok = await this.swalservice.alertError("Registro no se pudo Actualizar, vuelva a intertarlo por favor");
    }
    

  }
  
  formularioNormal()
  {
    this.cod_transportista = moment().unix().toString();
    this.cod_identificacion = "05";
    this.identificacion = "CEDULA";
    this.cedula = "";
    this.apellido = "";
    this.nombre = "";
    this.convencional = "";
    this.celular = "";
    this.correo = "";
    this.direccion = "";
    this.lblcedula = "Cédula:";
    this.lblapellido = "Apellido:";
    this.lblnombre = "Nombre:";
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.codigotemporal="";
    
    

    this.ban=0;

    this.flagocultarbotonagregar = false;
  }

  cargarListas()
  {
    this.listarIdentificacion();
  }

  listarIdentificacion()
  {
    this.loadingform = true;
    

    this.tipoidentificacionservice.listar().subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datosidentificacion = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }

  async clickBuscarTransportista()
  {
    try
    {
      this.swalservice.iniciarLoading("Vertificando...");
      if(this.cedula.length>0)
      {
        if(this.cod_identificacion=="05")
        {
          if(this.cedula.length==10 && /^[0-9]+$/.test(this.cedula))
          {
            await this.buscarTransportista();
          }
          else
          {
            const ok = await this.swalservice.alertAviso("Ingrese 10 digitos numéricos para realizar búsqueda");
          }
        }
        else
        {
          if(this.cod_identificacion=="04")
          {
            if(this.cedula.length==13 && /^[0-9]+$/.test(this.cedula))
            {
              await this.buscarTransportista();
            }
            else
            {
              const ok = await this.swalservice.alertAviso("Ingrese 13 digitos numéricos para realizar búsqueda");
            }
          }
          else
          {
            await this.buscarTransportista();
          }
        }
      }
      else
      {
        const ok = await this.swalservice.alertAviso("Ingrese numeración para realizar búsqueda");
      }
    
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    } 
  }

  async buscarTransportista()
  {
      let data: any = await lastValueFrom(this.transportistaservice.buscar(this.cedula));
    
      if (data.cod_transportista == false)//No existe
      {
        this.toastr.info("Transportista no se encuentra registrado", "INFORMACIÓN DEL SISTEMA");
        this.cod_transportista = moment().unix().toString();
        this.apellido = "";
        this.nombre = "";
        this.convencional = "";
        this.celular = "";
        this.correo = "";
        this.direccion = "";
      
    
        this.flagocultarboton = false;
        this.flagocultarbotonagregar = false;
    
        this.flagNormal();
      
        this.codigotemporal="";
        
        this.ban=0;
      }
      else
      {
        
        this.toastr.success("Transportista se encuentra registrado", "INFORMACIÓN DEL SISTEMA");
        this.cod_transportista = data.cod_transportista;
        this.cod_identificacion = data.cod_identificacion;
        this.identificacion = data.identificacion;
        this.cedula = data.cedula;
        this.apellido = data.apellido;
        this.nombre = data.nombre;
        this.convencional = data.convencional;
        this.celular = data.celular;
        this.correo = data.correo;
        this.direccion = data.direccion;

        this.flagocultarboton = true;
        this.flagocultarbotonagregar = true;
        
        this.flagNormal();
      
        this.codigotemporal=this.cedula;
        
        this.ban=1;
        
        
          
      }
    
  }

  buscarTransportistaNormal()
  {
    this.loadingform = true;
    this.transportistaservice.buscar(this.cedula).subscribe( (data : any) =>
    {
      this.loadingform = false;

      if (data.cod_transportista == false)
      {
        this.toastr.error("Transportista no se encontró, error inesperado intente nuevamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_transportista = data.cod_transportista;
        this.cod_identificacion = data.cod_identificacion;
        this.identificacion = data.identificacion;
        this.cedula = data.cedula;
        this.apellido = data.apellido;
        this.nombre = data.nombre;
        this.convencional = data.convencional;
        this.celular = data.celular;
        this.correo = data.correo;
        this.direccion = data.direccion;

        this.flagocultarboton = true;
        this.flagocultarbotonagregar = true;
        
        this.flagNormal();
      
        this.codigotemporal=this.cedula;
        
        this.ban=1;
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
  }

  clickLimpiar()
  {
    this.formularioNormal();
  }


}