import { InMemoryRecoveryPasswordRepository } from 'test/memory/repositories/prontuario/recovery-password.repository';
import { InvalidateCodeRecoverUseCase } from './invalidate-code-recover.use-case';
import { InMemoryOperatorRepository } from 'test/memory/repositories/clinicas/operator.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { makeOperator } from 'test/factories/clinicas/make-operator';
import { left } from '@/core/either';

describe('InvalidateCodeRecoverUseCase', () => {
  let useCase: InvalidateCodeRecoverUseCase;
  let operatorRepository: InMemoryOperatorRepository;
  let passwordRepository: InMemoryRecoveryPasswordRepository;

  beforeEach(() => {
    operatorRepository = new InMemoryOperatorRepository();
    passwordRepository = new InMemoryRecoveryPasswordRepository();

    useCase = new InvalidateCodeRecoverUseCase(
      operatorRepository,
      passwordRepository,
    );
  });

  it('should return BadRequestException if no email and no username provided', async () => {
    const result = await useCase.execute({
      email: undefined,
      username: undefined,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    if (result.isLeft()) {
      expect(result.value.message).toMatch(
        /precisamos de um email ou usuário/i,
      );
    }
  });

  it('should return NotFoundException if username not found', async () => {
    const spy = vi
      .spyOn(operatorRepository, 'findByUsername')
      .mockResolvedValue(null);

    const operator = makeOperator({
      username: 'jon.doe',
      email: 'jondoe@example.com',
    });

    if (operator.isLeft()) {
      return left(
        new BadRequestException('Erro ao criar instância do operador'),
      );
    }

    const newOperator = {
      ...operator.value,
      id: operator.value.id.toString(),
    };

    const operacao = operatorRepository.save(newOperator);

    console.log(newOperator);
    console.log(operatorRepository.operators);

    const result = await useCase.execute({
      email: undefined,
      username: 'jon.doe',
    });

    console.log(result);

    expect(spy).toHaveBeenCalledWith('jon.doe');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    if (result.isLeft()) {
      expect(result.value.message).toMatch(/Erro ao buscar operador/i);
    }
  });
});
