import { Requirement } from '@/domain/auth/entities/requirement.entity';

export class RequirementPresenter {
  static toHTTP(requirement: Requirement) {
    return {
      id: requirement.id.toValue(),
      name: requirement.name,
      satisfied: requirement.satisfied,
    };
  }
}
