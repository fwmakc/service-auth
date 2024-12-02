import { CommonDto } from '@src/common/common.dto';
import { AuthDto } from '@src/auth/auth.dto';

export class ProtectedDto extends CommonDto  {
  auth?: AuthDto;
}
