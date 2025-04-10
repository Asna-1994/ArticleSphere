

import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../../Components/Header';
import { ThumbsUp, ThumbsDown, Ban } from 'lucide-react';
import { useState } from 'react';
import { deleteArticleService } from '../../services/articleService';
import { Article } from '../Dashboard';
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
          <div className="min-h-screen flex justify-center items-center">
            <div className="animate-pulse text-gray-400 text-lg">Loading article...</div>
          </div>
        );
      }
      


  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{article.title}</h1>
        <p className="text-gray-600 text-md mb-4">{article.description}</p>

        <div className="flex items-center justify-between flex-wrap text-sm text-gray-500 mb-6">
          <span className="bg-gray-200 px-3 py-1 rounded-full">{article.category.categoryName}</span>
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


        <div className="prose max-w-none prose-sm text-gray-800 mb-6">
          <p>{article.content}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className='flex justify-between flex-wrap gap-4 items-center mt-6 border-t pt-4 text-sm text-gray-700'>
          <div className="flex gap-4">
            <button onClick={() => openModal('likes')} className="flex items-center gap-1 hover:underline">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <span>{article.likes.length}</span>
            </button>
            <button onClick={() => openModal('dislikes')} className="flex items-center gap-1 hover:underline">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              <span>{article.dislikes.length}</span>
            </button>
            <button onClick={() => openModal('blocks')} className="flex items-center gap-1 hover:underline">
              <Ban className="w-5 h-5 text-gray-500" />
              <span>{article.blocks.length}</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigateToEdit(article)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Edit
            </button>
            <button
              onClick={() => openDeleteModal(article._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Interaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold capitalize">{modalType} ({getUserList().length})</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500">✖</button>
            </div>

            {getUserList().length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {getUserList().map((user: { _id: string, firstName: string, lastName: string }) => (
                  <li key={user._id} className="border-b py-1 text-gray-700">
                    {`${user.firstName} ${user.lastName}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No users found.</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && articleToDeleteId && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg text-center">
            <p className="text-gray-800 text-lg font-medium mb-4">Are you sure you want to delete this article?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteArticle(articleToDeleteId)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
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
