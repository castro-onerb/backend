import { ApiProperty } from '@nestjs/swagger';

export class RequirementDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  satisfied!: boolean;
}

export class AuthRequirementsResponseDto {
  @ApiProperty({ type: [RequirementDto] })
  requirements!: RequirementDto[];
}
