import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    console.log(`Client connected: ${clientId}`);

    socket.on('message', (data: { to: string; message: string }) => {
      console.log(`Received message from ${clientId}:`, data);
      this.sendMessageToClient(data.to, data.message);
    });

    socket.on('broadcast', (message: string) => {
      console.log(`Broadcasting message from ${clientId}:`, message);
      this.broadcastMessage(message);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${clientId}`);
      this.connectedClients.delete(clientId);
    });
  }

  sendMessageToClient(clientId: string, message: string): void {
    const clientSocket = this.connectedClients.get(clientId);
    if (clientSocket) {
      clientSocket.emit('message', message);
      console.log(`Sent message to client ${clientId}:`, message);
    } else {
      console.error(`Client ${clientId} not found`);
    }
  }

  broadcastMessage(message: string): void {
    this.connectedClients.forEach((clientSocket, clientId) => {
      clientSocket.emit('broadcast', message);
      console.log(`Broadcasted message to client ${clientId}:`, message);
    });
  }

  getConnectedClients(): string[] {
    return Array.from(this.connectedClients.keys());
  }
}
