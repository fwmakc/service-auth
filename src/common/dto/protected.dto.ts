import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { AuthDto } from '@src/auth/auth.dto';

@InputType()
export class ProtectedDto extends CommonDto  {
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
