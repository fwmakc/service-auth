import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { TypeResponses } from '@src/common/common.enum';

@InputType()
export class OpenAuthDto extends CommonDto {
  @Field(() => TypeResponses)
  response_type: TypeResponses;

  @Field()
  client_id: string;

  @Field()
  redirect_uri: string;

  @Field()
  state: string;
}
