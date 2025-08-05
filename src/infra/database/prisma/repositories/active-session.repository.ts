import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ActiveSession,
  ActiveSessionRepository,
  CreateActiveSessionRequest,
} from '@/app/repositories/active-session.repository';

@Injectable()
export class PrismaActiveSessionRepository implements ActiveSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateActiveSessionRequest): Promise<ActiveSession> {
    const session = await this.prisma.activeSession.create({
      data: {
        userId: data.userId,
        token: data.token,
        ip: data.ip,
        device: data.device,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      token: session.token,
      isActive: session.isActive,
    };
  }

  async findByToken(token: string): Promise<ActiveSession | null> {
    const session = await this.prisma.activeSession.findUnique({
      where: { token },
    });

    if (!session) return null;

    return {
      id: session.id,
      userId: session.userId,
      token: session.token,
      isActive: session.isActive,
    };
  }

  async updateToken(sessionId: string, token: string): Promise<void> {
    await this.prisma.activeSession.update({
      where: { id: sessionId },
      data: { token },
    });
  }

  async invalidate(sessionId: string): Promise<void> {
    await this.prisma.activeSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }
}
