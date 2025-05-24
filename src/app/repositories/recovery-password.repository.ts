export interface IRecoveryPasswordRequest {
  userId: string;
  email: string;
  code: string;
  expiresAt: Date;
}

export interface IInvalidateAllCodesByEmailOrUserRequest {
  email?: string;
  user?: string;
}

export abstract class RecoveryPasswordRepository {
  abstract save(data: IRecoveryPasswordRequest): Promise<void>;

  abstract findByEmailAndCode(
    email: string,
    code: string,
  ): Promise<(IRecoveryPasswordRequest & { id: string }) | null>;

  abstract invalidateCode(id: string): Promise<void>;
  abstract invalidateAllCodesByEmailOrUser({
    email,
    user,
  }: IInvalidateAllCodesByEmailOrUserRequest): Promise<boolean>;
  abstract findLastUsedCode(
    email: string,
  ): Promise<(IRecoveryPasswordRequest & { id: string }) | null>;
}
