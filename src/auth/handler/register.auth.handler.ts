import { BadRequestException, Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { MailService } from '@src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegisterAuthHandler {
  constructor(
    protected readonly authService: AuthService,
    protected readonly authConfirmService: AuthConfirmService,
    protected readonly configService: ConfigService,
    protected readonly mailService: MailService,
  ) {}

  async authCreate(authDto: AuthDto): Promise<AuthEntity> {
    const authExists = await this.authService.findByUsername(authDto.username);
    if (authExists) {
      throw new BadRequestException(
        'User with this username is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);

    // используйте данную строку, если пользователь будет сразу же активирован
    // authDto.isActivated = true;

    return await this.authService.create(authDto);
  }

  async sendMail(auth: AuthDto, subject): Promise<void> {
    const { username } = auth;

    // закомментируйте строки ниже, если пользователь будет сразу же активирован
    // используйте generate чтобы генерировать код из цифр
    const confirm = await this.authConfirmService.create(auth);
    const url = this.configService.get('FORM_CONFIRM');

    await this.mailService.sendTemplate(
      {
        to: username,
        subject,
        template: 'register',
      },
      {
        url: `${url}?code=${confirm.code}`,
      },
    );
  }
}
