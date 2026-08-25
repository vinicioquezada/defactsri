import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SocioService } from 'src/app/gym/services/socio.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SocioFormComponent } from '../socio/socio-form/socio-form.component';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { FotoFormComponent } from './foto-form/foto-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';
import { MonitorLocalSecundarioService } from '../../services/monitor-local-secundario.service';
import { MonitorService } from '../../services/monitor.service';
import { MonitorLocalService } from '../../services/monitor-local.service';

@Component({
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css']
})
export class SocioComponent implements OnInit {
  @ViewChild(SocioFormComponent) childsocioform: SocioFormComponent;
  @ViewChild(FotoFormComponent) childfotoform: FotoFormComponent;
  
  page = 1;
  count = 0;
  pagesize = 5;

  loadinglistado : boolean = false;

  datos : any;
  filterpost = "";
  cantidad_registros : number = 0;

  cod_sucursal : string = "";
  cliente: string= "";
  urlfoto : string = "";

  compartido_extension: string = "";
  monitor_actividades: string = "";

  multisucursal : string = "0";

  constructor(private sociossrvice: SocioService, private usersession: UserSessionService, private toastr: ToastrService, private error:ErrorService, private configService: ConfigService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.compartido_extension = this.usersession.getConfiguracion("compartido_extension");
    this.monitor_actividades = this.usersession.getConfiguracion("monitor_actividades");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");

    this.listarUsuariosGymRegistrados();
  }

  formularioNormal()
  {
    this.listarUsuariosGymRegistrados();
  }

  clickNuevoSocio()
  {
    this.childsocioform.nombreformulario = "NUEVO";
    this.childsocioform.formularioNormal();
    $("#mymodalnuevosocio").modal("show");
  }

  recibirDatosSocio(): void
  {
      this.formularioNormal();
      this.childsocioform.formularioNormal();
      $("#mymodalnuevosocio").modal("hide");
  }

  clickRefrescar()
  {
    this.listarUsuariosGymRegistrados();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  listarUsuariosGymRegistrados()
  {
    this.page = 1;
    this.filterpost = "";
    
    this.loadinglistado = true;

    this.sociossrvice.listarUsuariosGymRegistrados(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
      this.cantidad_registros = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  listarUsuariosGym()
  {
    this.page = 1;
    this.filterpost = "";
    
    this.loadinglistado = true;

    this.sociossrvice.listarUsuariosGym().subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
      this.cantidad_registros = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  editar(item: any)
  {
      this.childsocioform.nombreformulario = "EDITAR";
      this.childsocioform.editar(item);
      $("#mymodalnuevosocio").modal("show");
  }
  

  verFoto(cod_cliente: number, cliente: string)
  {
    this.cliente = cliente;
    this.urlfoto = this.configService.settings.baseUrl + "/gym/imagen_usuario/" + cod_cliente + ".jpg?t=" + new Date().getTime();
    $("#mymodalFoto").modal("show");
  }

  handlePageChange(event: number): void
  {
    this.page = event;
  }

  async clickEmparejar(item: any)
  {
    this.childfotoform.clickEmparejar(item);
  }

  clickEditardatosfoto(item: any)
  {
    this.childfotoform.clickEditardatosfoto(item);
  }

  recibirDatosFotoForm(datosrecibidosfotoform: any)
  {
    this.datos = this.datos.map(item => {
      if (item.cod_cliente == datosrecibidosfotoform.cod_cliente) {
        return {
          ...item,
          estado_emparejamiento: 1
        };
      }
      return item;
    });
  }

  async clickEliminar(item: any)
  {    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO SOCIO "  + item.nombre + " " + item.apellido,
          text: "Confirmar para eliminar el registro seleccionado, el registro del socio se eliminará por completo en el sistema y biométrico",
          icon: "info",
          confirmText: "Sí, Eliminar",
          cancelText: "No, Cerrar"
        });

        if (ok) {
          await this.procesoEliminarFoto(item.cod_cliente);
        }
  }

  

  async procesoEliminarFoto(cod_cliente: number)
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
      const databuscarusuariolocal = await this.buscarUsuarioGymCodigoSucursal(String(cod_cliente));
      if (databuscarusuariolocal.estado)
      {
        //let cod_cliente = cod_cliente;
       let numero_usuario = databuscarusuariolocal.numero_usuario;

        const datadispositivo1 = await this.childfotoform.eliminarRostroUsuarioDispositivo(numero_usuario);//Local
        if (datadispositivo1.estado)
        {
          if(this.compartido_extension=="1")
          {
            const datadispositivo2 = await this.childfotoform.eliminarRostroUsuarioDispositivoSecundario(numero_usuario);//Local
            if (datadispositivo2.estado)
            {
              await this.childfotoform.eliminarImagenNube();
              await this.childfotoform.eliminarImagenLocal();//Local
            }
          }
          else
          {
            if(this.monitor_actividades=="1")
            {
              this.childfotoform.eliminarFotoUsuarioActividadesDispositivo();
            }

            await this.childfotoform.eliminarImagenNube();
            await this.childfotoform.eliminarImagenLocal();//Local
          }

          await this.eliminar(String(cod_cliente));
        }
   
      }
      else
      {
        const ok = await this.swalservice.alertAviso("No se puede eliminar el socio, porque no se encuentra registrado en el dispositivo, solo se puede eliminar a los socios que corresponda en la sucursal");
      }
    } catch (e) {
        const ok = await this.swalservice.alertAviso("Foto de usuario no se pudo eliminar en el dispositivo");
    } finally {
      this.swalservice.close();
    }
  }

  

  


  async buscarUsuarioGymCodigoSucursal(cod_cliente: string)
  {
     try {
      const data: any = await lastValueFrom(this.sociossrvice.buscarUsuarioGymCodigoSucursal(cod_cliente, this.cod_sucursal));
      
      if(data.cod_cliente!=false)
      {
        return {
          estado: true,
          numero_usuario: data.numero_usuario
        }
      }
      else
      {
        return {
          estado: false,
          numero_usuario: 0
        }
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Foto de usuario no se pudo eliminar en el dispositivo", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false,
        numero_usuario: 0
      }
      return data;
    }
  }

  async eliminar(cod_cliente: string)
  {

    try {

      const parametros = {
        'cod_cliente' : cod_cliente
      };

      const data: any = await lastValueFrom(this.sociossrvice.eliminar(parametros));
      
      if (data.estado == true)
      {
        
        this.formularioNormal();        

        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

    } catch (err: any) {
      this.toastr.error("Erroe en el servidor al eliminar el registro del usuario", "INFORMACIÓN DEL SISTEMA");
    }
  }
}