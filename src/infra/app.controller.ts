import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaClinicasService } from '@/infra/database/prisma/clinicas/prisma-clinicas.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('health')
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaClinicas: PrismaClinicasService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Retorna o status de disponibilidade da aplicação',
    schema: {
      example: {
        success: true,
        uptime: 4.2410061,
        timestamp: 1753188101025,
      },
    },
  })
  async check(): Promise<{
    success: boolean;
    uptime: number;
    timestamp: number;
  }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      await this.prismaClinicas.$queryRaw`SELECT 1`;
    } catch {
      throw new HttpException(
        'Um ou mais serviços de banco de dados estão indisponíveis',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      success: true,
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }
}
