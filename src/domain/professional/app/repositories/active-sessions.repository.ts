export interface IActiveSessionRaw {
  id: string;
  userId: string;
  token: string;
  ip?: string | null;
  device?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  isActive: boolean;
  createdAt: Date;
  lastSeenAt?: Date;
}

export interface IActiveSessionsRepository {
  findByToken(token: string): Promise<IActiveSessionRaw | null>;
  findByUserId(userId: string): Promise<IActiveSessionRaw[] | null>;
  closeSession(token: string): Promise<void>;
  closeSessionById(id: string): Promise<void>;
  closeAllSessions(userId: string): Promise<void>;
  create(session: IActiveSessionRaw): Promise<void>;
}
