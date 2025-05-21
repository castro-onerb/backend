import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ISessionRegisterUseCaseRequest } from './dto';
import { IActiveSessionsRepository } from '../../../repositories/active-sessions.repository';
import { Session } from '@/domain/professional/enterprise/entities/session.entity';
import { Either, left, right } from '@/core/either';

@Injectable()
export class SessionRegisterUseCase {
  constructor(
    @Inject('IActiveSessionsRepository')
    private readonly sessionsRepository: IActiveSessionsRepository,
  ) {}

  async execute(
    props: ISessionRegisterUseCaseRequest,
  ): Promise<Either<InternalServerErrorException, { success: true }>> {
    const sessionEntity = Session.create(props);

    if (!sessionEntity) {
      return left(
        new InternalServerErrorException(
          'Tivemos um problema ao registrar a sessão, por segurança, tente fazer um novo login.',
        ),
      );
    }

    const dto = {
      id: sessionEntity.id.toString(),
      token: sessionEntity.token,
      userId: sessionEntity.userId,
      isActive: sessionEntity.isActive,
      device: sessionEntity.device,
      ip: sessionEntity.ip,
      latitude: sessionEntity.latitude,
      longitude: sessionEntity.longitude,
      lastSeenAt: sessionEntity.lastSeenAt,
      createdAt: sessionEntity.createdAt,
    };

    await this.sessionsRepository.create(dto);

    return right({ success: true });
  }
}
