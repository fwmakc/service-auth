import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class AuthDto extends CommonDto {
  @Field()
  @IsEmail()
  username?: string;

  @Field({ nullable: true })
  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  password?: string;

  @Field({ nullable: true, defaultValue: false })
  isActivated?: boolean;

  @Field({ nullable: true, defaultValue: false })
  isSuperuser?: boolean;
}
