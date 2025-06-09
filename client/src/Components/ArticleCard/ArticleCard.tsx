

import { Ban, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Article } from '../../Pages/DashBoard/Dashboard';

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
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg p-4 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl dark:hover:shadow-2xl hover:scale-[1.01] duration-200 ease-in-out"
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

      <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 transition-colors duration-200">
        {article.title}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-3 transition-colors duration-200">
        {article.description}
      </p>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 flex-wrap gap-2 transition-colors duration-200">
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs transition-colors duration-200">
          {article.category.categoryName}
        </span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {article.tags.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full transition-colors duration-200"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-3 text-gray-600 dark:text-gray-400 text-sm transition-colors duration-200">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4 text-green-500 dark:text-green-400 transition-colors duration-200" />
          <span>{article.likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown className="w-4 h-4 text-red-500 dark:text-red-400 transition-colors duration-200" />
          <span>{article.dislikes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Ban className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
          <span>{article.blocks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
