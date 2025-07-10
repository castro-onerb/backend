import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';
import { Either, right } from '@/core/either';
import { IMonthlySchedulingOverview } from '@/domain/professional/@types/medical-scheduling';
import { Injectable } from '@nestjs/common';

export interface GetMonthlySchedulingsOverviewByMedicalIdRequest {
  id: string;
  start?: Date;
  end?: Date;
}

type GetMonthlySchedulingsOverviewByMedicalIdResponse = Either<
  null,
  { data: IMonthlySchedulingOverview[] | null }
>;

@Injectable()
export class GetMonthlySchedulingsOverviewByMedicalIdUseCase {
  constructor(
    private readonly schedulerRepository: MedicalSchedulerRepository,
  ) {}

  async execute({
    id,
    start,
    end,
  }: GetMonthlySchedulingsOverviewByMedicalIdRequest): Promise<GetMonthlySchedulingsOverviewByMedicalIdResponse> {
    const startDate = start
      ? dayjs(start).format('YYYY-MM-DD')
      : dayjs().startOf('month').format('YYYY-MM-DD');

    const endDate = end
      ? dayjs(end).format('YYYY-MM-DD')
      : dayjs().endOf('month').format('YYYY-MM-DD');

    const data =
      await this.schedulerRepository.getMonthlySchedulingOverviewByMedicalId(
        id,
        new Date(startDate),
        new Date(endDate),
      );

    return right({
      data: data,
    });
  }
}
