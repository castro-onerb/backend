export interface MailPayload {
  to: string | string[];
  subject: string;
  body?: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: {
    filename: string;
    path: string;
  }[];
  template?: string;
  context?: Record<string, any>;
}

export abstract class MailEntity {
  abstract send(payload: MailPayload): Promise<void>;
}
