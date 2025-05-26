import { MailEntity, MailPayload } from './mail.entity';

export class FakeMailEntity extends MailEntity {
  async send(_: MailPayload): Promise<void> {}
}
