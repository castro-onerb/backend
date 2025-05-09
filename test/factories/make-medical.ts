import { faker } from '@faker-js/faker';

import { CRM } from 'src/core/object-values/crm';
import { UniqueID } from 'src/core/object-values/unique-id';
import { Medical } from 'src/domain/professional/enterprise/entities/medical.entity';
import { Md5Hasher } from 'src/infra/cryptography/md5-hasher';

export function makeMedical(
  override: Partial<ConstructorParameters<typeof Medical>[0]> = {},
) {
  return Medical.create(
    {
      name: faker.person.fullName(),
      crm: new CRM('123456/UF'),
      password: new Md5Hasher().hash('123456'),
      cpf: '96227468100',
      ...override,
    },
    new UniqueID(),
  );
}
