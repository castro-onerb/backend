import { UniqueID } from '@/core/object-values/unique-id';

export interface IExamProps {
  id: UniqueID;
  name: string;
  description?: string;
  preparationInstructions?: string;
  durationInMinutes?: number;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}
