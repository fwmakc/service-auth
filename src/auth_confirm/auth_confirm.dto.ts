import { ProtectedDto } from '@src/common/dto/protected.dto';

export class AuthConfirmDto extends ProtectedDto {
  code: string;

  type: string;
}
