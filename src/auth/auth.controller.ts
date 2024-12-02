import {
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Auth()
  @Get('self')
  async self(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authService.findOne(id, [{ name: 'strategies' }]);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
