import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { TypeGrants } from '@src/common/common.enum';

@InputType()
export class GrantsTokenDto extends CommonDto {
  @Field(() => TypeGrants)
  grant_type: TypeGrants;

  @Field({ nullable: true })
  client_id?: string;

  @Field({ nullable: true })
  client_secret?: string;

  @Field({ nullable: true })
  client_password?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  refresh_token?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  redirect_uri?: string;

  @Field({ nullable: true })
  state?: string;
}
