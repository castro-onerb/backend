import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICloseSessionUseCaseRequest } from './dto';
import { IActiveSessionsRepository } from '../../../repositories/active-sessions.repository';
import { Either, left, right } from '@/core/either';

@Injectable()
export class CloseSessionUseCase {
  constructor(
    @Inject('IActiveSessionsRepository')
    private readonly sessionsRepository: IActiveSessionsRepository,
  ) {}

  async execute(
    props: ICloseSessionUseCaseRequest,
  ): Promise<Either<Error, { success: true }>> {
    try {
      const existingSession = await this.sessionsRepository.findByToken(
        props.token,
      );

      if (!existingSession) {
        return left(
          new NotFoundException('Sessão não encontrada ou já encerrada.'),
        );
      }

      await this.sessionsRepository.closeSession(props.token);

      return right({ success: true });
    } catch {
      return left(
        new InternalServerErrorException(
          'Tivemos um problema ao encerrar a sessão. Tente novamente mais tarde.',
        ),
      );
    }
  }
}
