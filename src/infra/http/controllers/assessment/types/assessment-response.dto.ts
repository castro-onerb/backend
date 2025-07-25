import { ApiProperty } from '@nestjs/swagger';

export class AssessmentResponseDto {
  @ApiProperty({
    description: 'ID do atendimento',
    example: '123456',
  })
  attendance_id!: string;

  @ApiProperty({
    description: 'ID do paciente',
    example: '123456',
  })
  patient_id!: string;

  @ApiProperty({
    description: 'Peso do paciente',
    example: '62.2',
    nullable: true,
  })
  weight!: string | null;

  @ApiProperty({
    description: 'Altura do paciente',
    example: '1.72m',
    nullable: true,
  })
  height!: string | null;

  @ApiProperty({
    description: 'Pressão arterial',
    example: '120/80',
    nullable: true,
  })
  blood_pressure!: string | null;

  @ApiProperty({
    description: 'Frequência cardíaca',
    example: 80,
    nullable: true,
  })
  heart_rate!: number | null;

  @ApiProperty({
    description: 'Frequência respiratória',
    example: 18,
    nullable: true,
  })
  respiratory_rate!: number | null;

  @ApiProperty({
    description: 'Temperatura corporal',
    example: '38',
    nullable: true,
  })
  temperature!: string | null;

  @ApiProperty({
    description: 'Saturação de oxigênio',
    example: 98,
    nullable: true,
  })
  oxygen_saturation!: number | null;

  @ApiProperty({
    description: 'Glicemia',
    example: 90,
    nullable: true,
  })
  glycemia!: number | null;

  @ApiProperty({
    description: 'Padrão da pressão',
    example: 'Padrão',
    nullable: true,
  })
  pressure_pattern!: string | null;

  @ApiProperty({
    description: 'Queixa principal',
    example: 'Dores abdominais, diarreia, dor de cabeça, febre.',
    nullable: true,
  })
  chief_complaint!: string | null;

  @ApiProperty({
    description: 'Escala de dor (0-10)',
    example: 8,
    nullable: true,
  })
  pain_score!: number | null;

  @ApiProperty({
    description: 'Localização da dor',
    example: 'Cabeça, Abdominal',
    nullable: true,
  })
  pain_location!: string | null;

  @ApiProperty({
    description: 'Tipo de dor',
    example: 'Pressão',
    nullable: true,
  })
  pain_type!: string | null;

  @ApiProperty({
    description: 'Fatores relacionados à dor',
    example: '',
    nullable: true,
  })
  pain_factors!: string | null;

  @ApiProperty({
    description: 'Lista de comorbidades',
    example: ['Diabetes', 'Hipertensão'],
    nullable: true,
    isArray: true,
    type: String,
  })
  comorbidities!: string[] | null;

  @ApiProperty({
    description: 'Lista de sintomas',
    example: ['Febre', 'Dor de cabeça'],
    nullable: true,
    isArray: true,
    type: String,
  })
  symptoms!: string[] | null;
}
