import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { JwtClientsGuard } from '@src/clients/guard/jwt.clients.guard';

export const Client = () => {
  return applyDecorators(UseGuards(JwtClientsGuard));
};

export const SelfClient = createParamDecorator(
  async (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
