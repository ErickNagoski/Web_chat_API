import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [SocketModule, MongooseModule.forRoot('mongodb://root:root@localhost:27017', {
    dbName: 'web_chat', // Nome do banco de dados
  }), UserModule, AuthModule, MessagesModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
