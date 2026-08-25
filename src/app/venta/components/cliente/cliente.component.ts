import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/venta/services/cliente.service';
import { AbonoVentaService } from 'src/app/cuentapc/services/abono-venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import * as moment from 'moment';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ObservacionClienteComponent } from 'src/app/shared/components/observacion-cliente/observacion-cliente.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  @ViewChild(ObservacionClienteComponent) childobservacioncliente!: ObservacionClienteComponent;
  @ViewChild(ClienteFormComponent) childclienteform!: ClienteFormComponent;
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();
  datos : any;
  filterpost = "";
  loadinglistado : boolean = false;
  cantidad_registros : number = 0;
  cod_sucursal : string = "";

  cod_cliente : string = "";
  cliente: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  cod_cliente_eliminar : string = "";
  cliente_eliminar : string = "";

  opcionesprivilegios : any;

  estado_suspendido: number = 0;

  constructor(private clienteservice:ClienteService, private toastr: ToastrService, private error:ErrorService, private abonoventaservice : AbonoVentaService,private usersession: UserSessionService, private router : Router, private swalservice: SwalService) { 
  }

  ngOnInit(): void {
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  listarClientes()
  {
    this.loadinglistado = true;
    
    this.clienteservice.listarClientesBasico().subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  opciones(item: any)
  {
    this.cod_cliente = item.cod_cliente;
    this.cliente = item.apellido + " " + item.nombre;
    this.estado_suspendido = item.estado_suspendido;
    $("#mymodalopciones").modal("show");
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost = "";
    this.listarClientes();
  }

  async visualizarListadoVentaCliente()
  {
    const params = {
      cod_sucursal: String(this.cod_sucursal || "").trim(),
      cod_cliente: String(this.cod_cliente || "").trim(),
      cliente: String(this.cliente || "").trim(),
      fechadesde: String(moment().subtract(1, 'year').format('YYYY-MM-DD')|| "").trim(),
      fechahasta: String(moment().format('YYYY-MM-DD')|| "").trim()
    };

    const hash = await this.generarHash(params);

    this.router.navigate(["/menuventa/visualizarlistadoventacliente"], {
      queryParams: {
        ...params,
        firma: hash
      }
    });
  }

  async visualizarListadoPedidoCliente()
  {
    const params = {
      cod_sucursal: String(this.cod_sucursal || "").trim(),
      cod_cliente: String(this.cod_cliente || "").trim(),
      cliente: String(this.cliente || "").trim(),
      fechadesde: String(moment().subtract(1, 'year').format('YYYY-MM-DD')|| "").trim(),
      fechahasta: String(moment().format('YYYY-MM-DD')|| "").trim()
    };

    const hash = await this.generarHash(params);

    this.router.navigate(["/menuventa/visualizarlistadopedidocliente"], {
      queryParams: {
        ...params,
        firma: hash
      }
    });
  }

  generarHash(data: any): string {
    return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  clickNuevoCliente()
  {
    this.childclienteform.nombreformulario = "NUEVA";
    this.childclienteform.formularioNormal();
    $("#mymodalformcliente").modal("show");
  }

  recibirDatosCliente(): void {
    this.formularioNormal();
    this.childclienteform.formularioNormal();
    $("#mymodalformcliente").modal("hide");
  }

  editar(item : any)
  {
      this.childclienteform.nombreformulario = "EDITAR";
      this.childclienteform.cedula = item.cedula;
      this.childclienteform.buscarClienteNormal();
      $("#mymodalformcliente").modal("show");
  }






  clickSuspenderCliente(cod_cliente_eliminar: string, cliente_eliminar: string, estado_suspendido: Number, estado_enviar: Number)
  {
    this.cod_cliente_eliminar = cod_cliente_eliminar;
    this.cliente_eliminar = cliente_eliminar;
    
    if(estado_enviar==1)
    {
      Swal.fire({
        title: 'SUSPENDER CLIENTE ' + this.cliente_eliminar,
        text: 'Confirmar para suspender el registro del cliente seleccionado. Al suspender el cliente no se podrá facturar en una compra que realice.',
        icon: 'info',
        input: 'textarea',
        inputLabel: 'Observación',
        inputPlaceholder: 'Ingrese el motivo de la suspensión...',
        inputAttributes: {
          'aria-label': 'Ingrese el motivo de la suspensión'
        },
        showCancelButton: true,
        confirmButtonText: 'Sí, Suspender',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const observaciones = result.value || '';
          this.suspenderCliente(estado_enviar, observaciones, "Suspendiendo");
        }
      });
    }
    else
    {
      Swal.fire({
        title: 'REACTIVAR CLIENTE ' + this.cliente_eliminar,
        text: 'Confirmar para reactivar el registro del cliente seleccionado',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, Reactivar',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const observaciones = result.value || '';
          this.suspenderCliente(2, "", "Reactivando");
        }
      });
    }
  }

  suspenderCliente(estado_suspendido: Number, observacion_suspendido: string, mensajeaccion: string)
  {
    this.swalservice.iniciarLoading(mensajeaccion + " cliente...");
    let mensaje: string = "";
    if(estado_suspendido==1)
    {
      mensaje = "suspendido";
    }
    else
    {
      mensaje = "reactivado";
    }

    const parametros = {
      'cod_cliente' : this.cod_cliente_eliminar,
      'estado_suspendido' : estado_suspendido,
      'observacion_suspendido': observacion_suspendido
    };

    this.clienteservice.suspenderCliente(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        if(estado_suspendido==1)
        {
          this.datos.find((x:any) => x.cod_cliente == this.cod_cliente_eliminar).estado_suspendido = true;
        }
        else
        {
          this.datos.find((x:any) => x.cod_cliente == this.cod_cliente_eliminar).estado_suspendido = false;
        }
        this.toastr.success("Registro " + mensaje + " satisfactoriamente", "INFORMACI\u00D3N DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo " + mensaje + ": " + data.mensaje + ", vuelva a intertarlo por favor", "INFORMACI\u00D3N DEL SISTEMA");
      }
    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACI\u00D3N DEL SISTEMA"); 
    });
  }

  verObservacion()
  {
    this.childobservacioncliente.opcion = "gestion";
    this.childobservacioncliente.verObservacion(this.cod_cliente, this.cliente);
  }

  async clickEliminar(cod_cliente_eliminar: string, cliente_eliminar: string)
  {
    this.cod_cliente_eliminar = cod_cliente_eliminar;
    this.cliente_eliminar = cliente_eliminar;
    
    const ok = await this.swalservice.alertConfirmRequerido({
      title: "ELIMINAR REGISTRO "  + this.cliente_eliminar,
      text: "Confirmar para eliminar el registro seleccionado",
      icon: "info",
      confirmText: "Si, Eliminar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      await this.eliminar();
    }
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
    
      const parametros = {
        'cod_cliente' : this.cod_cliente_eliminar,
        'estado' : 0,
      };

      let data: any = await lastValueFrom(this.clienteservice.eliminar(parametros));


      if (data.estado == true)
      {
          this.listarClientes();

        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo Eliminar, vuelva a intertarlo por favor");
      }

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }
}
