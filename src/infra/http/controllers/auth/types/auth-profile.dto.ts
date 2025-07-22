import { ApiProperty } from '@nestjs/swagger';

export class AuthProfileResponseDto {
  @ApiProperty()
  sub!: string;

  @ApiProperty({ required: false })
  name!: string;

  @ApiProperty({ enum: ['medical', 'operator', 'patient'] })
  role!: 'medical' | 'operator' | 'patient';

  @ApiProperty()
  iat!: number;

  @ApiProperty()
  exp!: number;
}
