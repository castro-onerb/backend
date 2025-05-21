import { Entity } from '@/core/entities/entity';
import { ISessionProps } from '../@types/session';
import { UniqueID } from '@/core/object-values/unique-id';

export class Session extends Entity<ISessionProps> {
  constructor(props: ISessionProps, id?: UniqueID) {
    super(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  static create(props: ISessionProps, id?: UniqueID) {
    return new Session(
      {
        ...props,
        lastSeenAt: new Date(),
      },
      id,
    );
  }

  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get ip(): string | undefined {
    return this.props.ip;
  }

  get device(): string | undefined {
    return this.props.device;
  }

  get latitude(): string | undefined {
    return this.props.latitude;
  }

  get longitude(): string | undefined {
    return this.props.longitude;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastSeenAt(): Date | undefined {
    return this.props.lastSeenAt;
  }

  public close() {
    this.props.isActive = false;
  }
}
