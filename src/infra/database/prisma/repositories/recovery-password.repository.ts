import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IInvalidateAllCodesByEmailOrUserRequest,
  IRecoveryPasswordRepository,
  IRecoveryPasswordRequest,
} from '@/domain/professional/app/repositories/recovery-password.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaRecoveryPasswordRepository
  implements IRecoveryPasswordRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async invalidateAllCodesByEmailOrUser({
    email,
    user,
  }: IInvalidateAllCodesByEmailOrUserRequest) {
    const conditions: Prisma.PasswordRecoveryWhereInput[] = [];

    if (email) {
      conditions.push({ email });
    }
    if (user) {
      conditions.push({ userId: user });
    }

    if (conditions.length === 0) {
      throw new Error(
        "Informe 'email' ou 'usuário' para invalidar os códigos.",
      );
    }
    const resultPrisma = await this.prisma.passwordRecovery.updateMany({
      where: {
        used: false,
        OR: conditions,
      },
      data: {
        used: true,
        expiresAt: new Date(),
      },
    });

    if (resultPrisma.count === 0) {
      return false;
    }

    return true;
  }

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
        id: true,
        userId: true,
        email: true,
        code: true,
        expiresAt: true,
      },
    });

    if (!result) return null;

    return {
      id: result.id,
      userId: String(result.userId),
      email: result.email,
      code: result.code,
      expiresAt: result.expiresAt,
    };
  }

  async findLastUsedCode(email: string) {
    return this.prisma.passwordRecovery.findFirst({
      where: {
        email,
        used: true,
      },
      orderBy: {
        expiresAt: 'desc',
      },
    });
  }

  async invalidateCode(id: string) {
    await this.prisma.passwordRecovery.update({
      where: { id },
      data: { used: true },
    });
  }
}
