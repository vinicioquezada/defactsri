import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { StorageEncryptionService } from 'src/app/shared/services/storage-encryption.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario : string = "";
  rrpp : string = "";

  loading : boolean = false;
  

  cedula : string = "";
  apellido : string = "";
  nombre : string = "";
  convencional : string = "";
  celular : string = "";
  correo : string = "";
  direccion : string = "";
  titulo : string = "";

  password1 : string = "";
  password2 : string = "";

  cod_genero : string = "";
  datosgenero : any[] = [
    {
      "cod_genero" : "MASCULINO",
      "genero" : "MASCULINO",
    },
    {
      "cod_genero" : "FEMENINO",
      "genero" : "FEMENINO",
    }
  ];

  selectedimagefile: File = null;
  @ViewChild("fileImage") fileImage: ElementRef = null;

  selectedImageBase64: string | ArrayBuffer | null = null;
  selectedImageBase64anterior: string | ArrayBuffer | null = null;

  constructor(private perfilservice : PerfilService, private toastr: ToastrService, private error:ErrorService, private empleadoservice:EmpleadoService, private storageencryptionservice: StorageEncryptionService, private usersession: UserSessionService, private configService: ConfigService)
  {
    this.selectedImageBase64 = this.configService.settings.baseUrl + "/fotouser/" + this.usersession.getConfiguracion("foto");
    this.usuario = this.usersession.getConfiguracion("usuario");
    this.rrpp = this.usersession.getConfiguracion("rrpp");
  }
  
  ngOnInit(): void {
    this.buscardatosusuario();
  }

  changegenero(event: any): void {
    const elemento = event.target.value;
    this.cod_genero = elemento;
  }

  upload(){
    this.loading = true;
      let form = new FormData();
      form.append("userfile",this.selectedimagefile);
      form.append("fotoanterior", this.usersession.getConfiguracion("foto"));
      this.perfilservice.subirImagen(form).subscribe( (data : any) => {
          this.loading = false;
          if(data.estado==true){

            let configuracion = this.storageencryptionservice.getDecryptedItem("cu1");
            configuracion.foto = data.nombrearchivo;
            this.storageencryptionservice.setEncryptedItem("cu1", configuracion);
            this.usersession.setAllConfiguracion(configuracion);
            window.location.href= this.configService.settings.baseRuta + "perfil";
          }
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loading = false;
      });
  }

  actualizardatosperfil(){
    this.loading = true;
    

    const parametros = {
      'cedula' : this.cedula,
      'rrpp' : this.rrpp,
      'apellido' : this.apellido,
      'nombre' : this.nombre,
      'genero' : this.cod_genero,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      'titulo' : this.titulo
    };

    this.empleadoservice.actualizarDatosPerfil(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.toastr.success("Perfil actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Perfilno se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscardatosusuario()
  {
    this.loading = true;
    

    this.perfilservice.buscarDatosUsuario().subscribe( (data : any) =>
    {
      if (data.cod_empleado == false)//No existe
      {
        this.toastr.warning("Usuario no se pudo encontrar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
          this.cedula = data.cedula;
          this.apellido = data.apellido;
          this.nombre = data.nombre;
          this.cod_genero = data.genero;
          this.convencional = data.convencional;
          this.celular = data.celular;
          this.correo = data.correo;
          this.direccion = data.direccion;
          this.titulo = data.titulo;
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  clickactualizarpassword()
  {
    if(this.password1.length==0)
    {
      this.toastr.warning("La contraseña no puede ser vacía", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.password1 == this.password2)
      {
        this.actualizarpassword();
      }
      else
      {
        this.toastr.warning("Las contraseñas no coinciden", "INFORMACIÓN DEL SISTEMA");
      }
    }
  }

  actualizarpassword()
  {
    this.loading = true;
    

    const parametros = {
      'password' : this.password1
    };

    this.perfilservice.actualizarPassword(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.toastr.success("Contraseña actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Contraseña se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  onFileSelected(event: Event): void
  {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files[0]) {
      return;
    }

    const file = input.files[0];

    this.resizeImage(file, 400, 400, 0.75).then((resizedFile) => {
      this.selectedimagefile = resizedFile;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageBase64 = reader.result;
      };
      reader.readAsDataURL(resizedFile);
    });
  }


  restoreFile(): void {
    this.fileImage.nativeElement.value = null;
    this.selectedImageBase64 = null;
    this.selectedimagefile = null;
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


}