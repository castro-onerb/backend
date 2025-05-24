import { OperatorRawResult } from '@/domain/professional/@types/raw.operator';

export abstract class OperatorRepository {
  abstract findByUsername(
    username: string,
  ): Promise<OperatorRawResult[] | null>;
  abstract findByEmail(email: string): Promise<OperatorRawResult[] | null>;
  abstract updatePassword(
    props: {
      username?: string;
      email?: string;
    },
    password?: string,
  ): Promise<boolean>;
}
