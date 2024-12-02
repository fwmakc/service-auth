import { Args, Query } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { PrivateDto } from '@src/common/dto/private.dto';
import { PrivateEntity } from '@src/common/entity/private.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { CommonEntity } from '@src/common/common.entity';
import { CommonDto } from '@src/common/common.dto';

export const PrivateResolver = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  authKey: string = '',
) => {
  class BasePrivateResolver<
    Service extends CommonService<Entity, Dto>,
    Entity extends PrivateEntity | CommonEntity,
    Dto extends PrivateDto | CommonDto
  > extends ProtectedResolver(
    name,
    classEntity,
    classDto,
  )<
    Service,
    Entity,
    Dto
  > {
    readonly service: Service;

    @Auth('gql')
    @Query(() => [classEntity], { name: `${name}Find` })
    async find(
      @Args('where', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      where: object,
      @Args('order', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      order: object,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      return await this.service.find(where, order, relationsDto, authId, authKey);
    }

    @Auth('gql')
    @Query(() => classEntity, { name: `${name}FindOne` })
    async findOne(
      @Args('id')
      id: number,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      return await this.service.findOne(id, relationsDto, authId, authKey);
    }

    @Auth('gql')
    @Query(() => classEntity, { name: `${name}First` })
    async first(
      @Args('where', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      where: object,
      @Args('order', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      order: object,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      return await this.service.first(where, order, relationsDto, authId, authKey);
    }

    @Auth('gql')
    @Query(() => [classEntity], { name: `${name}Many` })
    async many(
      @Args('ids', { type: () => [Number || String] })
      ids: Array<number | string>,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : (!authKey ? auth.id : auth[authKey].id);
      return await this.service.many(ids, relationsDto, authId, authKey);
    }

    @Auth('gql')
    @Query(() => classEntity, { name: `${name}Self` })
    async self(
      @Args('where', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      where: object,
      @Args('order', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      order: object,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = !authKey ? auth.id : auth[authKey].id;
      return await this.service.find(where, order, relationsDto, authId, authKey);
    }
  }
}
