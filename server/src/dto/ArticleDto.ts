export interface CreateArticleDto {
    title: string;
    description: string;
    content: string;
    imageUrls: {
      url :string;
      publicId : string
    }[];
    tags: string[];
    category: string;
  }
  
  export interface UpdateArticleDto {
    title?: string;
    description?: string;
    content?: string;
    imageUrls?: {
      url :string;
      publicId : string
    }[];
    tags?: string[];
    category?: string;
  }