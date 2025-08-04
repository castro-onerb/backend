import { Requirement } from '@/domain/auth/entities/requirement.entity';

export abstract class RequirementsRepository {
  abstract findManyByUserId(userId: string): Promise<Requirement[]>;
}
