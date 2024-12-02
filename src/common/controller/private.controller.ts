import {
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Type,
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { PrivateDto } from '@src/common/dto/private.dto';
import { PrivateEntity } from '@src/common/entity/private.entity';
import { OptionsDto } from '@src/common/dto/options.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Data } from '@src/common/common.decorator';
import { CommonEntity } from '@src/common/common.entity';
import { CommonDto } from '@src/common/common.dto';

export const PrivateController = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  authKey: string = '',
) => {
  class BasePrivateController<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends PrivateEntity | CommonEntity,
    Dto extends PrivateDto | CommonDto,
    Filter
  > extends ProtectedController(
    name,
    classEntity,
    classDto,
  )<
    Service,
    Entity,
    Dto,
    Filter
  > {
    readonly service: Service;

    @Auth()
    @Get('find')
    async find(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      return await this.service.find(where, order, relationsDto, authId, authKey);
    }

    @Auth()
    @Get('find/:id')
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      const result = await this.service.findOne(Number(id), relationsDto, authId, authKey);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Auth()
    @Get('first')
    async first(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      return await this.service.first(where, order, relationsDto, authId, authKey);
    }

    @Auth()
    @Get('many/:ids')
    async many(
      @Param('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: Array<number>,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      const result = await this.service.many(ids, relationsDto, authId, authKey);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Auth()
    @Get('self')
    async self(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = !authKey ? auth.id : auth[authKey].id;
      return await this.service.find(where, order, relationsDto, authId, authKey);
    }

    @Auth()
    @Get('filter')
    async filter(
      @Data('where') dto: Dto,
      @Data('search') searchDto: SearchDto,
      @Data('options') optionsDto: OptionsDto,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Filter[]> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      const result = await this.service.filter(
        dto,
        searchDto,
        optionsDto,
        relationsDto,
        authId,
        authKey,
      );
      if (!result) {
        throw new NotFoundException('Any results not found');
      }
      return result;
    }
  }
  return BasePrivateController;
}
