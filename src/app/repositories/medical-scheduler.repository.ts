import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class MedicalSchedulerRepository {
  abstract findByMedicalId(
    id: string,
    fromDate: Date,
    limit?: number,
  ): Promise<IMedicalSchedulingProps[] | null>;
}
