import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IRecoveryPasswordRepository,
  IRecoveryPasswordRequest,
} from './@types/interface-recovery-password';

@Injectable()
export class PrismaRecoveryPasswordRepository
  implements IRecoveryPasswordRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save({
    userId,
    email,
    code,
    expiresAt,
  }: IRecoveryPasswordRequest): Promise<void> {
    await this.prisma.passwordRecovery.create({
      data: {
        userId: userId.toString(),
        email,
        code,
        expiresAt,
      },
    });
  }

  async findByEmailAndCode(email: string, code: string) {
    const result = await this.prisma.passwordRecovery.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      select: {
        userId: true,
        email: true,
        code: true,
        expiresAt: true,
      },
    });

    if (!result) return null;

    return {
      userId: String(result.userId),
      email: result.email,
      code: result.code,
      expiresAt: result.expiresAt,
    };
  }

  async invalidateCode(id: string) {
    await this.prisma.passwordRecovery.update({
      where: { id },
      data: { used: true },
    });
  }
}
