import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class InitiatePatientAppointmentDto {
  @ApiProperty({ example: 123456 })
  @IsNumber()
  attendance_id!: number;
}
