import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { FuncionalidadService } from 'src/app/administrar/services/funcionalidad.service';
import { RolesService } from 'src/app/administrar/services/roles.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
declare var $:any;

@Component({
  selector: 'app-funcionalidad',
  templateUrl: './funcionalidad.component.html',
  styleUrls: ['./funcionalidad.component.css']
})
export class FuncionalidadComponent implements OnInit {

  datosconfiguracion : any = [];
  datosadministrar : any = [];
  datosalmacen : any = [];
  datosventas : any = [];
  datoscompras : any = [];
  datoscuentaspagarcobrar : any = [];
  datosgastosingresos : any = [];
  datoshotel : any = [];
  datoskardex : any = [];
  datosgym : any = [];
  datosretencion : any = [];

  datosprivilegiosconfiguracion : any = [];
  datosprivilegiosventa : any = [];
  datosprivilegiosventamembresia : any = [];
  datosprivilegiosproducto : any = [];
  datosprivilegiosgi : any = [];
  datosprivilegioscuentasporpc : any = [];

  cod_roles_funcionalidad : string = "";
  roles_funcionalidad : string = "";

  loadinglistado : boolean = false;

  constructor(private rolesservice:RolesService, private funcionalidadservice:FuncionalidadService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

  ngOnInit(): void {
  }

  async listarfuncionalidades()
  {    
    this.loadinglistado = true;

    try
    {
      let data: any = await lastValueFrom(this.funcionalidadservice.listarFuncionalidades(this.cod_roles_funcionalidad));
        
      this.datosconfiguracion = data.filter(item => item.menu == "CONFIGURACION");

      this.datosadministrar = data.filter(item => item.menu == "ADMINISTRAR");
      this.datosalmacen = data.filter(item => item.menu == "ALMACEN");
      this.datosventas = data.filter(item => item.menu == "VENTAS");
      this.datoscompras = data.filter(item => item.menu == "COMPRAS");
      this.datoscuentaspagarcobrar = data.filter(item => item.menu == "CUENTAS_PAGAR_COBRAR");
      this.datosgastosingresos = data.filter(item => item.menu == "GASTOS_INGRESOS");
      this.datoshotel = data.filter(item => item.menu == "HOTEL");
      this.datoskardex = data.filter(item => item.menu == "KARDEX");
      this.datosgym = data.filter(item => item.menu == "GYM");
      this.datosretencion = data.filter(item => item.menu == "RETENCION");

      this.datosprivilegiosconfiguracion = this.datosconfiguracion.filter(item => item.grupo == "CONFIGURACION");
      this.datosprivilegiosventa = this.datosconfiguracion.filter(item => item.grupo == "VENTA");
      this.datosprivilegiosventamembresia = this.datosconfiguracion.filter(item => item.grupo == "GYM");
      this.datosprivilegiosproducto = this.datosconfiguracion.filter(item => item.grupo == "PRODUCTO");
      this.datosprivilegiosgi = this.datosconfiguracion.filter(item => item.grupo == "GASTOS_INGRESOS");
      this.datosprivilegioscuentasporpc = this.datosconfiguracion.filter(item => item.grupo == "CUENTAS_POR_PC");

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.loadinglistado = false;
    }
  }

  changeCheckedConfiguracion(index: number): void {
    if(this.datosconfiguracion[index].verificar=="1")
    {
      this.datosconfiguracion[index].verificar = "0";
    }
    else
    {
      this.datosconfiguracion[index].verificar = "1";
    }
  }

  changeCheckedAdministrar(index: number): void {
    if(this.datosadministrar[index].verificar=="1")
    {
      this.datosadministrar[index].verificar = "0";
    }
    else
    {
      this.datosadministrar[index].verificar = "1";
    }
  }

  changeCheckedAlmacen(index: number): void {
    if(this.datosalmacen[index].verificar=="1")
    {
      this.datosalmacen[index].verificar = "0";
    }
    else
    {
      this.datosalmacen[index].verificar = "1";
    }
  }

  changeCheckedVentas(index: number): void {
    if(this.datosventas[index].verificar=="1")
    {
      this.datosventas[index].verificar = "0";
    }
    else
    {
      this.datosventas[index].verificar = "1";
    }
  }

  changeCheckedCompras(index: number): void {
    if(this.datoscompras[index].verificar=="1")
    {
      this.datoscompras[index].verificar = "0";
    }
    else
    {
      this.datoscompras[index].verificar = "1";
    }
  }

  changeCheckedCuentasPagarCobrar(index: number): void {
    if(this.datoscuentaspagarcobrar[index].verificar=="1")
    {
      this.datoscuentaspagarcobrar[index].verificar = "0";
    }
    else
    {
      this.datoscuentaspagarcobrar[index].verificar = "1";
    }
  }

  changeCheckedGastosIngresos(index: number): void {
    if(this.datosgastosingresos[index].verificar=="1")
    {
      this.datosgastosingresos[index].verificar = "0";
    }
    else
    {
      this.datosgastosingresos[index].verificar = "1";
    }
  }

  changeCheckedHotel(index: number): void {
    if(this.datoshotel[index].verificar=="1")
    {
      this.datoshotel[index].verificar = "0";
    }
    else
    {
      this.datoshotel[index].verificar = "1";
    }
  }

  changeCheckedKardex(index: number): void {
    if(this.datoskardex[index].verificar=="1")
    {
      this.datoskardex[index].verificar = "0";
    }
    else
    {
      this.datoskardex[index].verificar = "1";
    }
  }

  changeCheckedGym(index: number): void {
    if(this.datosgym[index].verificar=="1")
    {
      this.datosgym[index].verificar = "0";
    }
    else
    {
      this.datosgym[index].verificar = "1";
    }
  }

  changeCheckedRetencion(index: number): void {
    if(this.datosretencion[index].verificar=="1")
    {
      this.datosretencion[index].verificar = "0";
    }
    else
    {
      this.datosretencion[index].verificar = "1";
    }
  }

  changeCheckedPrivilegiosPaneles(index: number): void {
    if(this.datosprivilegiosconfiguracion[index].verificar=="1")
    {
      this.datosprivilegiosconfiguracion[index].verificar = "0";
    }
    else
    {
      this.datosprivilegiosconfiguracion[index].verificar = "1";
    }
  }

  changeCheckedPrivilegiosVenta(index: number): void {
    if(this.datosprivilegiosventa[index].verificar=="1")
    {
      this.datosprivilegiosventa[index].verificar = "0";
    }
    else
    {
      this.datosprivilegiosventa[index].verificar = "1";
    }
  }

  changeCheckedPrivilegiosVentaMembresia(index: number): void {
    if(this.datosprivilegiosventamembresia[index].verificar=="1")
    {
      this.datosprivilegiosventamembresia[index].verificar = "0";
    }
    else
    {
      this.datosprivilegiosventamembresia[index].verificar = "1";
    }
  }

  changeCheckedPrivilegiosProducto(index: number): void {
    if(this.datosprivilegiosproducto[index].verificar=="1")
    {
      this.datosprivilegiosproducto[index].verificar = "0";
    }
    else
    {
      this.datosprivilegiosproducto[index].verificar = "1";
    }
  }

  changeCheckedPrivilegiosGI(index: number): void {
    if(this.datosprivilegiosgi[index].verificar=="1")
    {
      this.datosprivilegiosgi[index].verificar = "0";
    }
    else
    {
      this.datosprivilegiosgi[index].verificar = "1";
    }
  }

  changeCheckedPrivilegiosCuentasPC(index: number): void {
    if(this.datosprivilegioscuentasporpc[index].verificar=="1")
    {
      this.datosprivilegioscuentasporpc[index].verificar = "0";
    }
    else
    {
      this.datosprivilegioscuentasporpc[index].verificar = "1";
    }
  }

  async guardarFuncionalidades()
  {

      this.swalservice.iniciarLoading("Guardando...");
    try
    {
        let funcionalidades = [...this.datosconfiguracion, ...this.datosadministrar, ...this.datosalmacen, ...this.datosventas, ...this.datoscompras, ...this.datoscuentaspagarcobrar, ...this.datosgastosingresos, ...this.datoshotel, ...this.datoskardex, ...this.datosgym, ...this.datosretencion];
      
        const parametros = {
          'cod_roles' : this.cod_roles_funcionalidad,
          'roles' : '',
          'observacion' : '',
          'funcionalidades' : funcionalidades
        };

        let data: any = await lastValueFrom(this.funcionalidadservice.guardar(parametros));
        
        if (data.estado == true)
        {
          this.formularioNormal();
          this.toastr.success("Funcionalidades almacenados satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          $("#mymodallistarfuncionalidades").modal("hide");
        }
        else
        {
          const ok = await this.swalservice.alertError("Funcionalidades no se almacenaron, vuelva a intertarlo por favor");
        }

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }

  formularioNormal()
  {
    this.cod_roles_funcionalidad = "";
    this.roles_funcionalidad = "";
  }

}
