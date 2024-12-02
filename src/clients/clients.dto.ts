import { Field, InputType } from '@nestjs/graphql';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { TypeClients } from '@src/common/common.enum';
import { ClientsRedirectsDto } from '@src/clients_redirects/clients_redirects.dto';

@InputType()
export class ClientsDto extends ProtectedDto {
  @Field({ nullable: true })
  client_id?: string;

  @Field({ nullable: true })
  client_secret?: string;

  @Field({ nullable: true })
  client_password?: string;

  @Field(() => TypeClients, {
    nullable: true,
    defaultValue: TypeClients.DEFAULT,
  })
  client_type?: TypeClients;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  client_uri?: string;

  @Field({ nullable: true })
  redirect_uri?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field(() => [ClientsRedirectsDto], { nullable: true })
  redirects?: ClientsRedirectsDto[];
}
