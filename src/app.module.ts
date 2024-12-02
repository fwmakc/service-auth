import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDbConfig } from '@config/db.config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { AuthModule } from '@src/auth/auth.module';
import { AuthConfirmModule } from '@src/auth_confirm/auth_confirm.module';
import { AuthSessionsModule } from '@src/auth_sessions/auth_sessions.module';
import { AuthStrategiesModule } from '@src/auth_strategies/auth_strategies.module';
import { ClientsModule } from '@src/clients/clients.module';
import { ClientsRedirectsModule } from '@src/clients_redirects/clients_redirects.module';
import { MailModule } from '@src/mail/mail.module';
import { RandomModule } from '@src/random/random.module';
import { TokenModule } from '@src/token/token.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDbConfig,
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    AuthConfirmModule,
    AuthSessionsModule,
    AuthStrategiesModule,
    ClientsModule,
    ClientsRedirectsModule,
    MailModule,
    RandomModule,
    TokenModule,
  ],
  providers: [AppService],
})
export class AppModule {}
