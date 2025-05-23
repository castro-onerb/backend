import { OperatorRawResult } from '@/domain/professional/@types/raw.operator';

export interface IOperatorRepository {
  findByUsername(username: string): Promise<OperatorRawResult[] | null>;
  findByEmail(email: string): Promise<OperatorRawResult[] | null>;
  updatePassword(
    props: {
      username?: string;
      email?: string;
    },
    password?: string,
  ): Promise<boolean>;
}
