import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { MailDto } from '@src/mail/mail.dto';
import { MailService } from '@src/mail/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async send(
    @Body('options') options: MailDto,
  ) {
    return await this.mailService.send(options);
  }

  @Post('sendtemplate')
  async sendTemplate(
    @Body('options') options: MailDto,
    @Body('data') data: object,
  ) {
    return await this.mailService.sendTemplate(
      options,
      data,
    );
  }
}
