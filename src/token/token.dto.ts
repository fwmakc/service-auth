import { IsString } from 'class-validator';
import { CommonDto } from '@src/common/common.dto';

export class TokenDto extends CommonDto {
  access_token?: string;

  expires_in?: number;

  @IsString({
    message: 'You did not pass refresh token or it is not a string!',
  })
  refresh_token?: string;
}
