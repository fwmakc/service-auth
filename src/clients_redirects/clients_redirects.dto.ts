import { CommonDto } from '@src/common/common.dto';
import { ClientsDto } from '@src/clients/clients.dto';

export class ClientsRedirectsDto extends CommonDto {
  uri: string;

  client?: ClientsDto;
}
