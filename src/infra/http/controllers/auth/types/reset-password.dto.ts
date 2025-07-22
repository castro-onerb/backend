import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Email associado à conta que deseja redefinir a senha',
  })
  email!: string;

  @ApiProperty({
    example: 'ABCD12',
    description: 'Código de verificação recebido por email',
    minLength: 6,
  })
  code!: string;

  @ApiProperty({
    example: 'NovaSenha@123',
    description: 'Nova senha a ser definida',
  })
  password!: string;
}
