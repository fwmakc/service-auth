import { CommonDto } from '@src/common/common.dto';
import { TypeGrants } from '@src/common/common.enum';

export class GrantsTokenDto extends CommonDto {
  grant_type: TypeGrants;

  client_id?: string;

  client_secret?: string;

  client_password?: string;

  username?: string;

  password?: string;

  refresh_token?: string;

  code?: string;

  redirect_uri?: string;

  state?: string;
}
