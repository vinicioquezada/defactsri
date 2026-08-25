import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { SucursalesService } from '../../services/sucursales.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { AccessService } from 'src/app/shared/services/access.service';
import { HeaderMenus } from 'src/app/shared/models/header-menus.dto';
import { Menu } from 'src/app/shared/models/Menu';
import { Router } from '@angular/router';
import { Privilegio } from 'src/app/shared/models/Privilegio';
import { StorageEncryptionService } from 'src/app/shared/services/storage-encryption.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  urllogo : string = "";
  datos : any;
  activo : boolean = true;
  datossucursal : any;
  loading : boolean = false;
  

  multisucursal : string = "";
  flagocultarsucursal : boolean = true;

  mensaje : string = "";

  passwordencriptado: string ="";

  //usuario : string = "admin";
  //password : string = "instituto555";
  usuario : string = "";
  password : string = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  urlproyecto: string = "";
  version: string = environment.version;

  constructor(private router : Router, private loginservice:LoginService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private accessservice: AccessService, private storageencryptionservice: StorageEncryptionService, private usersession: UserSessionService, private configService: ConfigService)
  {
    this.urllogo = this.configService.settings.baseUrl + "/images/logo.png";
  }

  ngOnInit(): void {
    this.flagocultarsucursal = true;
    this.activo = true;
    this.revisarConfiguracion();
  }

  verificarIngreso()
  {
    if(this.multisucursal=="0")
    {
      this.clickIngresar();
    }
  }

  clickIngresar()
  {
      if(this.cod_sucursal.length==0)
      {
        this.toastr.info("Debe seleccionar una empresa primero para iniciar sesión", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.loading = true;
        
        this.loginservice.acceder(this.usuario, this.password.trim(), this.cod_sucursal).subscribe( (data : any) =>
        {
          this.datos = data;
          this.loading = false;
          
          if(data.cod_empleado==false)
          {
            this.toastr.error("Usuario y Contraseña son incorrectos", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            if(data.estado_usuario!="HABILITADO")
            {
              this.toastr.error("Su cuenta de usuario esta desactivada, contáctese con el administrador del sistema", "INFORMACIÓN DEL SISTEMA");
            }
            else
            {
              const configuracion = {
                cod_proyecto: data.cod_proyecto,
                cod_sucursal: data.cod_sucursal,
                rol: data.rol,
                multisucursal: this.multisucursal,
                numeracion_automatica: data.numeracion_automatica,
                usuario: data.apellido + " " + data.nombre,
                electronico: data.electronico,
                defecto_venta: data.defecto_venta,
                precios_completos: data.precios_completos,
                codigo_automatico_producto: data.codigo_automatico_producto,
                comision_venta: data.comision_venta,
                rrpp: data.rrpp,
                foto: data.foto,
                tarifas: data.tarifas,
                tarifasenlista: data.tarifasenlista,
                kardex: data.kardex,
                iva: data.iva,
                codigo_iva: data.codigo_iva,
                afiliacion_cliente: data.afiliacion_cliente,
                numero_empleado: data.numero_empleado,
                control_estricto_inventario: data.control_estricto_inventario,
                control_estricto_movimiento: data.control_estricto_movimiento,
                recaudador: data.recaudador,
                modificacion_supervisor: data.modificacion_supervisor,
                firmasruc: data.firmasruc,
                sucursal: data.sucursal,
                cargartarifasconfigurables: data.cargartarifasconfigurables,
                codigosproducto: data.codigosproducto,
                ruc_usuario: data.ruc_usuario,
                cod_ruc: data.cod_ruc,
                razonsocial: data.razonsocial,
                nombrecomercial: data.nombrecomercial,
                direccion_establecimiento: data.direccion_establecimiento,
                compartido_extension: data.compartido_extension,
                monitor_actividades: data.monitor_actividades,
                asistencia_gimnasio: data.asistencia_gimnasio,
                log_producto: data.log_producto,
                status: data.status
              };
              
              this.storageencryptionservice.setEncryptedItem("cu1", configuracion);
              
              localStorage.setItem("token", data.token);
              localStorage.setItem("sessionstate", "true");
              
              let menu = [];
              let privilegios = [];
              data.funcionalidades.forEach(
                element => {
                    if(element.cod_menu == 1)
                    {
                      privilegios.push(new Privilegio(element.cod_sub_menu, element.verificar));
                    }
                    else
                    {
                      menu.push(new Menu(element.cod_sub_menu, element.verificar));
                    }
                });
              
              this.storageencryptionservice.setEncryptedItem("ma001", menu);
              this.storageencryptionservice.setEncryptedItem("cpf", privilegios);

              localStorage.removeItem('logout-event');
              let decrytedconfiguracion = this.storageencryptionservice.getDecryptedItem("cu1");
              this.usersession.setAllConfiguracion(decrytedconfiguracion);
              let decrytedmenu = this.storageencryptionservice.getDecryptedItem("ma001");
              this.usersession.setAllMenu(decrytedmenu);
              let decrytedprivilegios = this.storageencryptionservice.getDecryptedItem("cpf");
              this.usersession.setAllPrivilegios(decrytedprivilegios);

              
              const headerInfo: HeaderMenus = {
                estadologin: false,
                estadomenu: true,
              };
              this.accessservice.headerManagement.next(headerInfo);
              this.router.navigate(["/", ""]);
              
            }
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
        });
      }
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
  }

  verificarplan()
  {    
    this.loginservice.verificarPlan(this.urlproyecto).subscribe( (resultado : any) =>
    {
      let estado_valor = resultado[0].estado_valor;
			let dias_restantes = resultado[0].dias_restantes;
			let fecha_fin_plan =resultado[0].fecha_fin_plan;

			if(estado_valor==0)//No tiene un plan activo
			{
        this.activo = true;
			}
      else
      {
        if(estado_valor=="N")
        {
          this.mensaje = "<div class='alert alert-danger alert-dismissible'>";
          this.mensaje += "<h5><i class='icon fas fa-exclamation-triangle'></i> Información de Proyecto</h5>";
          this.mensaje += "Estimado usuario su proyecto no tiene registro de proyecto por lo que debe contactarse con el proveedor del sistema";
          this.mensaje +="</div>";
          this.activo = false;
        }
        else
        {
          if(estado_valor==1)//Caducado
          {
            if(dias_restantes<=2)
            {
              let fecha = this.formatearfecha(fecha_fin_plan);
  
              this.mensaje = "<div class='alert alert-danger alert-dismissible'>";
              this.mensaje += "<h5><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h5>";
              this.mensaje += "Estimado usuario su plan a terminado el <b>" + fecha + "</b>, debe renovar el plan para poder utilizar las funcionalidades de la aplicacion";
              this.mensaje +="</div>";
              this.activo = true;
            }
            else
            {
              let fecha = this.formatearfecha(fecha_fin_plan);
  
              this.mensaje = "<div class='alert alert-danger alert-dismissible'>";
              this.mensaje += "<h5><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h5>";
              this.mensaje += "Estimado usuario su plan a terminado el <b>" + fecha + "</b>, no cuenta con un plan activo actualmente";
              this.mensaje +="</div>";
              this.activo = false;
            }
          }
          else
          {
            if(dias_restantes<=2)
            {
              let fecha = this.formatearfecha(fecha_fin_plan);
              this.mensaje = "<div class='alert alert-warning alert-dismissible'>";
              this.mensaje += "<h5><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h5>";
              this.mensaje += "Estimado usuario su plan esta a punto de terminar, debe renovar el plan hasta el <b>" + fecha + "</b>";
              this.mensaje +="</div>";
              this.activo = true;
            }
            else
            {
              if(dias_restantes<=7)
              {
                let fecha = this.formatearfecha(fecha_fin_plan);
                this.mensaje = "<div class='alert alert-info alert-dismissible'>";
                this.mensaje += "<h5><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h5>";
                this.mensaje += "Estimado usuario su plan esta por terminar, debe renovar el plan hasta el <b>" + fecha + "</b>";
                this.mensaje +="</div>";
                this.activo = true;
              }
            }
            
          }
        }
      }
    }, err => {
      //this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  revisarConfiguracion()
  {    
    this.loading = true;
    this.sucursalesservice.revisarConfiguracion().subscribe( (data : any) =>
    {
      this.urlproyecto = data[0].urlproyecto;
      if(data[0].multisucursal==0)
      {
        this.multisucursal = "0";
        this.flagocultarsucursal = true;
      }
      else
      {
        this.multisucursal = "1";
        this.flagocultarsucursal = false;
      }

      this.verificarplan();

      this.listarsucursales();
      this.loading = false;
      
    }, err => {
      this.toastr.error("Vuelva a intentarlo por Favor F5 :" + this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  listarsucursales()
  {    
    this.loading = true;
    

    this.sucursalesservice.listarsucursaleslogin().subscribe( (data : any) =>
    {
      if(this.multisucursal=="0")
      {
        this.cod_sucursal = data[0].cod_sucursal;
      }
      
      this.datossucursal = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  formatearfecha(fecha)
  {
    let arreglo = fecha.split("-");
    let fecha_actual = arreglo[0] + "/" + arreglo[1] + "/" + arreglo[2];

    let fecha_actual1 = new Date(fecha_actual);
    let dia_actual = fecha_actual1.getDate();
    let mes_nombre = Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha_actual1);
    let anio_actual = fecha_actual1.getFullYear();
    return dia_actual + " de " + mes_nombre + " del " + anio_actual;
  }

}