import { CommonDto } from '@src/common/common.dto';
import { TypeResponses } from '@src/common/common.enum';

export class OpenAuthDto extends CommonDto {
  response_type: TypeResponses;

  client_id: string;

  redirect_uri: string;

  state: string;
}
