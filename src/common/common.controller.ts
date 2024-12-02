import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Patch,
  Type,
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/common/common.decorator';
import { CommonService } from '@src/common/common.service';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { AuthDto } from '@src/auth/auth.dto';

export const CommonController = <T extends Type<unknown>>(
  classEntity: T,
  classDto,
) => {
  class BaseController<
    Service extends CommonService<Entity, Dto>,
    Entity extends CommonEntity,
    Dto extends CommonDto
  > {
    readonly service: Service;

    @Get('find')
    async find(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity[]> {
      return await this.service.find(where, order, relationsDto);
    }

    @Get('find/:id')
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      const result = await this.service.findOne(Number(id), relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('first')
    async first(
      @Data('where') where: Object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.first(where, order, relationsDto);
    }

    @Get('many/:ids')
    async many(
      @Param('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: Array<number>,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity[]> {
      const result = await this.service.many(ids, relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Post('create')
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto);
    }

    @Patch('update/:id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body('update') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      const result = await this.service.update(Number(id), dto, relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Delete('remove/:id')
    async remove(
      @Param('id', ParseIntPipe) id: number,
      auth: AuthDto = undefined,
    ): Promise<boolean> {
      return await this.service.remove(id);
    }
  }
  return BaseController;
}
