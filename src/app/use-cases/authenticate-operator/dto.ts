import { Operator } from 'src/domain/professional/entities/operator.entity';

export type OperatorAuthenticateUseCaseRequest = {
  username: string;
  password: string;
};

export type OperatorAuthenticateUseCaseResponse = {
  operator: Operator;
};
