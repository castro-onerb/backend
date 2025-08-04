import { mock } from 'vitest-mock-extended';
import { Mocked, vi } from 'vitest';
import { GetDailySchedulingsByMedicalIdUseCase } from './get-daily-schedulings-by-medical.use-case';
import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';

describe('GetDailySchedulingsByMedicalIdUseCase', () => {
  let repo: Mocked<MedicalSchedulerRepository>;
  let useCase: GetDailySchedulingsByMedicalIdUseCase;

  beforeEach(() => {
    repo = mock<MedicalSchedulerRepository>();
    useCase = new GetDailySchedulingsByMedicalIdUseCase(repo);
  });

  it('should forward provided date to repository', async () => {
    const date = new Date('2024-04-10T00:00:00.000Z');
    repo.getDailySchedulingsByMedicalId.mockResolvedValue([]);

    await useCase.execute({ id: 'med-1', date });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.getDailySchedulingsByMedicalId).toHaveBeenCalledWith(
      'med-1',
      date,
    );
  });

  it('should default to current date when none provided', async () => {
    const fixed = new Date('2024-04-12T00:00:00.000Z');
    vi.useFakeTimers().setSystemTime(fixed);
    repo.getDailySchedulingsByMedicalId.mockResolvedValue([]);

    const date: Date | undefined = undefined;
    await useCase.execute({ id: 'med-1', date });

    const [, dateArg] = repo.getDailySchedulingsByMedicalId.mock.calls[0];
    expect(dateArg.getTime()).toBe(dayjs(fixed).toDate().getTime());

    vi.useRealTimers();
  });
});
