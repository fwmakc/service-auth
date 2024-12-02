import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { ClientsDto } from '@src/clients/clients.dto';

@InputType()
export class ClientsRedirectsDto extends CommonDto {
  @Field({ nullable: true })
  uri: string;

  @Field(() => ClientsDto, { nullable: true })
  client?: ClientsDto;
}
