export interface IRecoveryPasswordRequest {
  userId: string;
  email: string;
  code: string;
  expiresAt: Date | null;
}

export interface IRecoveryPasswordRepository {
  save(data: IRecoveryPasswordRequest): Promise<void>;

  findByEmailAndCode(
    email: string,
    code: string,
  ): Promise<IRecoveryPasswordRequest | null>;

  invalidateCode(code: string): Promise<void>;
}
