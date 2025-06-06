import { IMedicalSchedulingProps } from '@/domain/professional/@types/medical-scheduling';

export abstract class MedicalSchedulerRepository {
  abstract findByMedicalId(
    id: string,
  ): Promise<IMedicalSchedulingProps[] | null>;
}
