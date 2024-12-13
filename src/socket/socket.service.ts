import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);
    socket.emit('users', this.connectedClients);
  }

  sendMessageToClient(clientId: string, message: string): void {
    const clientSocket = this.connectedClients.get(clientId);
    if (clientSocket) {
      clientSocket.emit('message', message);
    } else {
      console.error(`Cliente ${clientId} não encontrado`);
    }
  }

  broadcastMessage(message: string): void {
    this.connectedClients.forEach((clientSocket) => {
      clientSocket.emit('broadcast', message);
    });
  }

  getConnectedClients(): string[] {
    return Array.from(this.connectedClients.keys());
  }
}
