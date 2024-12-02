import { CommonDto } from '@src/common/common.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto extends CommonDto {
  @IsEmail()
  username?: string;

  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  password?: string;

  isActivated?: boolean;

  isSuperuser?: boolean;
}
