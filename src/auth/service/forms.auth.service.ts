import { Injectable } from '@nestjs/common';
import { ChangeAuthHandler } from '@src/auth/handler/change.auth.handler';
import { ConfirmAuthHandler } from '@src/auth/handler/confirm.auth.handler';
import { LogoutAuthHandler } from '@src/auth/handler/logout.auth.handler';
import { RegisterAuthHandler } from '@src/auth/handler/register.auth.handler';
import { ResetAuthHandler } from '@src/auth/handler/reset.auth.handler';
import { AuthDto } from '@src/auth/auth.dto';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { GrantsTokenService } from '@src/token/service/grants.token.service';
import { ConfigService } from '@nestjs/config';
import { OpenAuthService } from './open.auth.service';

@Injectable()
export class FormsAuthService {
  constructor(
    private readonly configService: ConfigService,
    protected readonly changeAuthHandler: ChangeAuthHandler,
    protected readonly confirmAuthHandler: ConfirmAuthHandler,
    protected readonly logoutAuthHandler: LogoutAuthHandler,
    protected readonly registerAuthHandler: RegisterAuthHandler,
    protected readonly resetAuthHandler: ResetAuthHandler,
    protected readonly grantsTokenService: GrantsTokenService,
    protected readonly openAuthService: OpenAuthService,
  ) {}

  async change(authDto: AuthDto, code: string, req, res): Promise<any> {
    let error;
    const result = await this.changeAuthHandler.change(authDto, code)
      .catch((e) => {
        error = e?.response;
      });
    if (!result) {
      return await this.redirectError(error);
    }
    const url = this.configService.get('FORM_CHANGE_COMPLETE');
    return await res.redirect(url);
  }

  async confirm(code: string, req, res): Promise<any> {
    let error = {
      error: 'Bad request',
      message: 'Invalid confirm code',
    };
    const result = await this.confirmAuthHandler.confirm(code)
      .catch((e) => {
        error = e?.response;
      });
    if (!result) {
      return await this.redirectError(error);
    }
    const url = this.configService.get('FORM_CONFIRM_COMPLETE');
    return await res.redirect(url);
  }

  async login(grantsTokenDto: GrantsTokenDto, req, res): Promise<any> {
    let error = {
      error: 'Unauthorized',
      message: 'Unknown error',
    };
    const token = await this.grantsTokenService.password(grantsTokenDto, req, res)
      .catch((e) => {
        error = e?.response;
      });
    if (!token) {
      return await this.redirectError(error);
    }
    return token;
  }

  async logout(req, res): Promise<any> {
    let error;
    const result = await this.logoutAuthHandler.logout(req)
      .catch((e) => {
        error = e?.response;
      });
    if (!result) {
      return await this.redirectError(error);
    }
    const url = this.configService.get('FORM_LOGIN');
    return await res.redirect(url);
  }

  async register(authDto: AuthDto, subject: string, req, res): Promise<any> {
    let error;
    const auth = await this.registerAuthHandler.authCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!auth) {
      return await this.redirectError(error);
    }
    await this.registerAuthHandler.sendMail(auth, subject);
    const url = this.configService.get('FORM_REGISTER_COMPLETE');
    return await res.redirect(url);
  }

  async reset(authDto: AuthDto, subject: string, req, res): Promise<any> {
    let error;
    const confirm = await this.resetAuthHandler.confirmCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!confirm?.code) {
      return await this.redirectError(error);
    }
    await this.resetAuthHandler.sendMail(authDto.username, subject, confirm.code);
    const url = this.configService.get('FORM_RESET_COMPLETE');
    return await res.redirect(url);
  }

  async redirectError(error = undefined) {
    if (!error) {
      error = {
        error: 'Bad request',
        message: 'Unknown error',
      };
    }

    const errorArray = [];
    for (const [key, value] of Object.entries({ ...error })) {
      errorArray.push(`${key}=${ encodeURI(`${value}`) }`);
    }

    const url = this.configService.get('FORM_LOGIN');
    return `${url}?${errorArray.join('&')}`;
  }
}
