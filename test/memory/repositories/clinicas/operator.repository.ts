import { OperatorRepository } from '@/app/repositories/operator.repository';
import { OperatorRawResult } from '@/domain/professional/@types/raw.operator';
import { faker } from '@faker-js/faker';

export class InMemoryOperatorRepository implements OperatorRepository {
  operators: OperatorRawResult[] = [];

  findByEmail(email: string): Promise<OperatorRawResult[] | null> {
    const operator = this.operators.filter((item) => item.email === email);
    return Promise.resolve(operator ?? null);
  }

  updatePassword(
    props: { username?: string; email?: string },
    password?: string,
  ): Promise<boolean> {
    const { username, email } = props;

    const index = this.operators.findIndex((item) => {
      if (username) return item.username === username;
      if (email) return item.email === email;
      return false;
    });

    if (index === -1) {
      return Promise.resolve(false);
    }

    this.operators[index].password = password ?? this.operators[index].password;

    return Promise.resolve(true);
  }

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

  clear() {
    this.operators = [];
  }
}
