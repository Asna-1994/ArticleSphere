
import { Ban, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Article } from '../Dashboard';

export interface ArticleCardProps {
  article: Article;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();

  const navigateToDetails = (articleId: string, article: Article) => {
    navigate(`/articles/${articleId}`, { state: { article } });
  };

  return (
    <div
      key={article._id}
      className="bg-white rounded-2xl shadow-md p-4 transition hover:shadow-xl hover:scale-[1.01] duration-200 ease-in-out"
    >
      {article.imageUrls?.[0].url && (
        <div
          className="w-full rounded-xl overflow-hidden aspect-[16/9] mb-4 cursor-pointer"
          onClick={() => navigateToDetails(article._id, article)}
        >
          <img
            src={article.imageUrls[0].url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{article.title}</h2>

      <p className="text-gray-600 mt-2 text-sm line-clamp-3">
        {article.description}
      </p>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 flex-wrap gap-2">
        <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
          {article.category.categoryName}
        </span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {article.tags.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center border-t pt-3 text-gray-600 text-sm">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4 text-green-500" />
          <span>{article.likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown className="w-4 h-4 text-red-500" />
          <span>{article.dislikes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Ban className="w-4 h-4 text-gray-500" />
          <span>{article.blocks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
