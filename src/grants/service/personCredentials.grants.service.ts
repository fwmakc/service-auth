import { Injectable, BadRequestException } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { PersonsService } from '@src/persons/persons.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class PersonCredentialsGrantsService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly tokenService: TokenService,
  ) {}

  async personCredentials(grantsDto: GrantsDto): Promise<any> {
    if (grantsDto.grant_type !== 'person_credentials') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsDto.username
      || !grantsDto.password
    ) {
      throw new BadRequestException('Not specified username or password in this request', 'invalid_grant');
    }
    const { username, password } = grantsDto;
    const person = await this.personsService.login({ username, password });
    const token = await this.tokenService.pair({ person_id: person.id });
    if (!token) {
      throw new BadRequestException('Person authentication failed. Unknown person', 'invalid_person');
    }
    return await this.tokenService.prepare(token, grantsDto.state);
  }
}
