import { Injectable, BadRequestException } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { AuthService } from '@src/auth/auth.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class PasswordGrantsService {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async password(grantsDto: GrantsDto): Promise<any> {
    console.log('-- password', grantsDto);
    if (grantsDto.grant_type !== 'password') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsDto.username
      || !grantsDto.password
    ) {
      throw new BadRequestException('Not specified username or password in this request', 'invalid_grant');
    }
    const { username, password } = grantsDto;
    const auth = await this.authService.login({ username, password });
    const token = await this.tokenService.pair({ id: auth.id });
    if (!token) {
      throw new BadRequestException('User authentication failed. Unknown user', 'invalid_user');
    }
    // if (request) {
    //   await this.sessionsService.createSession(auth, token, request);
    // }
    console.log('-- auth', auth);
    return await this.tokenService.prepare(token, grantsDto.state);
  }
}
