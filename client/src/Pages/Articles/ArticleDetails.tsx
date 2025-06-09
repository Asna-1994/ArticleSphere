

import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../../Components/Header/Header';
import { ThumbsUp, ThumbsDown, Ban } from 'lucide-react';
import { useState } from 'react';
import { deleteArticleService } from '../../services/articleService';
import { Article } from '../DashBoard/Dashboard';
import { imageObject } from './MyArticles';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const ArticleDetails = () => {
  const location = useLocation();
  const { article } = location.state;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'likes' | 'dislikes' | 'blocks' | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const openModal = (type: 'likes' | 'dislikes' | 'blocks') => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const deleteArticle = async (articleId: string) => {
    try {
      const response = await deleteArticleService(articleId);
      if (response.data.success) {
        toast.success('Article deleted successfully');
        navigate('/my-articles');
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openDeleteModal = (articleId: string) => {
    setDeleteModalOpen(true);
    setArticleToDeleteId(articleId);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setArticleToDeleteId(null);
  };

  const navigateToEdit = (article: Article) => {
    navigate(`/articles/create`, { state: { article } });
  };

  const getUserList = () => {
    switch (modalType) {
      case 'likes':
        return article.likes;
      case 'dislikes':
        return article.dislikes;
      case 'blocks':
        return article.blocks;
      default:
        return [];
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center transition-colors duration-200">
        <div className="animate-pulse text-gray-400 dark:text-gray-500 text-lg">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-200">
          {article.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-md mb-4 transition-colors duration-200">
          {article.description}
        </p>

        <div className="flex items-center justify-between flex-wrap text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-200">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full transition-colors duration-200">
            {article.category.categoryName}
          </span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          {article.author?.firstName && (
            <span className="italic">By {article.author.firstName} {article.author.lastName}</span>
          )}
        </div>

        {article.imageUrls.length > 0 && (
          <div className="mb-6">
            <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay>
              {article.imageUrls.map((imageObj: imageObject) => (
                <div key={imageObj.url}>
                  <img src={imageObj.url} alt="Article" className="rounded-xl max-h-[400px] object-contain" />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        <div className="prose max-w-none prose-sm text-gray-800 dark:text-gray-200 mb-6 transition-colors duration-200">
          <p>{article.content}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className='flex justify-between flex-wrap gap-4 items-center mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200'>
          <div className="flex gap-4">
            <button onClick={() => openModal('likes')} className="flex items-center gap-1 hover:underline">
              <ThumbsUp className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span>{article.likes.length}</span>
            </button>
            <button onClick={() => openModal('dislikes')} className="flex items-center gap-1 hover:underline">
              <ThumbsDown className="w-5 h-5 text-red-500 dark:text-red-400" />
              <span>{article.dislikes.length}</span>
            </button>
            <button onClick={() => openModal('blocks')} className="flex items-center gap-1 hover:underline">
              <Ban className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>{article.blocks.length}</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigateToEdit(article)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => openDeleteModal(article._id)}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Interaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 dark:bg-black/40 flex justify-center items-center transition-colors duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold capitalize text-gray-800 dark:text-white transition-colors duration-200">
                {modalType} ({getUserList().length})
              </h3>
              <button 
                onClick={closeModal} 
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
              >
                ✖
              </button>
            </div>

            {getUserList().length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {getUserList().map((user: { _id: string, firstName: string, lastName: string }) => (
                  <li key={user._id} className="border-b border-gray-200 dark:border-gray-600 py-1 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    {`${user.firstName} ${user.lastName}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No users found.</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && articleToDeleteId && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 dark:bg-black/40 flex justify-center items-center transition-colors duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-lg text-center transition-colors duration-200">
            <p className="text-gray-800 dark:text-gray-200 text-lg font-medium mb-4 transition-colors duration-200">
              Are you sure you want to delete this article?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteArticle(articleToDeleteId)}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetails;
