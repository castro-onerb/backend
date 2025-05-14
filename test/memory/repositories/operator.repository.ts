import { IOperatorRepository } from '@/domain/professional/app/repositories/operator.repository';
import { OperatorRawResult } from '@/domain/professional/enterprise/@types/raw.operator';
import { faker } from '@faker-js/faker';

export class InMemoryOperatorRepository implements IOperatorRepository {
  operators: OperatorRawResult[] = [];

  findByUsername(username: string): Promise<OperatorRawResult[] | null> {
    const operator = this.operators.filter(
      (item) => item.username === username,
    );
    return Promise.resolve(operator ?? null);
  }

  save(props?: Partial<OperatorRawResult>) {
    const operator = {
      id: faker.string.numeric({ length: { min: 4, max: 7 } }),
      fullname: faker.person.fullName(),
      type: 4,
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: faker.internet.password(),
      active: true,
      ...props,
    };

    this.operators.push(operator);
    return operator;
  }
}
