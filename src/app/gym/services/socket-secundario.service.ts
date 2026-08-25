import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketSecundarioService {

  private socket!: Socket;

  private estadoConexion$ = new BehaviorSubject<boolean>(false);

  conectar() {
    if (this.socket && this.socket.connected) {
      return;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
    }

    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true, //Se conecta y se desconecta a los 5 intentos
      reconnection: true,
      reconnectionAttempts: 5, //5 Intentos máximo de reconeción
      reconnectionDelay: 3000 //3 Segundon intenta en reconectarse
    });

    this.socket.on('connect', () => {
      console.log('Socket conectado');
      this.estadoConexion$.next(true);
    });

    this.socket.on('disconnect', () => {
      console.warn('Socket desconectado');
      this.estadoConexion$.next(false);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Error de conexión socket', err.message);
      this.estadoConexion$.next(false);
    });
  }

  escucharEstadoConexion(): Observable<boolean> {
    return this.estadoConexion$.asObservable();
  }

  escucharEventoRostro(): Observable<any> {
    return new Observable(observer => {
      if (!this.socket) return;

      this.socket.on('evento-rostro', (data) => {
        observer.next(data);
      });
    });
  }

  desconectar() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
      this.socket = null as any;
      this.estadoConexion$.next(false);
    }
  }
}