export interface CreateActiveSessionRequest {
  userId: string;
  token: string;
  ip?: string;
  device?: string;
  latitude?: string;
  longitude?: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  token: string;
  isActive: boolean;
}

export abstract class ActiveSessionRepository {
  abstract create(data: CreateActiveSessionRequest): Promise<ActiveSession>;
  abstract findByToken(token: string): Promise<ActiveSession | null>;
  abstract updateToken(sessionId: string, token: string): Promise<void>;
  abstract invalidate(sessionId: string): Promise<void>;
}
