import { CommonDto } from '@src/common/common.dto';
import { AuthDto } from '@src/auth/auth.dto';

export class AuthStrategiesDto extends CommonDto {
  name?: string;

  uid?: string;

  json?: string;

  accessToken?: string;

  refreshToken?: string;

  auth?: AuthDto;
}
