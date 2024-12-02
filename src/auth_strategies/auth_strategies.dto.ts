import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { AuthDto } from '@src/auth/auth.dto';

@InputType()
export class AuthStrategiesDto extends CommonDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  uid?: string;

  @Field({ nullable: true })
  json?: string;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
