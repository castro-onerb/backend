import { OperatorRaw } from '@/domain/professional/@types/raw.operator';

export abstract class OperatorRepository {
  abstract findByUsername(username: string): Promise<OperatorRaw[] | null>;
  abstract findByEmail(email: string): Promise<OperatorRaw[] | null>;
  abstract updatePassword(
    props: {
      username?: string;
      email?: string;
    },
    password?: string,
  ): Promise<boolean>;
}
