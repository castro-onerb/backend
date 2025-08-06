import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceRedisService } from './redis/attendance-redis.service';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { mapDomainErrorToHttp } from '@/core/errors/map-domain-errors-http';
import { MissingAuthenticatedUserError } from '../errors';

@ApiTags('Attendance')
@Controller('attendance')
export class FetchAttendancesInitializedController {
  constructor(private readonly redis: AttendanceRedisService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAttendance(@CurrentUser() user: UserPayload | null) {
    if (!user?.sub) {
      return mapDomainErrorToHttp(new MissingAuthenticatedUserError());
    }

    const attendances = await this.redis.getAttendances(Number(user.sub));

    return { attendances };
  }
}
