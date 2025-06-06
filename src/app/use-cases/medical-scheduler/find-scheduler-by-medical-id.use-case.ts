import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';

export interface IFindSchedulerByMedicalIdUseCaseRequest {
  id: string;
  start?: Date;
  end?: Date;
}

export class FindSchedulerByMedicalIdUseCase {
  constructor(private readonly medicalScheduler: MedicalSchedulerRepository) {}

  async execute({ id }: IFindSchedulerByMedicalIdUseCaseRequest) {
    const scheduler = await this.medicalScheduler.findByMedicalId(id);

    console.log(scheduler);
  }
}
