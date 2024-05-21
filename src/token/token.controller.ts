import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonDoc } from '@src/common/common.doc';
import { TokenGrantsDto } from '@src/token_grants/token_grants.dto';
import { TokenGrantsService } from '@src/token_grants/token_grants.service';

@ApiTags('Токены')
@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenGrantsService: TokenGrantsService,
  ) {}

  @Post('/')
  @CommonDoc({
    title: 'Базовый метод получения токена',
    models: [TokenGrantsDto],
    queries: [{
      name: 'tokenGrantsDto',
      required: true,
      description: 'Объект полей запроса токена',
      type: '[TokenGrantsDto]',
      example: [{ grant_type: 'authorization_code', client_id: '...', redirect_uri: '...' }],
    }],
  })
  async token(
    @Body() tokenGrantsDto: TokenGrantsDto,
    @Res({ passthrough: true }) response: any = undefined,
  ): Promise<any> {
    // /token
    // grant_type=authorization_code
    // code=SplxlOBeZQQYbYS6WxSbIA
    // client_id=s6BhdRkqt3
    // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
    if (tokenGrantsDto.grant_type === 'authorization_code') {
      return await this.tokenGrantsService.authorizationCode(tokenGrantsDto);
    }
    // /token
    // grant_type=client_credentials
    // client_id=s6BhdRkqt3
    // client_secret=7Fjfp0ZBr1KtDRbnfVdmIw
    if (tokenGrantsDto.grant_type === 'client_credentials') {
      return await this.tokenGrantsService.clientCredentials(tokenGrantsDto);
    }
    // /token
    // grant_type=password
    // username=johndoe
    // password=A3ddj3w
    if (tokenGrantsDto.grant_type === 'password') {
      return await this.tokenGrantsService.password(tokenGrantsDto);
    }
    // /token
    // grant_type=person_credentials
    // username=johndoe
    // password=A3ddj3w
    if (tokenGrantsDto.grant_type === 'person_credentials') {
      return await this.tokenGrantsService.personCredentials(tokenGrantsDto);
    }
    // /token
    // grant_type=refresh_token
    // refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
    if (tokenGrantsDto.grant_type === 'refresh_token') {
      return await this.tokenGrantsService.refreshToken(tokenGrantsDto);
    }
  }
}
