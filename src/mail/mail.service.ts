import { Injectable } from '@nestjs/common';
import { MailDto } from '@src/mail/mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async send(options: MailDto) {
    const result = await this.mailerService
      .sendMail({
        to: options.to,
        subject: options.subject,
        // template: 'application-approved',
        // context: {
        //   content: options.html || options.text,
        // },
        text: options.text,
        html: options.html,
      })
      .catch((e) => {
        console.error('send mail error:', e);
      });
    return result;
  }

  async sendTemplate(
    options: MailDto,
    data: object,
  ) {
    const result = await this.mailerService
      .sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: {
          data,
        },
      })
      .catch((e) => {
        console.error('send mail with template error:', e);
      });
    return result;
  }
}
