import { CRM } from '@/core/object-values/crm';
import { IMedicalRepository } from '@/domain/professional/app/repositories/medical.repository';
import { Medical } from '@/domain/professional/enterprise/entities/medical.entity';
import { PrismaClinicasService } from '../prisma-clinicas.service';
import { UniqueID } from '@/core/object-values/unique-id';
import { Either, left, right } from '@/core/either';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

type RawMedical = {
  public_id: string;
  username: string;
  password: string;
  email: string;
  type: number;
  active: boolean;
  fullname: string;
  cpf: string;
  crm_number: string;
  crm_uf: string;
};

export class PrismaMedicalRepository implements IMedicalRepository {
  constructor(private db: PrismaClinicasService) {}

  async findByCrm(
    crm: CRM,
  ): Promise<
    Either<BadRequestException | InternalServerErrorException, Medical>
  > {
    const result = await this.db.$queryRaw<RawMedical[]>`
      SELECT operador_id as public_id,
             usuario as username,
             senha as password,
             email,
             perfil_id as type,
             ativo as active,
             nome as fullname,
             cpf,
             conselho as crm_number,
             uf_profissional as crm_uf
      FROM tb_operador
      WHERE ${crm.value} = concat(conselho, '-', uf_profissional)
    `;

    const data = result[0];

    if (!data) {
      return left(new BadRequestException('Médico não encontrado.'));
    }

    if (!data.active) {
      return left(
        new InternalServerErrorException(
          'O perfil deste médico está desativado.',
        ),
      );
    }

    const medicalOrError = Medical.create(
      {
        name: data.fullname,
        cpf: data.cpf,
        crm: new CRM(`${data.crm_number}-${data.crm_uf}`),
        email: data.email,
        username: data.username,
        password: data.password,
      },
      new UniqueID(data.public_id),
    );

    if (medicalOrError.isLeft()) {
      return left(medicalOrError.value);
    }

    return right(medicalOrError.value);
  }
}
