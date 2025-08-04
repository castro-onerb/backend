import { mock } from 'vitest-mock-extended';
import { Mocked, vi } from 'vitest';
import { FetchSchedulingsByMedicalIdUseCase } from './fetch-schedulings-by-medical-id.use-case';
import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';

describe('FetchSchedulingsByMedicalIdUseCase', () => {
  let repo: Mocked<MedicalSchedulerRepository>;
  let useCase: FetchSchedulingsByMedicalIdUseCase;

  beforeEach(() => {
    repo = mock<MedicalSchedulerRepository>();
    useCase = new FetchSchedulingsByMedicalIdUseCase(repo);
  });

  it('should use current month when none provided', async () => {
    const fixed = new Date('2024-05-15T00:00:00.000Z');
    vi.useFakeTimers().setSystemTime(fixed);

    repo.findByMedicalId.mockResolvedValue([]);

    await useCase.execute({ id: 'med-1' });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findByMedicalId).toHaveBeenCalled();

    const [, startArg, endArg] = repo.findByMedicalId.mock.calls[0];
    expect(startArg.getTime()).toBe(
      dayjs(fixed).startOf('month').toDate().getTime(),
    );
    expect(endArg.getTime()).toBe(
      dayjs(fixed).endOf('month').toDate().getTime(),
    );

    vi.useRealTimers();
  });

  it('should use provided month boundaries', async () => {
    const month = new Date('2024-04-10T00:00:00.000Z');
    repo.findByMedicalId.mockResolvedValue([]);

    await useCase.execute({ id: 'med-1', month });

    const [, startArg, endArg] = repo.findByMedicalId.mock.calls[0];
    expect(startArg.getTime()).toBe(
      dayjs(month).startOf('month').toDate().getTime(),
    );
    expect(endArg.getTime()).toBe(
      dayjs(month).endOf('month').toDate().getTime(),
    );
  });
});
