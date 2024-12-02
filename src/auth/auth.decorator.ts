import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/guard/jwt.auth.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};

export const Self = createParamDecorator(
  async (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    if (!user || user?.id === undefined) {
      throw new ForbiddenException('You have no rights!');
    }
    return user;
  },
);
