import { Controller, Get, Post, NotFoundException, Query } from '@nestjs/common';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsDto } from '@src/clients/clients.dto';
import { Client, SelfClient } from '@src/clients/clients.decorator';
import { PrivateController } from '@src/common/controller/private.controller';
import { ClientsEntity } from '@src/clients/clients.entity';

@Controller('clients')
export class ClientsController extends PrivateController(
  ClientsEntity,
  ClientsDto
)<
  ClientsService,
  ClientsEntity,
  ClientsDto
> {
  constructor(
    readonly service: ClientsService,
  ) {
    super();
  }

  @Get('token')
  async clientsTokenGet(@Query() query) {
    return {
      title: 'redirect verify',
      query,
    };
  }

  @Client()
  @Get('self')
  async clientsSelf(@SelfClient() client: ClientsDto) {
    const { id } = client;
    const result = await this.service.findOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
