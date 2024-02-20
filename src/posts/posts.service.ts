import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';
import { CategoriesService } from '@src/categories/categories.service';
import { TagsService } from '@src/tags/tags.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/services/common.service';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoriesService: CategoriesService,
    private readonly tagsService: TagsService,
  ) {}

  async postsGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<PostsEntity[]> {
    return await this.postsRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async postsGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<PostsEntity> {
    return await this.postsRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async postsGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<PostsEntity[]> {
    return await this.postsRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async postsFilter(
    postsDto: PostsDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<PostsFilter[]> {
    const { root } = commonEntityGetParams(PostsEntity);
    const query = this.postsRepository.createQueryBuilder(root);
    const where = filterService(postsDto, root);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async postsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<PostsFilter[]> {
    const { root, core } = commonEntityGetParams(PostsEntity);
    const query = this.postsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async postsCreate(postsDto: PostsDto): Promise<PostsEntity> {
    const { categoryId } = postsDto;
    if (categoryId) {
      const category = await this.categoriesService.categoriesGetOne(
        categoryId,
      );
      postsDto.category = category;
    }
    delete postsDto.categoryId;
    const { tagsList } = postsDto;
    if (tagsList && tagsList.length) {
      const tags = await this.tagsService.tagsGetMany(tagsList);
      postsDto.tags = (postsDto.tags || []).concat(tags);
    }
    delete postsDto.tagsList;
    delete postsDto.createdAt;
    delete postsDto.updatedAt;
    return await this.postsRepository.save({ ...postsDto });
  }

  async postsUpdate(postsDto: PostsDto): Promise<PostsEntity> {
    const { id } = postsDto;
    if (id === undefined) {
      return;
    }
    return await this.postsCreate(postsDto);
  }

  async postsRemove(id: number): Promise<boolean> {
    const result = await this.postsRepository.delete({ id });
    return !!result?.affected;
  }
}
