import { AuthDto } from '@src/auth/auth.dto';
import { CommonDto } from '@src/common/common.dto';

export class AuthSessionsDto extends CommonDto {
  description?: string;

  ip?: string;

  userAgent?: string;

  referrer?: string;

  method?: string;

  locale?: string;

  timezone?: string;

  auth?: AuthDto;
}
