// make-operator.ts
import { Operator } from '@/domain/professional/enterprise/entities/operator.entity';
import { faker } from '@faker-js/faker';
import { UniqueID } from 'src/core/object-values/unique-id';
import { Md5Hasher } from 'src/infra/cryptography/md5-hasher';

export function makeOperator(
  override: Partial<ConstructorParameters<typeof Operator>[0]> = {},
  id: UniqueID = new UniqueID(),
) {
  return Operator.create(
    {
      name: faker.person.fullName(),
      cpf: '96227468100',
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: new Md5Hasher().hash('123456'),
      ...override,
    },
    id,
  );
}
