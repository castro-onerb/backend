import { RequirementsRepository } from '@/app/repositories/requirements.repository';
import { Requirement } from '@/domain/auth/entities/requirement.entity';
import { Injectable } from '@nestjs/common';

export interface CheckRequirementsUseCaseRequest {
  userId: string;
}

export interface CheckRequirementsUseCaseResponse {
  requirements: Requirement[];
}

@Injectable()
export class CheckRequirementsUseCase {
  constructor(
    private readonly requirementsRepository: RequirementsRepository,
  ) {}

  async execute({
    userId,
  }: CheckRequirementsUseCaseRequest): Promise<CheckRequirementsUseCaseResponse> {
    const requirements =
      await this.requirementsRepository.findManyByUserId(userId);

    return { requirements };
  }
}
