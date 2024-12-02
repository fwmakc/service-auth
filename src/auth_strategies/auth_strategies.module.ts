import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { AuthSessionsModule } from '@src/auth_sessions/auth_sessions.module';
import { AuthStrategiesEntity } from '@src/auth_strategies/auth_strategies.entity';
import { AuthStrategiesService } from '@src/auth_strategies/auth_strategies.service';
import { AuthStrategiesController } from '@src/auth_strategies/auth_strategies.controller';
import { TokenModule } from '@src/token/token.module';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from '@src/auth_strategies/serializer/session.serializer';
import { GoogleStrategy } from '@src/auth_strategies/strategy/google.strategy';
import { LeaderStrategy } from '@src/auth_strategies/strategy/leader.strategy';
import { LeaderProvider } from '@src/auth_strategies/provider/leader.provider';
import { UntiStrategy } from '@src/auth_strategies/strategy/unti.strategy';
import { UntiProvider } from '@src/auth_strategies/provider/unti.provider';
import { OauthStrategy } from '@src/auth_strategies/strategy/oauth.strategy';
import { OauthProvider } from '@src/auth_strategies/provider/oauth.provider';

@Module({
  controllers: [AuthStrategiesController],
  imports: [
    TypeOrmModule.forFeature([AuthStrategiesEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => AuthSessionsModule),
    forwardRef(() => TokenModule),
    ConfigModule,
  ],
  providers: [
    SessionSerializer,
    AuthStrategiesService,
    GoogleStrategy,
    LeaderProvider,
    LeaderStrategy,
    UntiProvider,
    UntiStrategy,
    OauthStrategy,
    OauthProvider,
  ],
  exports: [AuthStrategiesService],
})
export class AuthStrategiesModule {}
