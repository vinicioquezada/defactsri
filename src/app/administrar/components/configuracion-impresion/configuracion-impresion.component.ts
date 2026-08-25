import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ConfiguracionDocumentosService } from '../../services/configuracion-documentos.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-configuracion-impresion',
  templateUrl: './configuracion-impresion.component.html',
  styleUrls: ['./configuracion-impresion.component.css']
})
export class ConfiguracionImpresionComponent implements OnInit {
  datos : any = [];
  datosformatosdocumentos : any = [];
  datosproforma : any = [];
  datosabono: any = [];
  datospedido: any = [];
  datosgastosingresos: any = [];
  datoscompras: any = [];
  datoselectronica: any = [];
  datosresumencaja: any = [];
  filterpost = "";


  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private configuraciondocumentosService: ConfiguracionDocumentosService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

    
  clickDeshacer()
  {
    this.formularioNormal();
  }
  
  async formularioNormal()
  {
    try
    {
      this.loadinglistado = true;
      await this.listarConfiguracionDocumentos();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarConfiguracionDocumentos()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.configuraciondocumentosService.listarConfiguracionDocumentos());
    this.datos = data;

    this.datosformatosdocumentos = data.filter(
      (item: any) => item.categoria_configuracion == "FORMATO DOCUMENTOS"
    );

    this.datoselectronica = data.filter(
      (item: any) => item.categoria_configuracion == "ELECTRONICA"
    );

    this.datosproforma = data.filter(
      (item: any) => item.categoria_configuracion == "PROFORMA"
    );

    this.datosabono = data.filter(
      (item: any) => item.categoria_configuracion == "ABONO"
    );

    this.datospedido = data.filter(
      (item: any) => item.categoria_configuracion == "PEDIDOS"
    );

    this.datosgastosingresos = data.filter(
      (item: any) => item.categoria_configuracion == "GASTOS INGRESOS"
    );

    this.datoscompras = data.filter(
      (item: any) => item.categoria_configuracion == "COMPRAS"
    );

    this.datosresumencaja = data.filter(
      (item: any) => item.categoria_configuracion == "RESUMEN CAJA"
    );

  }

  async changeChkSeleccion(item)
  {
    if(item.valor==true){
      await this.actualizar(item, 0);
    }else{
      await this.actualizar(item, 1);
    }
  }

  async actualizar(item: any, valor: number)
  {
    this.swalservice.iniciarLoading("Actualizando...");
    try
    {
        const parametros = {
          "id_configuracion_documentos" : item.id_configuracion_documentos,
          "valor" : valor,
        };

        let data: any = await lastValueFrom(this.configuraciondocumentosService.actualizar(parametros));
        this.swalservice.close();
        if (data.estado == true)
        {
          if(item.valor==true){
            item.valor = false;
          }else{
            item.valor = true;
          }
          this.toastr.success("Configuración aplicada satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          await this.formularioNormal();
        }
        else
        {
          if(item.valor==true){
            item.valor = true;
          }else{
            item.valor = false;
          }
          const ok = await this.swalservice.alertError("Configuración no se pudo registrar, vuelva a intertarlo por favor");

        }
    } catch (err: any) {
      if(item.valor==true){
            item.valor = true;
          }else{
            item.valor = false;
          }
      this.swalservice.close();
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      
    }
  }


}