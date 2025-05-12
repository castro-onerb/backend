import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MedicalAuthenticateUseCaseRequest } from './dto';
import { IMedicalRepository } from '../../repositories/medical.repository';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { Medical } from '@/domain/professional/enterprise/entities/medical.entity';

type MedicalAuthenticateUseCaseResponse = Either<
  UnauthorizedException,
  { medical: ReturnType<Medical['toObject']> }
>;

@Injectable()
export class MedicalAuthenticateUseCase {
  constructor(
    @Inject('IMedicalRepository') private medicalRepository: IMedicalRepository,
    @Inject('Hasher') private readonly hasher: Hasher,
  ) {}

  async execute({
    crm,
    password,
  }: MedicalAuthenticateUseCaseRequest): Promise<MedicalAuthenticateUseCaseResponse> {
    const medicalOrError = await this.medicalRepository.findByCrm(crm);

    if (medicalOrError.isLeft()) {
      return left(new UnauthorizedException(medicalOrError.value));
    }

    const medical = medicalOrError.value;

    const isValid = await medical.compare(password, this.hasher);

    if (!isValid) {
      return left(
        new UnauthorizedException('A senha que você inseriu está incorreta.'),
      );
    }

    return right({
      medical: medical.toObject(),
    });
  }
}
