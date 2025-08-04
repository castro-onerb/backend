import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty({ example: 'username@deovita.com.br' })
  @IsEmail()
  email!: string;
}
