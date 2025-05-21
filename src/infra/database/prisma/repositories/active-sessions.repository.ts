import {
  IActiveSessionRaw,
  IActiveSessionsRepository,
} from '@/domain/professional/app/repositories/active-sessions.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaActiveSessionsRepository
  implements IActiveSessionsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<IActiveSessionRaw | null> {
    return this.prisma.activeSession.findUnique({
      where: { token },
    });
  }

  findByUserId(userId: string): Promise<IActiveSessionRaw[] | null> {
    throw new Error('Method not implemented.');
  }

  async closeSession(token: string): Promise<void> {
    await this.prisma.activeSession.updateMany({
      where: {
        token,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  closeSessionById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  closeAllSessions(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(session: IActiveSessionRaw): Promise<void> {
    await this.prisma.activeSession.create({
      data: {
        userId: session.userId,
        token: session.token,
        createdAt: session.createdAt,
        device: session.device,
        ip: session.ip,
        isActive: session.isActive,
        longitude: session.longitude,
        latitude: session.latitude,
        lastSeenAt: session.lastSeenAt,
      },
    });
  }
}
