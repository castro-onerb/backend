import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InvalidateCodeRecoveryDto {
  @ApiProperty({ example: 'username@deovita.com.br' })
  @IsString()
  email!: string;
}
