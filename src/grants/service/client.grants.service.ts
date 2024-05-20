import { Injectable, BadRequestException } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { ClientsService } from '@src/clients/clients.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class ClientGrantsService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async client(grantsDto: GrantsDto): Promise<any> {
    const { refresh_token, client_id, client_secret } = grantsDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    });
    if (!client || !client_id || !client_secret) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const token = await this.tokenService.refresh(
      refresh_token,
      (data) => data.client_id === client_id,
    );
    return await this.tokenService.prepare(token, grantsDto.state);
  }
}
