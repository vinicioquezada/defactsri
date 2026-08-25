import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MonitorLocalService } from 'src/app/gym/services/monitor-local.service';
import { SocioService } from 'src/app/gym/services/socio.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { lastValueFrom } from 'rxjs';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MonitorService } from 'src/app/gym/services/monitor.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { MonitorLocalSecundarioService } from 'src/app/gym/services/monitor-local-secundario.service';
import { MonitorLocalActividadService } from 'src/app/gym/services/monitor-local-actividad.service';

@Component({
  selector: 'app-foto-form',
  templateUrl: './foto-form.component.html',
  styleUrls: ['./foto-form.component.css']
})
export class FotoFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  capturedImage: (string | null)[] = [null];
  selectedImageBase64: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  stream: MediaStream | null = null;

  imagenseleccionada: string;

  cod_sucursal : string = "";

  cod_cliente: number = 0;
  cliente: string= "";
  itemcliente: any;

  urlfoto : string = "";

  numero_usuario: string = "";

  emparejareditar: boolean = false;

  compartido_extension: string = "";

  infousuariodispositivo1: string = "";
  infousuariodispositivo2: string = "";
  usuariodispositivo1: boolean = false;
  usuariodispositivo2: boolean = false;

  monitor_actividades: string = "";

  constructor(private sociossrvice: SocioService, private usersession: UserSessionService, private monitorlocalservice: MonitorLocalService, private monitorservice: MonitorService, private monitorlocalsecundarioservice: MonitorLocalSecundarioService, private toastr: ToastrService, private error:ErrorService, private configService: ConfigService, private monitorlocalactividadservice: MonitorLocalActividadService) { }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.compartido_extension = this.usersession.getConfiguracion("compartido_extension");
    this.monitor_actividades = this.usersession.getConfiguracion("monitor_actividades");
  }

  ngOnDestroy(): void {
    this.closeCamera(); 
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: Event) {
    this.closeCamera(); 
  }

  async clickEmparejar(item: any)
  {
    this.emparejareditar = false;
    this.cod_cliente = item.cod_cliente;
    this.cliente = item.nombre + " " + item.apellido;
    this.itemcliente = {
        'cod_cliente' : item.cod_cliente,
        'cliente' : item.nombre + " " + item.apellido,
        'identificacion' : item.cedula,
        'tipo_usuario' : item.tipo_usuario_gym
      };
    
    this.iniciarLoading();
    let usuario1 = await this.buscarUsuarioDispositivo("1");
    
    if(usuario1==1 || usuario1==2)//Conectado
    {
      if(item.cod_usuario_gym != null)//No esta emparejado
      {
        if(this.compartido_extension=="1")
        {
          let usuario2 = await this.buscarUsuarioDispositivoSecundario("1");
          if(usuario2==1 || usuario2==2)//Conectado
          {
            Swal.close();
            this.openCamera();
            $("#mymodaltomarfoto").modal("show");
          }
          else
          {
              this.modalConfirmacion2();
          }
        }
        else
        {
          Swal.close();
          this.openCamera();
          $("#mymodaltomarfoto").modal("show");
        }
      }
    }
    else
    {
      Swal.close();
      Swal.fire({
        title: "Control del Sistema",
        text: "No se puede conectar con el dispositivo, se necesita que el dispositivo este conectado o encendido para enviar la foto del usuario",
        icon: "error",
        confirmButtonText: 'OK',
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then( (result) => {
        if (result.value) {
          
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
    }
  }

  modalConfirmacion2()
  {
    Swal.fire({
        title: 'Información de dispositivo 2',
        text: 'El dispositivo se encuentra desconectado, procede continuar con el registro',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Si, Continuar',
        cancelButtonText: 'No, Continuar'
      }).then((result) => {
        if (result.value) {
          this.openCamera();
          $("#mymodaltomarfoto").modal("show");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
  }

  async guardarUsuarioLocal(): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalservice.guardarUsuarioLocal(this.itemcliente));
      
      if (data.estado == true)
      {
        //this.toastr.success("Registro de usuario almacenado localmente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Registro de usuario no se almacenó localmente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de usuario no se almacenó localmente", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async actualizarEstadoEmparejamiento(numero_usuario: number, tipo_crud: number): Promise<any> {
    try {

      let parametros = {
        'cod_cliente' : this.cod_cliente,
        'numero_usuario' : numero_usuario,
        'cod_sucursal' : this.cod_sucursal,
        'tipo_crud' : tipo_crud
      };

      const data: any = await lastValueFrom(this.monitorservice.actualizarEstadoEmparejamiento(parametros));
      
      if (data.estado == true)
      {
        //this.toastr.success("Registro de usuario almacenado localmente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Registro de usuario no se pudo emparejar", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de usuario no se almacenó localmente", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async registrarUsuarioDispositivo(id_usuario: string, nombres: string): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalservice.registrarUsuarioDispositivo(id_usuario, nombres));
      
      if (data.estado == true)
      {
        //this.toastr.success("Registro de usuario almacenado en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Registro de usuario no se almacenó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de usuario no se almacenó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async subirRostroUsuarioDispositivo(id_usuario: string, nombres: string): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalservice.subirRostroUsuarioDispositivo(id_usuario, String(this.cod_cliente), nombres));
      
      if (data.estado == true)
      {
        //this.toastr.success("Registro de usuario almacenado en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Registro de rostro no se almacenó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de rosto no se almacenó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async eliminarRostroUsuarioDispositivo(id_usuario: string): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalservice.eliminarRostroUsuarioDispositivo(id_usuario));
      
      if (data.estado == true)
      {
        //this.toastr.success("Foto de usuario se eliminó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Foto de usuario no se eliminó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Foto de usuario no se pudo eliminar en el dispositivo", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  iniciarLoading()
  {
    Swal.fire({
      title: 'Procesando...',
      html: `<div class="spinner-border text-primary" style="width: 3rem; height: 3rem; margin-top: 1rem; margin-bottom: 1rem;"></div>`,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      customClass: {
        popup: 'swal2-loading-popup'
      }
    });
  }

  async openCamera() {
    //this.index = index;
    let configuracion = null;
    
      configuracion = {
        width: { ideal: 640 },
        height: { ideal: 360 },
        facingMode: 'user'
      }

    $("#mymodaltomarfoto").modal("show");

    if (this.stream && this.stream.active) {
      //console.log("La cámara ya está encendida.");
      return;
    }

    try {
      //const stream = await navigator.mediaDevices.getUserMedia({
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: configuracion
      });
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = this.stream;
        await videoElement.play();
      }
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  }

  async capturePhoto() {

  this.iniciarLoading();
  try {
      const file = await this.procesarImagen();
     
      const dataverificacion = await this.buscarUsuarioLocalPorCodigo();//Local
      if (dataverificacion.id_cliente==false)//No Existe
      {
        const data = await this.guardarUsuarioLocal();//Local
        if (data.estado)
        {
          const dataestadoemparejamiento = await this.actualizarEstadoEmparejamiento(data.id_usuario, 0);//Nube 0 Guardar 1 Modificado
          if (dataestadoemparejamiento.estado)
          {
            const datadispositivo = await this.registrarUsuarioDispositivo(data.id_usuario, data.nombres);//Dispositivo 1
            if (datadispositivo.estado)
            {
              const dataestadoimagenlocal = await this.upload(file);//Local
              if (dataestadoimagenlocal)
              {
                const dataestadoimagendispositivo = await this.subirRostroUsuarioDispositivo(data.id_usuario, data.nombres);//Dispositivo 1
                if (dataestadoimagendispositivo.estado)
                {
                  await this.uploadNube(file);//Nube

                  if(this.compartido_extension=="1")
                  {
                    const datadispositivo2 = await this.registrarUsuarioDispositivoSecundario(data.id_usuario, data.nombres);//Dispositivo 2
                    if (datadispositivo2.estado)
                    {
                        const dataestadoimagendispositivo2 = await this.subirRostroUsuarioDispositivoSecundario(data.id_usuario, data.nombres);//Dispositivo 2
                        if (dataestadoimagendispositivo2.estado)
                        {

                        }
                    }
                  }

                  const parametrosenviar = {
                    "cod_cliente" : this.cod_cliente
                  };

                  this.datosenvio.emit(parametrosenviar);

                this.toastr.success("Socio registrado correctamente con el dispositivo", "INFORMACIÓN DEL SISTEMA");
                }
              }
            }
          }
        }
      }
      else
      {
          const dataestadoemparejamiento = await this.actualizarEstadoEmparejamiento(dataverificacion.id_cliente, 0);//Nube 0 Guardar 1 Modificado
          if (dataestadoemparejamiento.estado)
          {
            const datadispositivo = await this.registrarUsuarioDispositivo(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 1
            if (datadispositivo.estado)
            {
              const dataestadoimagenlocal = await this.upload(file);//Local
              if (dataestadoimagenlocal)
              {
                const dataestadoimagendispositivo = await this.subirRostroUsuarioDispositivo(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 1
                if (dataestadoimagendispositivo.estado)
                {
                  await this.uploadNube(file);//Nube

                  if(this.compartido_extension=="1")
                  {
                    const datadispositivo2 = await this.registrarUsuarioDispositivoSecundario(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 2
                    if (datadispositivo2.estado)
                    {
                        const dataestadoimagendispositivo2 = await this.subirRostroUsuarioDispositivoSecundario(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 2
                        if (dataestadoimagendispositivo2.estado)
                        {

                        }
                    }
                  }
                  
                  const parametrosenviar = {
                    "cod_cliente" : this.cod_cliente
                  };

                  this.datosenvio.emit(parametrosenviar);

                  this.toastr.success("Socio registrado correctamente con el dispositivo", "INFORMACIÓN DEL SISTEMA");
                }
              }
            }
          }
      }

    } catch (e) {
      // errores ya manejados internamente
    } finally {
      Swal.close();
      $("#mymodaltomarfoto").modal("hide");
    }
  }

  async buscarUsuarioLocalPorCodigo(): Promise<any> {
    try {
      const cod_cliente = this.itemcliente.cod_cliente;
      const data: any = await lastValueFrom(this.monitorlocalservice.buscarUsuarioLocalPorCodigo(cod_cliente));
      
      if (data.id_cliente == false)
      {
        
        return data;
      }
      else
      {
        this.toastr.info("Registro de usuario se encuentra registrado en base de datos local, se verificará en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de usuario no se almacenó localmente", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async procesarImagen(): Promise<File> {
    return new Promise((resolve, reject) => {

      if (!this.stream) {
        this.toastr.error("La cámara no está encendida", "INFORMACIÓN DEL SISTEMA");
        reject();
        return;
      }

      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (!videoElement) {
        reject();
        return;
      }

      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      const targetSize = 300;
      const jpegQuality = 0.9;

      const cropSize = Math.min(videoWidth, videoHeight);
      const sx = (videoWidth - cropSize) / 2;
      const sy = (videoHeight - cropSize) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;

      const context = canvas.getContext('2d');
      if (!context) {
        reject();
        return;
      }

      context.drawImage(
        videoElement,
        sx, sy, cropSize, cropSize,
        0, 0, targetSize, targetSize
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject();
          return;
        }

        const file = new File([blob], 'captured-face.jpg', { 
          type: 'image/jpeg'
        });

        this.selectedImageFile = file;
          this.closeCamera();
        resolve(file);

      }, 'image/jpeg', jpegQuality);

    });
  }

  closeCamera() {
    if (this.stream) {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.srcObject) {
        const tracks = this.stream.getTracks();
        tracks.forEach(track => track.stop());
        this.stream = null;
        videoElement.srcObject = null;
      }
    }
  }

  async upload(file: File): Promise<boolean> {
    try {
      const form = new FormData();
      form.append("imagen", file);
      form.append("nombreimagen", String(this.cod_cliente));

      const data: any = await lastValueFrom(this.monitorlocalservice.subirImagen(form));

      if (data.estado == true) {
        //this.toastr.success("Foto Registrada Correctamente", "INFORMACIÓN DEL SISTEMA");
        return true;
      }

      this.toastr.error("No se pudo registrar la foto en local", "INFORMACIÓN DEL SISTEMA");
      return false;

    } catch (err: any) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      return false;
    }
  }

  async uploadNube(file: File): Promise<boolean> {
    try {
      const form = new FormData();
      form.append("imagen", file);
      form.append("nombreimagen", String(this.cod_cliente));

      const data: any = await lastValueFrom(this.monitorservice.subirImagenNube(form));

      if (data.estado == true) {
        //this.toastr.success("Foto Registrada Correctamente", "INFORMACIÓN DEL SISTEMA");
        return true;
      }

      this.toastr.error("No se pudo registrar la foto en la nube", "INFORMACIÓN DEL SISTEMA");
      return false;

    } catch (err: any) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      return false;
    }
  }

  async procesoImportarRegistroCompleto() {

  this.iniciarLoading();
  try {
      const file = await this.procesarImagenEnLaNube();
      const dataverificacion = await this.buscarUsuarioLocalPorCodigo();//Local
      if (dataverificacion.id_cliente==false)//No Existe
      {
        const data = await this.guardarUsuarioLocal();//Local
        if (data.estado)
        {
          const dataestadoemparejamiento = await this.actualizarEstadoEmparejamiento(data.id_usuario, 0);//Nube 0 Guardar 1 Modificado
          if (dataestadoemparejamiento.estado)
          {
            const datadispositivo = await this.registrarUsuarioDispositivo(data.id_usuario, data.nombres);//Dispositivo 1
            if (datadispositivo.estado)
            {
              const dataestadoimagenlocal = await this.upload(file);//Local
              if (dataestadoimagenlocal)
              {
                const dataestadoimagendispositivo = await this.subirRostroUsuarioDispositivo(data.id_usuario, data.nombres);//Dispositivo 1
                if (dataestadoimagendispositivo.estado)
                {
                  //await this.uploadNube(file);//Nube

                  if(this.compartido_extension=="1")
                  {
                    const datadispositivo2 = await this.registrarUsuarioDispositivoSecundario(data.id_usuario, data.nombres);//Dispositivo 2
                    if (datadispositivo2.estado)
                    {
                        const dataestadoimagendispositivo2 = await this.subirRostroUsuarioDispositivoSecundario(data.id_usuario, data.nombres);//Dispositivo 2
                        if (dataestadoimagendispositivo2.estado)
                        {

                        }
                    }
                  }

                  const parametrosenviar = {
                    "cod_cliente" : this.cod_cliente
                  };

                  this.datosenvio.emit(parametrosenviar);

                this.toastr.success("Socio registrado correctamente con el dispositivo", "INFORMACIÓN DEL SISTEMA");
                }
              }
            }
          }
        }
          
      }
      else
      {
          const dataestadoemparejamiento = await this.actualizarEstadoEmparejamiento(dataverificacion.id_cliente, 0);//Nube 0 Guardar 1 Modificado
          if (dataestadoemparejamiento.estado)
          {
            const datadispositivo = await this.registrarUsuarioDispositivo(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 1
            if (datadispositivo.estado)
            {
              const dataestadoimagenlocal = await this.upload(file);//Local
              if (dataestadoimagenlocal)
              {
                const dataestadoimagendispositivo = await this.subirRostroUsuarioDispositivo(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 1
                if (dataestadoimagendispositivo.estado)
                {
                  //await this.uploadNube(file);//Nube

                  if(this.compartido_extension=="1")
                  {
                    const datadispositivo2 = await this.registrarUsuarioDispositivoSecundario(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 2
                    if (datadispositivo2.estado)
                    {
                        const dataestadoimagendispositivo2 = await this.subirRostroUsuarioDispositivoSecundario(dataverificacion.id_cliente, dataverificacion.cliente);//Dispositivo 2
                        if (dataestadoimagendispositivo2.estado)
                        {

                        }
                    }
                  }

                  const parametrosenviar = {
                    "cod_cliente" : this.cod_cliente
                  };

                  this.datosenvio.emit(parametrosenviar);

                  this.toastr.success("Socio registrado correctamente con el dispositivo", "INFORMACIÓN DEL SISTEMA");
                }
              }
            }
          }
      }

    } catch (e) {
      // errores ya manejados internamente
    } finally {
      Swal.close();
      $("#mymodaltomarfoto").modal("hide");
    }
  }

  async procesarImagenEnLaNube(): Promise<File>
  {
    const imagen = String(this.cod_cliente) + ".jpg";
    const blob = await lastValueFrom(
      this.monitorservice.descargarImagenUsuario(imagen)
    );

    const file = new File(
      [blob],
      'rostro.jpg',
      { type: blob.type || 'image/jpeg' }
    );

    return file;
  }

  clickImportar()
  {
    Swal.fire({
      title: 'IMPORTAR '  + this.cliente,
      text: 'Confirmar para el registro completo al dispositivo',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Importar',
      cancelButtonText: 'No, Importar'
    }).then((result) => {
      if (result.value) {
        this.procesoImportarRegistroCompleto();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  


  async actualizarUsuarioActividadesDispositivo()
  {
    try {
      const parametros = {
        "cod_cliente" : this.cod_cliente,
        "nombres" : this.cliente
      }
      const data: any = await lastValueFrom(this.monitorlocalactividadservice.actualizarUsuarioActividadesDispositivo(parametros));
      
      if (data.estado == true)
      {
        this.toastr.success("Los datos se actualizaron en todos los dispositivos", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Los datos no se actualizaron en los dispositivos debido a un error con el dispositivo, verifique el dispositivo si tiene conexión", "INFORMACIÓN DEL SISTEMA");
      }

    } catch (err: any) {
      this.toastr.error("Los datos no se actualizaron en los dispositivos, verifique conexión con el servidor web local", "INFORMACIÓN DEL SISTEMA");
    }
  }
  
  async actualizarFotoUsuarioActividadesDispositivo()
  {
    try {
      const parametros = {
        "cod_cliente" : this.cod_cliente,
        "nombres" : this.cliente
      }
      const data: any = await lastValueFrom(this.monitorlocalactividadservice.actualizarFotoUsuarioActividadesDispositivo(parametros));
      
      if (data.estado == true)
      {
        this.toastr.success("La foto se actualizó en todos los dispositivos", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("La foto no se actualizó en los dispositivos debido a un error con el dispositivo, verifique el dispositivo si tiene conexión", "INFORMACIÓN DEL SISTEMA");
      }

    } catch (err: any) {
      this.toastr.error("La foto no se actualizó en los dispositivos, verifique conexión con el servidor web local", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async eliminarFotoUsuarioActividadesDispositivo()
  {
    try {
      const parametros = {
        "cod_cliente" : this.cod_cliente
      }
      const data: any = await lastValueFrom(this.monitorlocalactividadservice.eliminarFotoUsuarioActividadesDispositivo(parametros));
      
      if (data.estado == true)
      {
        this.toastr.success("La foto se eliminó en todos los dispositivos", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("La foto no se eliminó en los dispositivos debido a un error con el dispositivo, verifique el dispositivo si tiene conexión", "INFORMACIÓN DEL SISTEMA");
      }

    } catch (err: any) {
      this.toastr.error("La foto no se eliminó en los dispositivos, verifique conexión con el servidor web local", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickActualizarFotoWebDispositivo()
  {
    this.openCamera();
    $("#mymodaltomarfoto").modal("show");
  }

  async registrarUsuarioDispositivoSecundario(id_usuario: string, nombres: string): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalsecundarioservice.registrarUsuarioDispositivoSecundario(id_usuario, nombres));
      
      if (data.estado == true)
      {
        //this.toastr.success("Registro de usuario almacenado en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Registro de usuario no se almacenó en el dispositivo 2", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de usuario no se almacenó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async subirRostroUsuarioDispositivoSecundario(id_usuario: string, nombres: string): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalsecundarioservice.subirRostroUsuarioDispositivoSecundario(id_usuario, String(this.cod_cliente), nombres));
      
      if (data.estado == true)
      {
        //this.toastr.success("Registro de usuario almacenado en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Registro de rostro no se almacenó en el dispositivo 2", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de rosto no se almacenó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async eliminarRostroUsuarioDispositivoSecundario(id_usuario: string): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalsecundarioservice.eliminarRostroUsuarioDispositivoSecundario(id_usuario));
      
      if (data.estado == true)
      {
        //this.toastr.success("Foto de usuario se eliminó en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Foto de usuario no se eliminó en el dispositivo 2", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Foto de usuario no se pudo eliminar en el dispositivo", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async actualizarUsuarioDispositivo(): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalservice.actualizarUsuarioDispositivo(this.numero_usuario, this.cliente));
      
      if (data.estado == true)
      {
        this.toastr.success("Socio actualizado localmente en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Socio no actualizado localmente en el dispositivo", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Socio no actualizado localmente en el dispositivo por error en el servidor", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async actualizarUsuarioDispositivoSecundario(): Promise<any> {
    try {
      const data: any = await lastValueFrom(this.monitorlocalsecundarioservice.actualizarUsuarioDispositivoSecundario(this.numero_usuario, this.cliente));
      
      if (data.estado == true)
      {
        this.toastr.success("Socio actualizado localmente en el dispositivo 2", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Socio no actualizado localmente en el dispositivo 2", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Socio no actualizado localmente en el dispositivo 2 por error en el servidor", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async actualizarUsuarioLocal(): Promise<any> {
    try {
        let parametros = {
        ...this.itemcliente,
        id_cliente: this.numero_usuario
      };
      const data: any = await lastValueFrom(this.monitorlocalservice.actualizarUsuarioLocal(parametros));
      
      if (data.estado == true)
      {
        //this.toastr.success("Registro de usuario actualizado localmente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Registro de usuario no se actualizó localmente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Registro de usuario no se almacenó localmente", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  clickEliminarFotoWebDispositivo()
  {
    Swal.fire({
      title: 'ELIMINAR FOTO '  + this.cliente,
      text: 'Confirmar para eliminar la foto del registro',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Eliminar'
    }).then((result) => {
      if (result.value) {
        this.procesoEliminarFoto();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  async procesoEliminarFoto()
  {
    this.iniciarLoading();
    try
    {
      const datadispositivo1 = await this.eliminarRostroUsuarioDispositivo(this.numero_usuario);//Local
      if (datadispositivo1.estado)
      {
        if(this.compartido_extension=="1")
        {
          const datadispositivo2 = await this.eliminarRostroUsuarioDispositivoSecundario(this.numero_usuario);//Local
          if (datadispositivo2.estado)
          {
            const datadimagennube = await this.eliminarImagenNube();//Local
            if (datadimagennube.estado)
            {
              const datadimagenlocal = await this.eliminarImagenLocal();//Local
              if (datadimagenlocal.estado)
              {
                this.toastr.success("Imagen eliminada en los dispositivos", "INFORMACIÓN DEL SISTEMA");
              }
            }
          }
        }
        else
        {
          if(this.monitor_actividades=="1")
          {
            this.eliminarFotoUsuarioActividadesDispositivo();
          }

          const datadimagennube = await this.eliminarImagenNube();//Local
          if (datadimagennube.estado)
          {
            const datadimagenlocal = await this.eliminarImagenLocal();//Local
            if (datadimagenlocal.estado)
            {
              this.toastr.success("Imagen eliminada en los dispositivos", "INFORMACIÓN DEL SISTEMA");
            }
          }
        }
        
      }
    } catch (e) {

    } finally {
      Swal.close();
    }
  }

  async eliminarImagenNube(): Promise<any> {
    try {

      let parametros = {
          'cod_cliente': this.cod_cliente
      };

      const data: any = await lastValueFrom(this.monitorservice.eliminarImagenNube(parametros));
      
      if (data.estado == true)
      {
        //this.toastr.success("Foto Eliminada en la nube correctamente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Foto no se pudo eliminar en la nube", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Foto no se pudo eliminar en la nube por error en el servidor", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async eliminarImagenLocal(): Promise<any> {
    try {

      let parametros = {
          'cod_cliente': this.cod_cliente
      };

      const data: any = await lastValueFrom(this.monitorlocalservice.eliminarImagen(parametros));
      
      if (data.estado == true)
      {
        //this.toastr.success("Foto local Eliminada correctamente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }
      else
      {
        this.toastr.error("Foto no se pudo eliminar localmente", "INFORMACIÓN DEL SISTEMA");
        return data;
      }

    } catch (err: any) {
      console.log(err);
      this.toastr.error("Foto no se pudo eliminar localmente por error en el servidor", "INFORMACIÓN DEL SISTEMA");
      let data = {
        estado: false
      }
      return data;
    }
  }

  async captureActualizarPhoto() {

  this.iniciarLoading();
  try {
      const file = await this.procesarImagen(); 
      
      if(this.usuariodispositivo1)//Local Usuario true si existe Dispositivo 1
      {
        const data = await this.eliminarRostroUsuarioDispositivo(this.numero_usuario);//Local
        if (data.estado)
        {
          await this.sleep(1000);
          const dataestadoimagenlocal = await this.upload(file);//Local
          if (dataestadoimagenlocal)
          {
            const dataestadoimagendispositivo = await this.subirRostroUsuarioDispositivo(this.numero_usuario, this.cliente);//Dispositivo 1
            if (dataestadoimagendispositivo.estado)
            {
              await this.uploadNube(file);//Nube
              
              if(this.monitor_actividades=="1")
              {
                this.actualizarFotoUsuarioActividadesDispositivo();
              }

              if(this.compartido_extension=="1")
              {
                
                if(this.usuariodispositivo2)//Local Usuario true si existe Dispositivo 2
                {
                  const data = await this.eliminarRostroUsuarioDispositivoSecundario(this.numero_usuario);//Local
                  if (data.estado)
                  {
                    await this.sleep(1000);
                    const dataestadoimagendispositivo2 = await this.subirRostroUsuarioDispositivoSecundario(this.numero_usuario, this.cliente);//Dispositivo 2
                    if (dataestadoimagendispositivo2.estado)
                    {

                    }
                  }
                }
                else
                {
                  const datadispositivo2 = await this.registrarUsuarioDispositivoSecundario(this.numero_usuario, this.cliente);//Dispositivo 2
                  if (datadispositivo2.estado)
                  {
                      const dataestadoimagendispositivo2 = await this.subirRostroUsuarioDispositivoSecundario(this.numero_usuario, this.cliente);//Dispositivo 2
                      if (dataestadoimagendispositivo2.estado)
                      {

                      }
                  }
                }
                
                
              }
              this.toastr.success("Foto actualizado correctamente con el dispositivo", "INFORMACIÓN DEL SISTEMA");
              $("#mymodaleditardatosfoto").modal("hide");
            }
          }
        }
      }
      else
      {
        const datadispositivo = await this.registrarUsuarioDispositivo(this.numero_usuario, this.itemcliente.cliente);//Dispositivo 1
        if (datadispositivo.estado)
        {
          const dataestadoimagenlocal = await this.upload(file);//Local
          if (dataestadoimagenlocal)
          {
            const dataestadoimagendispositivo = await this.subirRostroUsuarioDispositivo(this.numero_usuario, this.itemcliente.cliente);//Dispositivo 1
            if (dataestadoimagendispositivo.estado)
            {
              await this.uploadNube(file);//Nube

              if(this.compartido_extension=="1")
              {
                const datadispositivo2 = await this.registrarUsuarioDispositivoSecundario(this.numero_usuario, this.itemcliente.cliente);//Dispositivo 2
                if (datadispositivo2.estado)
                {
                    const dataestadoimagendispositivo2 = await this.subirRostroUsuarioDispositivoSecundario(this.numero_usuario, this.itemcliente.cliente);//Dispositivo 2
                    if (dataestadoimagendispositivo2.estado)
                    {

                    }
                }
              }
            this.toastr.success("Socio registrado correctamente con el dispositivo", "INFORMACIÓN DEL SISTEMA");
            $("#mymodaleditardatosfoto").modal("hide");
            }
          }
        }
      }
    
    } catch (e) {
      // errores ya manejados internamente
    } finally {
      Swal.close();
      $("#mymodaltomarfoto").modal("hide");
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async buscarUsuarioDispositivo(numero_usuario: string): Promise<any> {
    try {
      //const cod_cliente = this.itemcliente.cod_cliente;
      const resp: any = await lastValueFrom(this.monitorlocalservice.buscarUsuarioDispositivo(numero_usuario));

      const search = resp?.data?.UserInfoSearch;
      const user = search?.UserInfo?.[0];

      if (!user || user.employeeNo != this.numero_usuario) {
        
        //this.toastr.info("Usuario no encontrado", "INFORMACIÓN DEL SISTEMA");
        return 2;
      }
      else
      {
        return 1;
      }
      
    } catch (err: any) {
      console.log(err);
      this.toastr.error("El dispositivo se encuentra apagado no existe una comunicación", "INFORMACIÓN DEL SISTEMA");
      return 3;
    }
  }

  async buscarUsuarioDispositivoSecundario(numero_usuario: string): Promise<any> {
    try {
      //const cod_cliente = this.itemcliente.cod_cliente;
      const resp: any = await lastValueFrom(this.monitorlocalsecundarioservice.buscarUsuarioDispositivoSecundario(numero_usuario));

      const search = resp?.data?.UserInfoSearch;
      const user = search?.UserInfo?.[0];

      if (!user || user.employeeNo != this.numero_usuario) {
        //this.toastr.info("Usuario no encontrado", "INFORMACIÓN DEL SISTEMA");
        return 2;
      }
      else
      {
        return 1;
      }
    } catch (err: any) {
      console.log(err);
      this.toastr.error("El dispositivo 2 se encuentra apagado no existe una comunicación", "INFORMACIÓN DEL SISTEMA");
      return 3;
    }
  }

  async clickActualizarSoloDatos()
  {
    Swal.fire({
      title: 'ACTUALIZAR DATOS '  + this.cliente,
      text: 'Confirmar para actualizar los datos del dispositivo',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Actualizar',
      cancelButtonText: 'No, Actualizar'
    }).then((result) => {
      if (result.value) {
        this.procesoActualizarSoloDatos();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  async procesoActualizarSoloDatos()
  {
    this.iniciarLoading();
    try
    {
      const dataestadoactualizarusuariodispositivo = await this.actualizarUsuarioDispositivo();//Dispositivo 1
      if (dataestadoactualizarusuariodispositivo.estado)
      {
        await this.actualizarUsuarioLocal();

        if(this.monitor_actividades=="1")
        {
          this.actualizarUsuarioActividadesDispositivo();
        }

        if(this.compartido_extension=="1")
        {
          const dataestadoactualizarusuariodispositivo2 = await this.actualizarUsuarioDispositivoSecundario();
          if (dataestadoactualizarusuariodispositivo2.estado)
          {
            
          }
        }
      }
       
    } catch (e) {

    } finally {
      Swal.close();
    }
  }

  clickEditardatosfoto(item: any)
  {
    this.emparejareditar = false;
    this.numero_usuario = "NA";
    this.cod_cliente = item.cod_cliente;
    this.cliente = item.nombre + " " + item.apellido;
    this.itemcliente = {
        'cod_cliente' : item.cod_cliente,
        'cliente' : item.nombre + " " + item.apellido,
        'identificacion' : item.cedula,
        'tipo_usuario' : item.tipo_usuario_gym
    };
    this.urlfoto = this.configService.settings.baseUrl + "/gym/imagen_usuario/" + this.cod_cliente + ".jpg?t=" + new Date().getTime();
    this.buscarUsuarioGymCodigoSucursal();
  }

  async buscarUsuarioGymCodigoSucursal()
  {
    this.infousuariodispositivo1 = "";
    this.infousuariodispositivo2 = "";
    this.usuariodispositivo1 = false;
    this.usuariodispositivo2 = false;
    this.iniciarLoading();

    this.sociossrvice.buscarUsuarioGymCodigoSucursal(String(this.cod_cliente), this.cod_sucursal).subscribe( async (data : any) =>
    {
      if(data.cod_cliente!=false)
      {
        this.emparejareditar=true;
        this.numero_usuario = data.numero_usuario;
        this.itemcliente = {
          'cod_cliente' : data.cod_cliente,
          'cliente' : data.nombre + " " + data.apellido,
          'identificacion' : data.cedula,
          'tipo_usuario' : data.tipo_usuario_gym
        };
        

        if(this.compartido_extension=="1")
        {
          const usuario = await this.buscarUsuarioDispositivo(this.numero_usuario);
          if(usuario==1)
          {
            this.infousuariodispositivo1 = "Usuario Emparejado Dispositivo 1";
            this.usuariodispositivo1 = true;
          }

          if(usuario==2)
          {
            this.infousuariodispositivo1 = "Sin Registro de Usuario Dispositivo 1";
            this.usuariodispositivo1 = false;
          }

          const usuario2 = await this.buscarUsuarioDispositivoSecundario(this.numero_usuario);
          Swal.close();
          if(usuario2==1)
          {
            this.infousuariodispositivo2 = "Usuario Emparejado Dispositivo 2";
            this.usuariodispositivo2 = true;
          }

          if(usuario2==2)
          {
            this.infousuariodispositivo2 = "Sin Registro de Usuario Dispositivo 2";
            this.usuariodispositivo2 = false;
          }

          if((usuario == 1 || usuario == 2) && (usuario2 == 1 || usuario2 == 2))
          {
            $("#mymodaleditardatosfoto").modal("show");
          }
          else
          {
            if(usuario==3)
            {
              this.infousuariodispositivo1 = "Dispositivo 1 desconectado";
              this.usuariodispositivo1 = false;
              Swal.fire({
                title: "Control del Sistema",
                text: "No se puede conectar con el dispositivo 1, se necesita que el dispositivo este conectado o encendido para enviar la foto del usuario",
                icon: "error",
                confirmButtonText: 'OK',
                allowEscapeKey: false,
                allowOutsideClick: false
              }).then( (result) => {
                if (result.value) {
                  if(usuario2==3)
                  {
                    this.infousuariodispositivo2 = "Dispositivo 2 desconectado";
                    this.usuariodispositivo2 = false;
                    this.modalConfirmacion2editar();
                  }
                  else
                  {
                    $("#mymodaleditardatosfoto").modal("show");
                  }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  
                }
              });
            }
            else
            {
              this.infousuariodispositivo2 = "Dispositivo 2 desconectado";
              this.usuariodispositivo2 = false;
              this.modalConfirmacion2editar();
            }
          }
        }
        else
        {
          const usuario = await this.buscarUsuarioDispositivo(this.numero_usuario);
          Swal.close();
          if(usuario==1)
          {
            this.infousuariodispositivo1 = "Usuario Emparejado Dispositivo 1";
            this.usuariodispositivo1 = true;
            $("#mymodaleditardatosfoto").modal("show");
          }

          if(usuario==2)
          {
            this.infousuariodispositivo1 = "Sin Registro de Usuario Dispositivo 1";
            this.usuariodispositivo1 = false;
            $("#mymodaleditardatosfoto").modal("show");
          }

          if(usuario==3)
          {
            this.infousuariodispositivo1 = "Dispositivo 1 desconectado";
            this.usuariodispositivo1 = false;
            Swal.fire({
              title: "Control del Sistema",
              text: "No se puede conectar con el dispositivo, se necesita que el dispositivo este conectado o encendido para enviar la foto del usuario",
              icon: "error",
              confirmButtonText: 'OK',
              allowEscapeKey: false,
              allowOutsideClick: false
            }).then( (result) => {
              if (result.value) {
                $("#mymodaleditardatosfoto").modal("show");
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                
              }
            });
          }
        }
      }
      else
      {
        //Importar
          const usuario = await this.buscarUsuarioDispositivo("1");
          Swal.close();
          if(usuario==1)
          {
            this.infousuariodispositivo1 = "Usuario Emparejado Dispositivo 1";
            this.usuariodispositivo1 = true;
            $("#mymodaleditardatosfoto").modal("show");
          }

          if(usuario==2)
          {
            this.infousuariodispositivo1 = "Sin Registro de Usuario Dispositivo 1";
            this.usuariodispositivo1 = false;
            $("#mymodaleditardatosfoto").modal("show");
          }

          if(usuario==3)
          {
            this.infousuariodispositivo1 = "Dispositivo 1 desconectado";
            this.usuariodispositivo1 = false;
            Swal.fire({
              title: "Control del Sistema",
              text: "No se puede conectar con el dispositivo, se necesita que el dispositivo este conectado o encendido para enviar la foto del usuario",
              icon: "error",
              confirmButtonText: 'OK',
              allowEscapeKey: false,
              allowOutsideClick: false
            }).then( (result) => {
              if (result.value) {
                $("#mymodaleditardatosfoto").modal("show");
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                
              }
            });
          }
      }
    }, err => {
      Swal.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  modalConfirmacion2editar()
  {
    Swal.fire({
        title: 'Información de dispositivo 2',
        text: 'El dispositivo se encuentra desconectado, procede continuar con el registro aunque el dispositivo este apagado',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Si, Continuar',
        cancelButtonText: 'No, Continuar'
      }).then((result) => {
        if (result.value) {
          $("#mymodaleditardatosfoto").modal("show");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
  }

}
