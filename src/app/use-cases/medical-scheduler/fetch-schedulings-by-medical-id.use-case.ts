import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';
import { Injectable } from '@nestjs/common';

export interface IFetchSchedulingsByMedicalIdUseCaseRequest {
  id: string;
  start?: Date;
  end?: Date;
}

@Injectable()
export class FetchSchedulingsByMedicalIdUseCase {
  constructor(private readonly medicalScheduler: MedicalSchedulerRepository) {}

  async execute({ id }: IFetchSchedulingsByMedicalIdUseCaseRequest) {
    const start = dayjs.now().subtract(1, 'day').toDate();

    const scheduler = await this.medicalScheduler.findByMedicalId(id, start);

    return scheduler;
  }
}
