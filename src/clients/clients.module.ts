import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from '@src/clients/clients.controller';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsStrategy } from '@src/clients/clients.strategy';
import { ClientsResolver } from '@src/clients/clients.resolver';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from '@src/tokens/tokens.module';

@Module({
  controllers: [ClientsController],
  imports: [
    TypeOrmModule.forFeature([ClientsEntity]),
    forwardRef(() => TokensModule),
    ConfigModule,
  ],
  providers: [
    ClientsService,
    ClientsStrategy,
    ClientsResolver,
  ],
  exports: [ClientsService],
})
export class ClientsModule {}