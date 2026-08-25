import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ItemPastelService } from 'src/app/venta/services/item-pastel.service';
import { DetallePedidoPastelService } from 'src/app/venta/services/detalle-pedido-pastel.service';
import { ConfigService } from 'src/app/shared/services/config.service';
declare var $:any;
import * as moment from 'moment';

@Component({
  selector: 'app-pedido-panaderia',
  templateUrl: './pedido-panaderia.component.html',
  styleUrls: ['./pedido-panaderia.component.css']
})
export class PedidoPanaderiaComponent implements OnInit {
  @Input() loading : boolean = false;
  loadingalmacenar : boolean = false;
  itemsforma = [];
  itemspastel = [];
  itemsrelleno = [];
  selectedItemForma: string = "";
  selectedItemsRelleno = [];
  selectedItemsPastel = [];
  color: string = "";
  texto: string = "";
  fecha_entrega: string = "";
  descripcion: string = "";
  imagen: string = "";
  imagenanterior: string = "";

  selectedimagefile: File = null;
  @ViewChild("fileImage") fileImage: ElementRef = null;

  selectedImageBase64: string | ArrayBuffer | null = null;
  selectedImageBase64anterior: string | ArrayBuffer | null = null;

  flagtext : boolean = false;
  pastel: string = "";
  relleno: string = "";

  constructor(private itempastelservice: ItemPastelService, private toastr : ToastrService, private error : ErrorService, private detallepedidopastelservice: DetallePedidoPastelService, private configService: ConfigService) { }

  ngOnInit(): void {
    
  }

  listarItemPastel(accion: string, cod_factura_venta: string)
  {    
    this.loading = true;
    this.itempastelservice.listarItemPastel().subscribe( (data : any) =>
    {
      this.loading = false;
      this.itemsforma = data.filter( item => item.tipo_item == "forma");
      this.itemspastel = data.filter( item => item.tipo_item == "pastel");
      this.itemsrelleno = data.filter( item => item.tipo_item == "relleno");
      if(accion == "modificar")
      {
        this.buscarDetallePedidoPastel(cod_factura_venta)
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  formularioNormal(accion: string, cod_factura_venta: string)
  {
    this.itemsforma = [];
    this.itemspastel = [];
    this.itemsrelleno = [];
    this.selectedItemForma = "";
    this.selectedItemsPastel = [];
    this.selectedItemsRelleno = [];
    this.color = "";
    this.texto = "";
    this.fecha_entrega = moment().format('YYYY-MM-DD');
    this.descripcion = "";
    this.imagen = "";
    this.imagenanterior = "";
    this.pastel = "";
    this.relleno = "";
    this.listarItemPastel(accion, cod_factura_venta);
    this.restoreFile();
  }

  buscarDetallePedidoPastel(cod_factura_venta: string)
  {
    this.loading = true;
    
    this.detallepedidopastelservice.buscarDetallePedidoPastel(cod_factura_venta).subscribe( (data : any) =>
    {
      this.loading = false;
      this.selectedItemForma = data.forma;
      this.selectedItemsPastel = data.pastel.split(", ");
      this.selectedItemsRelleno = data.relleno.split(", ");
      this.color = data.color;
      this.texto = data.texto;
      this.fecha_entrega = data.fecha_entrega;
      this.descripcion = data.descripcion;
      this.imagen = data.imagen;
      this.imagenanterior = data.imagen;
      this.selectedImageBase64 = this.configService.settings.baseUrl + "/fotospedidopastel/" + this.imagen;
      this.selectedImageBase64anterior = this.configService.settings.baseUrl + "/fotospedidopastel/" + this.imagen;
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  seleccionarForma(itemforma: string): void {
    this.selectedItemForma = itemforma;
  }


  restoreFile(): void {
    this.fileImage.nativeElement.value = null;
    this.selectedImageBase64 = null;
    this.selectedimagefile = null;
  }

  onFileSelected(event: Event): void
  {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files[0]) {
      return;
    }

    const file = input.files[0];

    this.resizeImage(file, 400, 400, 1).then((resizedFile) => {
      this.selectedimagefile = resizedFile;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageBase64 = reader.result;
      };
      reader.readAsDataURL(resizedFile);
    });
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<File> {

    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Mantener proporción
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const newFile = new File(
              [blob!],
              file.name.replace(/\.\w+$/, '.jpg'),
              { type: 'image/jpeg' }
            );
            resolve(newFile);
          },
          'image/jpeg',
          quality
        );
      };

      reader.readAsDataURL(file);
    });
  }

  clearImage(): void {
    this.fileImage.nativeElement.value = null;
    this.selectedImageBase64 = null;
    this.selectedimagefile = null;
  }

  clickAgregarItem(tipoitem: string) {
    if(tipoitem == "pastel")
    {
      $("#mymodalagregarpastel").modal("show");
    }
    else
    {
      $("#mymodalagregarrelleno").modal("show");
    }
  }

  guardar(item: string, tipo_item: string) {
    this.loadingalmacenar = true;
    const parametros = {
      'item' : item,
      'tipo_item' : tipo_item
    };
    this.itempastelservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loadingalmacenar = false;
      if (data.estado == true)
      {
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.listarItemPastel("guardar", "");
        $("#mymodalagregarpastel").modal("hide");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadingalmacenar = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  verificarItem(tipoitem: string)
  {
    this.flagtext = false;

    if(tipoitem == "pastel")
    {
      if(this.pastel.length==0)
      {
        this.flagtext=true;
        this.toastr.warning("Campo pastel esta vacío", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.guardar(this.pastel, tipoitem);
      }
    }
    else
    {
      if(this.relleno.length==0)
      {
        this.flagtext=true;
        this.toastr.warning("Campo relleno esta vacío", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.guardar(this.relleno, tipoitem);
      }
    }
  }
}
