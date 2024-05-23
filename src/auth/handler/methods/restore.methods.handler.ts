import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class RestoreMethodsHandler {
  constructor(
    protected readonly authConfirmService: AuthConfirmService,
    protected readonly authService: AuthService,
  ) {}

  async restore(authDto: AuthDto): Promise<boolean> {
    const auth = await this.authService.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const confirm = await this.authConfirmService.create(auth, 'restore');
    return !!confirm;
  }
}