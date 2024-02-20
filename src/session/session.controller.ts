import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { SessionDto } from '@src/session/session.dto';
import { SessionService } from '@src/session/session.service';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { Data } from '@src/app.decorator';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('get_all')
  async sessionGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.sessionService.sessionGetAll(relationsDto);
  }

  @Get('get_one')
  async sessionGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.sessionService.sessionGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('get_by_auth_id')
  async sessionGetByAuthId(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.sessionService.sessionGetByAuthId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async sessionCreate(@Body('create') sessionDto: SessionDto) {
    return await this.sessionService.sessionCreate(sessionDto);
  }

  // @Put('update')
  @Post('update')
  async sessionUpdate(@Body('update') sessionDto: SessionDto) {
    return await this.sessionService.sessionUpdate(sessionDto);
  }

  // @Delete('remove')
  @Post('remove')
  async sessionRemove(@Body('id') id: number) {
    return await this.sessionService.sessionRemove(id);
  }
}