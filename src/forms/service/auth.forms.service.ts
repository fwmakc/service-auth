import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from '@src/token/token.service';
import { HelpersFormsService } from '@src/forms/service/helpers.forms.service';
import { TypeGrants } from '@src/common/common.enum';
import { GrantsService } from '@src/grants/grants.service';

@Injectable()
export class AuthFormsService {
  error = {
    error: 'Unauthorized',
    message: 'Unknown error',
  };

  token;

  constructor(
    private readonly tokenService: TokenService,
    private readonly grantsService: GrantsService,
    private readonly helpersService: HelpersFormsService,
  ) {}

  async auth(req, res): Promise<void> {
    const { body } = req;
    const {
      username = '',
      password = '',
      redirect_uri = '',
      client_id = '',
      response_type = '',
    } = body;

    await this.setToken(username, password);

    if (!this.token) {
      return await this.helpersService.redirect(req, res, this.error);
    }

    await this.setCookie(res);

    if (!redirect_uri || !client_id || !response_type) {
      return this.token;
    }
    
    const uri = `/auth?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
    return await this.helpersService.query(req, res, uri);
  }

  async setCookie(res): Promise<void> {
    const access_token = this.token?.access_token;
    if (!access_token) {
      throw new BadRequestException('Specified datas is not valid for generate token', 'do not issue token');
    }
    const tokenParse = await this.tokenService.verify(access_token, 'access');
    res.cookie(
      'id',
      tokenParse.id,
      {
        httpOnly: true,
        secure: false,
      },
    );
    // localStorage.setItem('jwt', access_token);
  }

  async setToken(username, password): Promise<void> {
    this.token = await this.grantsService.password({
      grant_type: TypeGrants.PASSWORD,
      username,
      password,
    })
      .catch((e) => {
        this.error = e?.response;
      });
  }
}
