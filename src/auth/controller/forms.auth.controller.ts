import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth } from '@src/auth/auth.decorator';
import { FormsAuthService } from '@src/auth/service/forms.auth.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';

@Controller('auth')
export class FormsAuthController {
  constructor(
    private readonly formsAuthService: FormsAuthService,
  ) {}

  @Post('change/:code')
  async change(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.change(authDto, code, req, res);
  }

  @Get('confirm/:code')
  async confirm(
    @Param('code') code: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.confirm(code, req, res);
  }  

  @Post('login')
  async login(
    @Body() grantsTokenDto: GrantsTokenDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.login(grantsTokenDto, req, res);
  }

  @Auth()
  @Post('logout')
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.logout(req, res);
  }

  @Post('register')
  async register(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.register(authDto, subject, req, res);
  }

  @Post('reset')
  async reset(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.reset(authDto, subject, req, res);
  }
}
