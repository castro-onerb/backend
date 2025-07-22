import { PatientExamRepository } from '@/app/repositories/patient-exam.repository';
import { Either, right } from '@/core/either';
import { IPatientExamProps } from '@/domain/patient/@types/patient-exam';
import { Injectable } from '@nestjs/common';

export interface IFetchExamsByPatientRequest {
  patientId: string;
  page?: number;
}

export type TFetchExamsByPatientResponse = Either<
  null,
  { exams: IPatientExamProps[] }
>;

@Injectable()
export class FetchExamsByPatientUseCase {
  private readonly ITEMS_PER_PAGE = 30;

  constructor(private readonly patientExamRepository: PatientExamRepository) {}

  async execute({ patientId, page }: IFetchExamsByPatientRequest) {
    const pageNumber = page ?? 1;

    const exams = await this.patientExamRepository.findByPatientId(
      patientId,
      pageNumber,
      this.ITEMS_PER_PAGE,
    );

    return right({ exams });
  }
}
