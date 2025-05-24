import { OperatorRepository } from '@/app/repositories/operator.repository';
import { SendNotificationUseCase } from '@/app/use-cases/notification/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { AccessOperatorAccountEvent } from '@/domain/professional/events/access-operator-account.event';

export class OnAccessOperatorAccount implements EventHandler {
  constructor(
    private operatorRepository: OperatorRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAccessOperatorNotification.bind(this),
      AccessOperatorAccountEvent.name,
    );
  }

  private async sendNewAccessOperatorNotification({
    operator,
  }: AccessOperatorAccountEvent) {
    const op = await this.operatorRepository.findByUsername(operator.username);

    if (op) {
      const findOperator = op[0];

      await this.sendNotification.execute({
        recipientId: findOperator.id,
        title: 'Alerta de segurança',
        content: 'Percebemos um novo acesso a sua conta',
      });
    }
  }
}
