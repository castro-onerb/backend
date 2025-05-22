import {
  IInvalidateAllCodesByEmailOrUserRequest,
  IRecoveryPasswordRepository,
  IRecoveryPasswordRequest,
} from '@/domain/professional/app/repositories/recovery-password.repository';

export class InMemoryRecoveryPasswordRepository
  implements IRecoveryPasswordRepository
{
  recoveryRequests: (IRecoveryPasswordRequest & {
    id: string;
    used: boolean;
    createdAt: Date;
    expiresAt: Date;
  })[] = [];

  async save(data: IRecoveryPasswordRequest): Promise<void> {
    const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10);
    this.recoveryRequests.push({
      id,
      userId: data.userId,
      email: data.email,
      code: data.code,
      used: false,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
    });
    return Promise.resolve();
  }

  async findByEmailAndCode(
    email: string,
    code: string,
  ): Promise<(IRecoveryPasswordRequest & { id: string }) | null> {
    const request = this.recoveryRequests.find(
      (r) => r.email === email && r.code === code,
    );
    return Promise.resolve(request ?? null);
  }

  async invalidateCode(id: string): Promise<void> {
    const request = this.recoveryRequests.find((r) => r.id === id);
    if (request) {
      request.used = true;
    }
    return Promise.resolve();
  }

  async invalidateAllCodesByEmailOrUser({
    email,
    user,
  }: IInvalidateAllCodesByEmailOrUserRequest): Promise<boolean> {
    let found = false;
    this.recoveryRequests.forEach((r) => {
      if ((email && r.email === email) || (user && r.userId === user)) {
        if (!r.used) {
          r.used = true;
          found = true;
        }
      }
    });
    return Promise.resolve(found);
  }

  async findLastUsedCode(
    email: string,
  ): Promise<(IRecoveryPasswordRequest & { id: string }) | null> {
    const now = new Date();
    for (let i = this.recoveryRequests.length - 1; i >= 0; i--) {
      const r = this.recoveryRequests[i];
      if (r.email === email && r.used && r.expiresAt > now) {
        console.log(r);
        return Promise.resolve(r);
      }
    }
    return Promise.resolve(null);
  }

  clear() {
    this.recoveryRequests = [];
  }
}
