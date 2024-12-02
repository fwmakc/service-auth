import { BadRequestException } from '@nestjs/common';
import { DeepPartial, FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';

export class CommonService<
  Entity extends CommonEntity,
  Dto extends CommonDto
> {
  protected readonly repository: Repository<Entity>;

  async find(
    where: FindOptionsWhere<any> = undefined,
    order: FindOptionsOrder<any> = { id: 'ASC' },
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<Entity[]> {
    if (authId !== undefined) {
      const auth = { id: authId };
      where = { ...where };
      where[authKey || 'auth'] = auth;
    }
    try {
      return await this.repository.find({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async findAll(
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<Entity[]> {
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    const where: FindOptionsWhere<any> = {};
    if (authId !== undefined) {
      const auth = { id: authId };
      where[authKey || 'auth'] = auth;
    }
    try {
      return await this.repository.find({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async first(
    where: FindOptionsWhere<any> = undefined,
    order: FindOptionsOrder<any> = { id: 'ASC' },
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<Entity> {
    if (authId !== undefined) {
      const auth = { id: authId };
      where = { ...where };
      where[authKey || 'auth'] = auth;
    }
    try {
      const [ result ] = await this.repository.find({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
        take: 1,
      });
      return result;
      // return await this.repository.findOne({
      //   relations: relationsDto?.map(i => i.name),
      //   order,
      //   where,
      // });
    }
    catch (e) {
      this.error(e);
    }
  }

  async many(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<Entity[]> {
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    const where: FindOptionsWhere<any> = { id: In(ids?.map(i => Number(i) || 0)) };
    if (authId !== undefined) {
      const auth = { id: authId };
      where[authKey || 'auth'] = auth;
    }
    try {
      return await this.repository.find({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async findOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<Entity> {
    const where: FindOptionsWhere<any> = { id };
    if (authId !== undefined) {
      const auth = { id: authId };
      where[authKey || 'auth'] = auth;
    }
    try {
      return await this.repository.findOne({
        relations: relationsDto?.map(i => i.name),
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async create(
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<Entity> {
    delete dto.createdAt;
    delete dto.updatedAt;
    const entry: DeepPartial<any> = { ...dto };
    if (entry.id) {
      entry.id = `${entry.id}`;
    }
    if (authId !== undefined) {
      const auth = { id: authId };
      entry[authKey || 'auth'] = auth;
    }
    try {
      const created = await this.repository.save(entry);
      return await this.findOne(created.id, relationsDto, authId);
    }
    catch (e) {
      this.error(e);
    }
  }

  async update(
    id: number,
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<Entity> {
    if (id === undefined) {
      return;
    }

    const where: FindOptionsWhere<any> = { id };
    if (authId !== undefined) {
      const auth = { id: authId };
      where[authKey || 'auth'] = auth;
    }
    const find = await this.repository.findOne({
      where,
    });
    if (!find) {
      return;
    }

    dto.id = id;
    const entry: DeepPartial<any> = { ...dto };
    if (entry.id) {
      entry.id = `${entry.id}`;
    }

    try {
      await this.updateRelations(entry, relationsDto, authId);
      await this.repository.update({ id: entry.id }, entry);
      return await this.findOne(entry.id, relationsDto, authId);
      // const created = await this.repository.save(entry);
      // return await this.findOne(created.id, relationsDto, authId);
    }
    catch (e) {
      this.error(e);
    }
  }

  async remove(
    id: number,
    authId: number = undefined,
    authKey: string = '',
  ): Promise<boolean> {
    const where: FindOptionsWhere<any> = { id };
    if (authId !== undefined) {
      const auth = { id: authId };
      where[authKey || 'auth'] = auth;
    }
    try {
      const result = await this.repository.delete(where);
      return !!result?.affected;
    }
    catch (e) {
      this.error(e);
    }
  }

  async updateRelations (entry, relationsDto, authId) {
    if (!relationsDto?.length) {
      return;
    }

    const relationEntries = [];

    for (const relation of relationsDto) {
      const { name } = relation;
      if (entry[name]) {
        relationEntries.push({
          name,
          data: entry[name],
        });
        delete entry[name];
      }
    }

    if (!relationEntries.length) {
      return;
    }

    const result = await this.findOne(entry.id, relationsDto, authId);

    for (const relationEntry of relationEntries) {
      const { name, data } = relationEntry;
      const r = result[name];

      if (r?.length) {
        for (const val of r.entries()) {
          const type = val.constructor.name;
          const item = data.filter(i => `${i.id}` === `${val.id}`)?.[0];
          if (item) {
            const subRepository = this.repository.manager.getRepository(`${type}`);
            await subRepository.update({ id: item.id }, item);
          }
        }
      } else {
        const type = r.constructor.name;
        const subRepository = this.repository.manager.getRepository(`${type}`);
        await subRepository.update({ id: r.id }, relationEntry.data);
      }
    }
  }

  error(e) {
    throw new BadRequestException(`Incorrect request conditions: ${e.message}`);
  }
}
