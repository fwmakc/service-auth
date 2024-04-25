import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from "@nestjs/swagger";
import { CommonDto } from '@src/common/dto/common.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';
// import { RolesDto } from '@src/roles/roles.dto';
// import { ClientsDto } from '@src/clients/clients.dto';
// import { TokensDto } from '@src/tokens/tokens.dto';
// import { StrategiesDto } from '@src/strategies/strategies.dto';

@InputType()
export class AuthDto extends CommonDto {
  @Field()
  @IsEmail()
  @ApiProperty({
    required: true,
    description: 'Имя пользователя, обычно здесь используется email',
  })
  username?: string;

  @Field({ nullable: true })
  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Пароль, заданный пользователем',
  })
  password?: string;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Флаг, который показывает является ли учетная запись пользователя активированной. Например, подтвержденной по email.',
  })
  @Field({ nullable: true, defaultValue: false })
  isActivated?: boolean;

  // @Field(() => [RolesDto], { nullable: true })
  // roles?: RolesDto[];

  // @Field(() => [ClientsDto], { nullable: true })
  // clients?: ClientsDto[];

  // @ApiProperty({
  //   required: false,
  //   description: 'Данные записи tokens',
  // })
  // @Field({ nullable: true })
  // tokens?: TokensDto;

  // @ApiProperty({
  //   required: false,
  //   description: 'Данные записи strategies',
  // })
  // @Field({ nullable: true })
  // strategies?: StrategiesDto;
}
