import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';
import { Injectable } from '@nestjs/common';

export interface IFetchSchedulingsByMedicalIdUseCaseRequest {
  id: string;
  day?: Date;
  month?: Date;
}

@Injectable()
export class FetchSchedulingsByMedicalIdUseCase {
  constructor(private readonly medicalScheduler: MedicalSchedulerRepository) {}

  async execute({ id, month }: IFetchSchedulingsByMedicalIdUseCaseRequest) {
    const date = month ? dayjs(month) : dayjs();

    const start = date.startOf('month').toDate();
    const end = date.endOf('month').toDate();

    const scheduler = await this.medicalScheduler.findByMedicalId(
      id,
      start,
      end,
    );

    return scheduler;
  }
}
