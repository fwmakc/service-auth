// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesDto } from '@src/categories/categories.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('get_all')
  async categoriesGetAll(@Data('relations') relations: Array<string>) {
    return await this.categoriesService.categoriesGetAll(relations);
  }

  @Get('get_one')
  async categoriesGetOne(
    @Data('id') id: number,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesGetOne(id, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async categoriesGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesGetMany(
      ids,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async categoriesFilter(
    @Data('filter') categoriesDto: CategoriesDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesFilter(
      categoriesDto,
      optionsDto,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async categoriesSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesSearch(
      searchDto,
      optionsDto,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async categoriesCreate(@Body('create') categoriesDto: CategoriesDto) {
    return await this.categoriesService.categoriesCreate(categoriesDto);
  }

  // @Put('update')
  @Post('update')
  async categoriesUpdate(@Body('update') categoriesDto: CategoriesDto) {
    return await this.categoriesService.categoriesUpdate(categoriesDto);
  }

  // @Delete('remove')
  @Post('remove')
  async categoriesRemove(@Body('id') id: number) {
    return await this.categoriesService.categoriesRemove(id);
  }
}
