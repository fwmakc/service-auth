import { Field, InputType } from '@nestjs/graphql';
import { ProtectedDto } from '@src/common/dto/protected.dto';

@InputType()
export class AuthConfirmDto extends ProtectedDto {
  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  type: string;
}
