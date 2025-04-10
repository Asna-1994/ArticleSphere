import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  description: string;
  content: string;
  imageUrls: {
    url: string;
    publicId: string; 
  }[];
  tags: string[];
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  blocks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Article description is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Article content is required']
    },
    imageUrls: [{
      url: String,
      public_id: String,
    }],
    tags: [{
      type: String,
      trim: true
    }],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    dislikes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    blocks: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
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

export default mongoose.model<IArticle>('Article', ArticleSchema);