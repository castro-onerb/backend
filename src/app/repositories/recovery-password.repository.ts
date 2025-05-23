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

export interface IRecoveryPasswordRepository {
  save(data: IRecoveryPasswordRequest): Promise<void>;

  findByEmailAndCode(
    email: string,
    code: string,
  ): Promise<(IRecoveryPasswordRequest & { id: string }) | null>;

  invalidateCode(id: string): Promise<void>;
  invalidateAllCodesByEmailOrUser({
    email,
    user,
  }: IInvalidateAllCodesByEmailOrUserRequest): Promise<boolean>;
  findLastUsedCode(
    email: string,
  ): Promise<(IRecoveryPasswordRequest & { id: string }) | null>;
}
