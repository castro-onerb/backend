import {
  IMedicalSchedulingProps,
  IMonthlySchedulingOverview,
} from '@/domain/professional/@types/medical-scheduling';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class MedicalSchedulerRepository {
  abstract findByMedicalId(
    id: string,
    start: Date,
    end: Date,
  ): Promise<IMedicalSchedulingProps[] | null>;

  abstract getDailySchedulingsByMedicalId(
    id: string,
    date: Date,
  ): Promise<IMedicalSchedulingProps[] | null>;

  abstract getMonthlySchedulingOverviewByMedicalId(
    id: string,
    start: Date,
    end: Date,
  ): Promise<IMonthlySchedulingOverview[]>;
}
