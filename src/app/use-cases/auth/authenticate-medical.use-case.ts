import { Injectable } from '@nestjs/common';
import { MedicalRepository } from '../../repositories/medical.repository';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { CRM } from '@/core/object-values/crm';
import { UniqueID } from '@/core/object-values/unique-id';
import { MedicalRawResult } from '@/domain/professional/@types/raw.medical';
import { Medical } from '@/domain/professional/entities/medical.entity';
import {
  InvalidPasswordError,
  MedicalEntityBuildError,
  MedicalInactiveError,
  MedicalInvalidCrmFormatError,
  MedicalNotFoundError,
  MedicalPasswordNotSetError,
  MultipleDoctorsFoundError,
} from './errors';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import { DomainEvents } from '@/core/events/domain-events';

export type MedicalAuthenticateUseCaseRequest = {
  crm: CRM;
  password: string;
};

type MedicalAuthenticateUseCaseResponse = Either<
  | DatabaseUnavailableError
  | MedicalNotFoundError
  | MedicalInactiveError
  | MedicalPasswordNotSetError
  | MedicalInvalidCrmFormatError
  | MedicalEntityBuildError
  | InvalidPasswordError
  | MultipleDoctorsFoundError,
  { medical: Medical }
>;

@Injectable()
export class MedicalAuthenticateUseCase {
  constructor(
    private medicalRepository: MedicalRepository,
    private readonly hasher: Hasher,
  ) {}

  async execute({
    crm,
    password,
  }: MedicalAuthenticateUseCaseRequest): Promise<MedicalAuthenticateUseCaseResponse> {
    let listMedical: MedicalRawResult[] | null;

    try {
      listMedical = await this.medicalRepository.findByCrm(crm);
    } catch (err) {
      console.error('[MedicalRepository] Erro ao buscar médico por CRM:', err);
      return left(new DatabaseUnavailableError());
    }

    if (!listMedical || listMedical.length === 0) {
      return left(new MedicalNotFoundError());
    }

    if (listMedical.length > 1) {
      return left(new MultipleDoctorsFoundError());
    }

    const queryMedical = listMedical[0];

    if (!queryMedical.active) {
      return left(new MedicalInactiveError());
    }

    if (!queryMedical.password) {
      return left(new MedicalPasswordNotSetError());
    }

    const crmResult = CRM.create(queryMedical.crm);

    if (crmResult.isLeft()) {
      return left(new MedicalInvalidCrmFormatError());
    }

    const medicalCreated = Medical.create(
      {
        name: queryMedical.fullname,
        crm: crmResult.value,
        cpf: queryMedical.cpf,
        email: queryMedical.email,
        username: queryMedical.username,
        password: queryMedical.password,
      },
      new UniqueID(`${queryMedical.id}`),
    );

    if (medicalCreated.isLeft()) {
      return left(new MedicalEntityBuildError());
    }

    const medical = medicalCreated.value;
    const isValid = await medical.compare(password, this.hasher);

    if (!isValid) {
      return left(new InvalidPasswordError());
    }
    medical.recordAccess();
    DomainEvents.dispatchEventsForAggregate(medical.id);

    return right({
      medical,
    });
  }
}
