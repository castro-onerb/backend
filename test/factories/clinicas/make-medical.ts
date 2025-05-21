import { faker } from '@faker-js/faker';

import { CRM } from 'src/core/object-values/crm';
import { UniqueID } from 'src/core/object-values/unique-id';
import { Medical } from 'src/domain/professional/enterprise/entities/medical.entity';
import { Md5Hasher } from 'src/infra/cryptography/md5-hasher';

export function makeMedical(
  override: Partial<ConstructorParameters<typeof Medical>[0]> = {},
) {
  const crm = CRM.create('123456-UF');

  if (crm.isLeft()) {
    throw new Error('Não conseguimos criar um CRM válido');
  }

  return Medical.create(
    {
      name: faker.person.fullName(),
      crm: crm.value,
      password: new Md5Hasher().hash('123456'),
      email: faker.internet.email(),
      cpf: '96227468100',
      username: faker.internet.username(),
      ...override,
    },
    new UniqueID(),
  );
}
