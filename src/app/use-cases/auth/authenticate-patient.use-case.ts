import { PatientRepository } from '@/app/repositories/patient.repository';
import { Either, left, right } from '@/core/either';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import { PatientRaw } from '@/domain/patient/@types/raw.patient';
import { Injectable } from '@nestjs/common';

import {
  InvalidPasswordError,
  MultiplePatientsFoundError,
  PatientInactiveError,
  PatientNotFoundError,
} from './errors';
import { Encrypter } from '@/core/cryptography/encrypter';
import { Patient } from '@/domain/patient/entities/patient.entity';
import { UniqueID } from '@/core/object-values/unique-id';

export type PatientAuthenticateUseCaseRequest = {
  cpf: string;
  password: string;
};

export type PatientAuthenticateUseCaseResponse = Either<
  | DatabaseUnavailableError
  | PatientNotFoundError
  | MultiplePatientsFoundError
  | PatientInactiveError
  | InvalidPasswordError,
  { patient: Patient }
>;

@Injectable()
export class PatientAuthenticateUseCase {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: PatientAuthenticateUseCaseRequest): Promise<PatientAuthenticateUseCaseResponse> {
    let listPatient: PatientRaw[] | null;

    try {
      listPatient = await this.patientRepository.findByCpf(cpf);
    } catch (err) {
      console.error(
        '[MedicalRepository] Erro ao buscar paciente por CPF:',
        err,
      );
      return left(new DatabaseUnavailableError());
    }

    if (!listPatient || listPatient.length === 0) {
      return left(new PatientNotFoundError());
    }

    if (listPatient.length > 1) {
      return left(new MultiplePatientsFoundError());
    }

    const queryPatient = listPatient[0];

    if (!queryPatient.active) {
      return left(new PatientInactiveError());
    }

    const password_decrypt = this.encrypter.decrypt(queryPatient.password);

    if (password !== password_decrypt) {
      return left(new InvalidPasswordError());
    }

    console.log(queryPatient);

    const patient = Patient.create(
      {
        name: queryPatient.fullname,
        cpf: queryPatient.cpf,
        birth: queryPatient.birth,
        active: queryPatient.active,
      },
      new UniqueID(String(queryPatient.id)),
    );

    return right({
      patient,
    });
  }
}
