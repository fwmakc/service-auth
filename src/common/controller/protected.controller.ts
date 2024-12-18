import {
  Body,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Type,
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { CommonController } from '@src/common/common.controller';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { CommonEntity } from '@src/common/common.entity';
import { CommonDto } from '@src/common/common.dto';

export const ProtectedController = <T extends Type<unknown>>(
  classEntity: T,
  classDto,
  authKey: string = '',
) => {
  class BaseProtectedController<
    Service extends CommonService<Entity, Dto>,
    Entity extends ProtectedEntity | CommonEntity,
    Dto extends ProtectedDto | CommonDto
  > extends CommonController(
    classEntity,
    classDto,
  )<
    Service,
    Entity,
    Dto
  > {
    readonly service: Service;

    @Auth()
    @Post('create')
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = !authKey ? auth.id : auth[authKey].id;
      return await this.service.create(dto, relationsDto, authId, authKey);
    }

    @Auth()
    @Patch('update/:id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body('update') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      const result = await this.service.update(Number(id), dto, relationsDto, authId, authKey);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Auth()
    @Delete('remove/:id')
    async remove(
      @Param('id', ParseIntPipe) id: number,
      @Self() auth: AuthDto,
    ): Promise<boolean> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      return await this.service.remove(id, authId, authKey);
    }
  }
  return BaseProtectedController;
}
