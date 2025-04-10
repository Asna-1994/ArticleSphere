import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  categoryName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);