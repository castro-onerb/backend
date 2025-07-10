import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';
import { Injectable } from '@nestjs/common';

export interface GetDailySchedulingsByMedicalIdRequest {
  id: string;
  date: Date;
}

@Injectable()
export class GetDailySchedulingsByMedicalIdUseCase {
  constructor(private readonly medicalScheduler: MedicalSchedulerRepository) {}

  async execute({ id, date }: GetDailySchedulingsByMedicalIdRequest) {
    const getDate = date ? dayjs(date) : dayjs();

    const dailySchedulings =
      await this.medicalScheduler.getDailySchedulingsByMedicalId(
        id,
        getDate.toDate(),
      );

    return dailySchedulings;
  }
}
