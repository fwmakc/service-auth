import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from '@src/clients/clients.controller';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsStrategy } from '@src/clients/clients.strategy';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from '@src/token/token.module';
// import { AuthModule } from '@src/auth/auth.module';
import { ClientsRedirectsModule } from '@src/clients_redirects/clients_redirects.module';

@Module({
  controllers: [
    ClientsController,
  ],
  imports: [
    TypeOrmModule.forFeature([ClientsEntity]),
    // forwardRef(() => AuthModule),
    forwardRef(() => ClientsRedirectsModule),
    forwardRef(() => TokenModule),
    ConfigModule,
  ],
  providers: [
    ClientsService,
    ClientsStrategy,
  ],
  exports: [
    ClientsService,
  ],
})
export class ClientsModule {}
