import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';
import { Either, right } from '@/core/either';
import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';
import { Injectable } from '@nestjs/common';

export interface IGetDailySchedulingsByMedicalIdRequest {
  id: string;
  date?: Date;
}

type IGetDailySchedulingsByMedicalIdResponse = Either<
  null,
  { schedulings: IMedicalSchedulingProps[] }
>;

@Injectable()
export class GetDailySchedulingsByMedicalIdUseCase {
  constructor(private readonly medicalScheduler: MedicalSchedulerRepository) {}

  async execute({
    id,
    date,
  }: IGetDailySchedulingsByMedicalIdRequest): Promise<IGetDailySchedulingsByMedicalIdResponse> {
    const getDate = date ? dayjs(date) : dayjs();

    const dailySchedulings =
      await this.medicalScheduler.getDailySchedulingsByMedicalId(
        id,
        getDate.toDate(),
      );

    return right({
      schedulings: dailySchedulings ?? [],
    });
  }
}
