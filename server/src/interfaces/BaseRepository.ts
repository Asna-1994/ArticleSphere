import { Document } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: any): Promise<T>;
  update(id: string, item: any): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}