import { Model, Document } from 'mongoose';
import { IBaseRepository } from '../interfaces/BaseRepository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async findAll(): Promise<T[]> {
    return this._model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return this._model.findById(id).exec();
  }

  async create(item: any): Promise<T> {
    return this._model.create(item);
  }

  async update(id: string, item: any): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this._model.findByIdAndDelete(id).exec();
    return !!result;
  }
}