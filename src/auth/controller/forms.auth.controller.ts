import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Data } from '@src/common/common.decorator';
import { CommonDoc } from '@src/common/common.doc';
import { FormsAuthService } from '@src/auth/service/forms.auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class FormsAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly formsAuthService: FormsAuthService,
  ) {}

  @Post('change')
  @CommonDoc({
    title: 'Смена пароля пользователя',
    models: [],
    params: [{
      name: 'code',
      required: true,
      description: 'Код подтверждения',
    }],
      queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей регистрации',
      type: '[AuthDto]',
      example: [{ password: '...' }],
    }],
  })
  async change(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.change(req, res);
  }

  @Post('confirm')
  @CommonDoc({
    title: 'Подтверждение регистрации и активация учетной записи',
    models: [],
    params: [{
      name: 'code',
      required: true,
      description: 'Код подтверждения',
    }],
  })
  async confirm(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.confirm(req, res);
  }  

  @Post('login')
  @CommonDoc({
    title: 'Авторизация',
    models: [],
    queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей авторизации',
      type: '[AuthDto]',
      example: { username: '...', password: '...' },
    }],
  })
  async login(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.login(req, res);
  }

  @Auth()
  @Post('logout')
  @CommonDoc({
    title: 'Выход',
    models: [],
  })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.register(req, res);
  }

  @Post('register')
  @CommonDoc({
    title: 'Регистрация',
    models: [],
    queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей регистрации',
      type: '[AuthDto]',
      example: { username: '...', password: '...' },
    }],
  })
  async register(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.register(req, res);
  }

  @Post('restore')
  @CommonDoc({
    title: 'Запрос на смену пароля пользователя',
    models: [],
    queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей регистрации',
      type: '[AuthDto]',
      example: [{ username: '...' }],
    }],
  })
  async restore(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.restore(req, res);
  }

  @Auth()
  @Get('self')
  @ApiExcludeEndpoint()
  async self(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authService.findOne(id, [{ name: 'users' }, { name: 'strategies' }]);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  /*
  // old

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('xregister')
  async xregister(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Get('xconfirm/:code')
  async xconfirm(
    @Param('code') code: string,
  ) {
    return this.authService.confirm(code);
  }

  @Post('xrestore')
  async xrestorePrepare(@Body() authDto: AuthDto) {
    return this.authService.restorePrepare(authDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('xrestore/:code')
  async xrestore(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
  ) {
    return this.authService.restore(authDto, code);
  }

  @Auth()
  @HttpCode(200)
  @Post('xlogout')
  async xlogout(@Req() req: any) {
    return this.authService.logout(req);
  }

  // new

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('zregister')
  async zregister(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Get('zconfirm/:code')
  async zconfirm(
    @Param('code') code: string,
  ) {
    return this.authService.confirm(code);
  }

  @Post('zrestore')
  async zrestorePrepare(@Body() authDto: AuthDto) {
    return this.authService.restorePrepare(authDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('zrestore/:code')
  async zrestore(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
  ) {
    return this.authService.restore(authDto, code);
  }

  @Auth()
  @HttpCode(200)
  @Post('zlogout')
  async zlogout(@Req() req: any) {
    return this.authService.logout(req);
  }
  */
}
