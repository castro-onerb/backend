import { CRM } from 'src/core/object-values/crm';
import { Medical } from '../../enterprise/entities/medical.entity';
import { Either } from '@/core/either';
import { BadRequestException } from '@nestjs/common';

export interface IMedicalRepository {
  findByCrm(crm: CRM): Promise<Either<BadRequestException, Medical>>;
}
