import { registerEnumType } from '@nestjs/graphql';

export enum TypeClients {
  DEFAULT = 'public',
  CONFIDENTIAL = 'confidential',
}

registerEnumType(TypeClients, {
  name: 'TypeClients',
});

export enum TypeGrants {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
}

export enum TypeResponses {
  TOKEN = 'token',
  CODE = 'code',
}
