import { OperatorRawResult } from '@/domain/professional/enterprise/@types/raw.operator';

export interface IOperatorRepository {
  findByUsername(username: string): Promise<OperatorRawResult[] | null>;
}
