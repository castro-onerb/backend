import { mock } from 'vitest-mock-extended';
import { Mocked, vi } from 'vitest';
import { GetMonthlySchedulingsOverviewByMedicalIdUseCase } from './get-monthly-schedulings-overview-by-medical-id';
import { MedicalSchedulerRepository } from '@/app/repositories/medical-scheduler.repository';
import dayjs from '@/core/config/dayjs.config';

describe('GetMonthlySchedulingsOverviewByMedicalIdUseCase', () => {
  let repo: Mocked<MedicalSchedulerRepository>;
  let useCase: GetMonthlySchedulingsOverviewByMedicalIdUseCase;

  beforeEach(() => {
    repo = mock<MedicalSchedulerRepository>();
    useCase = new GetMonthlySchedulingsOverviewByMedicalIdUseCase(repo);
  });

  it('should use current month when start and end are not provided', async () => {
    const fixed = new Date('2024-05-10T00:00:00.000Z');
    vi.useFakeTimers().setSystemTime(fixed);
    repo.getMonthlySchedulingOverviewByMedicalId.mockResolvedValue([]);

    await useCase.execute({ id: 'med-1' });

    const [, startArg, endArg] =
      repo.getMonthlySchedulingOverviewByMedicalId.mock.calls[0];
    const expectedStart = dayjs(fixed).startOf('month');
    const expectedEnd = dayjs(fixed).endOf('month');

    expect(startArg.toISOString().slice(0, 10)).toBe(
      expectedStart.format('YYYY-MM-DD'),
    );
    expect(endArg.toISOString().slice(0, 10)).toBe(
      expectedEnd.format('YYYY-MM-DD'),
    );

    vi.useRealTimers();
  });

  it('should forward provided start and end dates', async () => {
    const start = dayjs('2024-02-01').tz().startOf('day').toDate();
    const end = dayjs('2024-02-20').tz().endOf('day').toDate();
    repo.getMonthlySchedulingOverviewByMedicalId.mockResolvedValue([]);

    await useCase.execute({ id: 'med-1', start, end });

    const [, startArg, endArg] =
      repo.getMonthlySchedulingOverviewByMedicalId.mock.calls[0];

    expect(startArg.toISOString().slice(0, 10)).toBe('2024-02-01');
    expect(endArg.toISOString().slice(0, 10)).toBe('2024-02-20');
  });
});
