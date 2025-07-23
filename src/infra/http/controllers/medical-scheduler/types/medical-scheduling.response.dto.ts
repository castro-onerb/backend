import { ApiProperty } from '@nestjs/swagger';

export class MedicalSchedulingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ nullable: true, example: '123456' })
  patientId!: string | null;

  @ApiProperty({ example: 'scheduled' })
  status!: string;

  @ApiProperty({ example: 'João da Silva' })
  patientName!: string;

  @ApiProperty({
    example: { key: 'M', label: 'Masculino' },
    enum: ['M', 'F'],
  })
  gender!: {
    key: 'M' | 'F';
    label: 'Masculino' | 'Feminino' | 'Outro';
  };

  @ApiProperty({ enum: ['urgency', 'special', 'priority', 'normal'] })
  queueType!: 'urgency' | 'special' | 'priority' | 'normal';

  @ApiProperty({ enum: ['in_person', 'telemedicine', 'unknown'] })
  modality!: 'in_person' | 'telemedicine' | 'unknown';

  @ApiProperty({ example: '2025-07-22T14:00:00.000Z' })
  dateAtendance!: string;

  @ApiProperty()
  laudo!: string;

  @ApiProperty()
  exame!: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  birth!: string;

  @ApiProperty()
  paid!: boolean;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  procedure!: string;

  @ApiProperty()
  confirmed!: boolean;

  @ApiProperty({ example: null, nullable: true })
  canceledAt!: string | null;
}

export class MedicalSchedulingListResponseDto {
  @ApiProperty({ type: [MedicalSchedulingResponseDto] })
  schedulings!: MedicalSchedulingResponseDto[];
}
