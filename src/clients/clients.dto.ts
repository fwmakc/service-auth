import { ProtectedDto } from '@src/common/dto/protected.dto';
import { TypeClients } from '@src/common/common.enum';
import { ClientsRedirectsDto } from '@src/clients_redirects/clients_redirects.dto';

export class ClientsDto extends ProtectedDto {
  client_id?: string;

  client_secret?: string;

  client_password?: string;

  client_type?: TypeClients;

  title?: string;

  description?: string;

  client_uri?: string;

  redirect_uri?: string;

  code?: string;

  publishedAt?: Date;

  isPublished?: boolean;

  redirects?: ClientsRedirectsDto[];
}
