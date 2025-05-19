import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { MedicalAuthenticateUseCaseRequest } from './dto';
import { IMedicalRepository } from '../../repositories/medical.repository';
import { Hasher } from 'src/core/cryptography/hasher';
import { Either, left, right } from '@/core/either';
import { Medical } from '@/domain/professional/enterprise/entities/medical.entity';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error';
import { CRM } from '@/core/object-values/crm';
import { UniqueID } from '@/core/object-values/unique-id';
import { DatabaseUnavailableError } from '@/core/errors/database-unavailable.error';
import { MedicalRawResult } from '@/domain/professional/enterprise/@types/raw.medical';
import { MailEntity } from '@/core/entities/mail.entity';

type MedicalAuthenticateUseCaseResponse = Either<
  UnauthorizedException | ResourceNotFoundError,
  { medical: ReturnType<Medical['toObject']> }
>;

@Injectable()
export class MedicalAuthenticateUseCase {
  constructor(
    @Inject('IMedicalRepository') private medicalRepository: IMedicalRepository,
    @Inject('Hasher') private readonly hasher: Hasher,
    private readonly mail: MailEntity,
  ) {}

  async execute({
    crm,
    password,
  }: MedicalAuthenticateUseCaseRequest): Promise<MedicalAuthenticateUseCaseResponse> {
    let listMedical: MedicalRawResult[] | null;

    try {
      listMedical = await this.medicalRepository.findByCrm(crm);
    } catch {
      return left(new DatabaseUnavailableError());
    }

    if (!listMedical || listMedical.length === 0) {
      return left(
        new ResourceNotFoundError(
          'Não localizamos um médico com o CRM informado. Que tal conferir os dados?',
        ),
      );
    }

    if (listMedical.length > 1) {
      return left(
        new ResourceNotFoundError(
          'Parece que há algo errado, localizamos mais de um acesso para este mesmo CRM.',
        ),
      );
    }

    const queryMedical = listMedical[0];

    if (!queryMedical.active) {
      return left(
        new UnauthorizedException(
          'Este perfil encontra-se desativado. Se precisar de ajuda, fale com o suporte.',
        ),
      );
    }

    if (!queryMedical.password) {
      return left(
        new ResourceNotFoundError(
          'O acesso está indisponível porque o perfil não possui uma senha cadastrada.',
        ),
      );
    }

    const crmResult = CRM.create(queryMedical.crm);

    if (crmResult.isLeft()) {
      return left(
        new InternalServerErrorException(
          'Encontramos o médico, mas o CRM registrado parece estar em um formato inválido.',
        ),
      );
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
      return left(
        new InternalServerErrorException(
          'Falha ao preparar as informações do médico. Por favor, tente novamente mais tarde.',
        ),
      );
    }

    const medical = medicalCreated.value;
    const isValid = await medical.compare(password, this.hasher);

    if (!isValid) {
      return left(
        new UnauthorizedException(
          'Não conseguimos validar sua senha. Confira e tente novamente.',
        ),
      );
    }

    return right({
      medical: medical.toObject(),
    });
  }
}
