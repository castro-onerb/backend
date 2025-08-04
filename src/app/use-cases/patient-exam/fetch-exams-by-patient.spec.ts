import { mock } from 'vitest-mock-extended';
import { Mocked } from 'vitest';
import { FetchExamsByPatientUseCase } from './fetch-exams-by-patient.use-case';
import { PatientExamRepository } from '@/app/repositories/patient-exam.repository';
import { IPatientExamProps } from '@/domain/patient/@types/patient-exam';

describe('Fetch Exams By Patient Use Case', () => {
  let useCase: FetchExamsByPatientUseCase;
  let repo: Mocked<PatientExamRepository>;

  beforeEach(() => {
    repo = mock<PatientExamRepository>();
    useCase = new FetchExamsByPatientUseCase(repo);
  });

  it('should call repository with default page and per-page', async () => {
    repo.findByPatientId.mockResolvedValue([]);
    await useCase.execute({ patientId: 'pat-1' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findByPatientId).toHaveBeenCalledWith('pat-1', 1, 30);
  });

  it('should call repository with provided page', async () => {
    repo.findByPatientId.mockResolvedValue([]);
    await useCase.execute({ patientId: 'pat-1', page: 2 });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findByPatientId).toHaveBeenCalledWith('pat-1', 2, 30);
  });

  it('should return exams from repository', async () => {
    const exam: IPatientExamProps = {
      ticket: 't1',
      patientId: 'pat-1',
      examId: 'ex-1',
      professionalName: 'Dr. Who',
      procedure: 'Check',
      scheduledDate: new Date(),
      performedDate: new Date(),
      group: 'general',
      paid: true,
      status: 'done',
      estimatedDate: new Date(),
      createdAt: new Date(),
    };

    repo.findByPatientId.mockResolvedValue([exam]);

    const result = await useCase.execute({ patientId: 'pat-1' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.exams).toEqual([exam]);
    }
  });
});
