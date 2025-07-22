import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum UserType {
  MEDICAL = 'medical',
  OPERATOR = 'operator',
  PATIENT = 'patient',
}

export class AuthLoginDto {
  @ApiProperty({ enum: UserType, example: UserType.MEDICAL })
  @IsEnum(UserType)
  type!: UserType;

  @ApiProperty({ example: '000000UF' })
  @IsString()
  access!: string;

  @ApiProperty({ example: 'senha@14' })
  @IsString()
  password!: string;
}
