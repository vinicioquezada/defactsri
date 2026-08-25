import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ReservasService } from '../../services/reservas.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { Router, NavigationEnd, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/services/config.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-departamentos',
  templateUrl: './explorador-departamentos.component.html',
  styleUrls: ['./explorador-departamentos.component.css']
})
export class ExploradorDepartamentosComponent implements OnInit {
  multisucursal : string = "0";
  cod_sucursal : string = "";

  cod_reserva : string = "";

  cod_producto : string = "";
  descripcion : string = "";
  persona : string = "";
  precio_venta : string = "";
  estado_reserva : number = 0;
  estado_pago : number = 0;
  cod_cliente : string = "";
  codigo : string = "";

  datos : any;
  datossucursal : any;

  fechadesdeactual : string = "";

  fechadesde : string = "";
  hora_actual : string = "";
  hora_desde : string = "";
  
  loadinglistado : boolean = false;
  

  constructor(private viewportScroller: ViewportScroller, private router : Router, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private reservasservice:ReservasService, private usersession: UserSessionService, private configService: ConfigService) {

    
    this.router.events.pipe(filter(e => e instanceof Scroll)).subscribe((e: any) => {
      setTimeout(() => {
        if (e.position) {
          this.viewportScroller.scrollToPosition(e.position);
        } else if (e.anchor) {
          this.viewportScroller.scrollToAnchor(e.anchor);
        } else {
          //this.viewportScroller.scrollToPosition([0, 0]);
        }
      }, 100);
    });
    //this.router.onSameUrlNavigation = 'reload';
  }

  deshacer()
  {
    this.formularioNormal();
  }

  clickdescargarcontrato()
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/hotel/contrato?codreserva=" + this.cod_reserva, "", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
  }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.listarSucursales();
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
  }

  formularioNormal()
  {
    this.datos = [];

    this.fechadesdeactual = moment().format('YYYY-MM-DD');
    this.hora_actual = moment().format('HH:mm');
    
    this.fechadesde = moment().format('YYYY-MM-DD');
    this.hora_desde = moment().format('HH:mm');
    this.buscar();
  }

  listarSucursales()
  {    
    this.loadinglistado = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.formularioNormal();
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  buscaractual()
  {
    this.datos = [];
    this.loadinglistado = true;
    

    this.reservasservice.listarReservas(this.fechadesdeactual, this.cod_sucursal, this.hora_actual).subscribe( (data : any) =>
    {
      //console.log(data);
      this.datos = data;
      this.loadinglistado = false;
        
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  buscar()
  {
    this.datos = [];
    this.loadinglistado = true;
    this.reservasservice.listarReservas(this.fechadesde, this.cod_sucursal, this.hora_desde).subscribe( (data : any) =>
    {
      //console.log(data);
      this.datos = data;
      this.loadinglistado = false;
        
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  cambiarcolor(estado_reserva : number, estado_pago : number)
  {
    //alert(estado_pago);ff
    if(estado_reserva==1 && estado_pago==0)//Reservado y por pagar
    {
      return "bg-warning";
    }
    else
    {
      if(estado_reserva==1 && estado_pago==1)//Reservado y pagado
      {
        return "bg-cyan";
      }
      else
      {
        if(estado_reserva==0 && estado_pago==0)//Ocupada y por pagar
        {
          return "bg-danger";
        }
        else
        {
          if(estado_reserva==0 && estado_pago==1)//Ocupada y pagado
          {
            return "bg-success";
          }
          else
          {
            return "bg-primary";
          }
        }
      }
      /*
      if(estado_reserva==1)
      {
        return "bg-success";
      }
      else
      {
        if(estado_reserva==2)
        {
          return "bg-danger";
        }
        else
        {
          return "bg-primary";
        }
      }
      */
    }
  }

  procesarestadoreserva(estado_reserva : number)
  {
    //0 Reservado
    if(estado_reserva==0)
    {
      return 0;//Reservado
    }
    else
    {
      if(estado_reserva==1)
      {
        return 1;//Cancelado
      }
      else
      {
        if(estado_reserva==2)
        {
          return 2;//Ocupado
        }
        else
        {
            return 3;//Null Disponible
        }
      }
    }
  }

  clicknuevareserva()
  {
    this.router.navigate(["/menuhotel/reservas", "guardar", this.cod_producto, 0]);
  }

  clickmodificarreserva()
  {
    this.router.navigate(["/menuhotel/reservas", "modificar", this.cod_producto, this.cod_reserva]);
  }

  clickasignacion()
  {
    let cod_reserva;
    if(this.cod_reserva==null)
    {
      cod_reserva=0;
    }
    else
    {
      cod_reserva = this.cod_reserva;
    }
    this.router.navigate(["/menuhotel/asignacion","guardar", this.cod_producto, cod_reserva]);
  }

  clickbuscarasignacion()
  {
    this.router.navigate(["/menuhotel/asignacion","buscarguardar", this.cod_producto, this.cod_reserva]);
  }

  clickmodificarasignacion()
  {
    this.router.navigate(["/menuhotel/asignacion", "modificar", this.cod_producto, this.cod_reserva]);
  }

  clickcontrato()
  {
    $("#mymodalcontrato").modal("show");
  }

  clickopciones(cod_producto : string, descripcion : string, persona : string, precio_venta : string, estado_reserva : number, cod_reserva : string, estado_pago : number, cod_cliente : string, codigo : string)
  {
    this.cod_producto = cod_producto;
    this.descripcion = descripcion;
    this.persona = persona;
    this.precio_venta = precio_venta;
    this.estado_reserva = estado_reserva;
    this.cod_reserva = cod_reserva;
    this.estado_pago = estado_pago;
    this.cod_cliente = cod_cliente;
    this.codigo = codigo;
    $("#mymodalopciones").modal("show");
  }

  clickexploradorpagos()
  {
    this.router.navigate(["/menuhotel/exploradorpagos", this.cod_reserva, this.cod_cliente, this.codigo, this.descripcion]);
  }

  
  upload(ev){
    /*
    this.loading = true;
    

    let img:any = ev.target;
    if(img.files.length > 0){
      let form = new FormData();
      form.append("userfile",img.files[0]);
      form.append("fotoanterior", this.usersession.getConfiguracion("foto"));
      this.perfilservice.subirImagen(form).subscribe( (data : any) => {

          this.loading = false;
          

          if(data.estado==true){
            localStorage.setItem("foto", data.nombrearchivo);
            window.location.href="/perfil";
          }
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
          
      });

    }
  */
  }

}