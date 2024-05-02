import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { StrategiesService } from '@src/strategies/strategies.service';
import { StrategiesController } from '@src/strategies/strategies.controller';
import { SessionsModule } from '@src/sessions/sessions.module';
import { TokenModule } from '@src/token/token.module';
import { ConfigModule } from '@nestjs/config';
import { LeaderProvider } from '@src/strategies/provider/leader.provider';
import { UsersModule } from '@src/users/users.module';
import { Id1tStrategy } from '@src/strategies/strategy/id1t.strategy';
import { GoogleStrategy } from '@src/strategies/strategy/google.strategy';
import { LeaderStrategy } from '@src/strategies/strategy/leader.strategy';

@Module({
  controllers: [StrategiesController],
  imports: [
    TypeOrmModule.forFeature([StrategiesEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => SessionsModule),
    forwardRef(() => TokenModule),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    StrategiesService,
    LeaderProvider,
    Id1tStrategy,
    LeaderStrategy,
    GoogleStrategy,
  ],
  exports: [StrategiesService],
})
export class StrategiesModule {}
