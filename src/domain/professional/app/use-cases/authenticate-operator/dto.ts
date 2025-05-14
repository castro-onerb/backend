import { Operator } from 'src/domain/professional/enterprise/entities/operator.entity';

export type OperatorAuthenticateUseCaseRequest = {
  username: string;
  password: string;
};

export type OperatorAuthenticateUseCaseResponse = {
  operator: Operator;
};
