import React, {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { imageObject } from "./Articles/MyArticles";
import useArticle from "../CustomHooks/useArticle";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

export interface populatedUserData {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Article {
  _id: string;
  title: string;
  description: string;
  imageUrls: imageObject[];
  tags: string[];
  content: string;
  category: {
    categoryName: string;
    _id: string;
  };
  createdAt: string;
  likes: populatedUserData[];
  dislikes: populatedUserData[];
  blocks: populatedUserData[];
  author: {
    firstName: string;
    lastName: string;
  };
  likesCount?: number;
  dislikesCount?: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const {  isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );


  const {lastArticleRef,showModal,  setArticles, 
    articles,  handleArticleClick, hasUserDisliked,
     hasUserLiked, handleBlock,formatDate, closeModal,handleDislike,
      handleLike , setHasMore, setCurrentPage, fetchArticles, 
    blockedArticles ,currentPage ,isLoading, 
  selectedArticle, } = useArticle()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setArticles([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [isAuthenticated, blockedArticles]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles(currentPage);
    }
  }, [currentPage, isAuthenticated]);


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Feed</h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <p className="text-center text-gray-500">
                No articles found in your feed. Try updating your preferences in
                settings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article, index) => {
                const isLast = index === articles.length - 1;
                return (
                  <div
                    key={article._id}
                    ref={isLast ? lastArticleRef : null}
                    className="bg-white shadow overflow-hidden rounded-lg transition-all hover:shadow-lg"
                  >
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                          {article.author.firstName.charAt(0)}
                          {article.author.lastName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {article.author.firstName} {article.author.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(article.createdAt)}
                          </p>
                        </div>
                        <span className="ml-auto inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                          {article.category.categoryName}
                        </span>
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() => handleArticleClick(article)}
                      >
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.content.substring(0, 150)}...
                        </p>

               
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

                        <div className="text-sm text-gray-500 mb-2">
                          <span>Tap to read more</span>
                        </div>
                      </div>

                      <div className="border-t pt-3 flex justify-between">
                        <div className="flex space-x-6">
                          <button
                            onClick={(e) => handleLike(article._id, e)}
                            className={`flex items-center ${
                              hasUserLiked(article._id)
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            }`}
                          >
                            <svg
                              className="h-5 w-5 mr-1"
                              fill={
                                hasUserLiked(article._id)
                                  ? "currentColor"
                                  : "none"
                              }
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </svg>
                            {article.likes.length}
                          </button>

                          <button
                            onClick={(e) => handleDislike(article._id, e)}
                            className={`flex items-center ${
                              hasUserDisliked(article._id)
                                ? "text-red-600"
                                : "text-gray-600 hover:text-red-600"
                            }`}
                          >
                            <svg
                              className="h-5 w-5 mr-1"
                              fill={
                                hasUserDisliked(article._id)
                                  ? "currentColor"
                                  : "none"
                              }
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2m0 4h.01M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {article.dislikes.length}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Article Modal */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                    {selectedArticle.author.firstName.charAt(0)}
                    {selectedArticle.author.lastName.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedArticle.author.firstName}{" "}
                      {selectedArticle.author.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(selectedArticle.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {selectedArticle.category.categoryName}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedArticle.title}
              </h2>

                                        {selectedArticle.imageUrls.length > 0 && (
  <div className="mb-6">
    <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay>
      {selectedArticle.imageUrls.map((imageObj: imageObject) => (
        <div key={imageObj.url}>
          <img src={imageObj.url} alt="Article" className="rounded-xl max-h-[400px] object-contain" />
        </div>
      ))}
    </Carousel>
  </div>
)}

              <div className="prose max-w-none mb-6 text-gray-700">
                {selectedArticle.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between">
                <div className="flex space-x-6">
                  <button
                    onClick={(e) => handleLike(selectedArticle._id, e)}
                    className={`flex items-center ${
                      hasUserLiked(selectedArticle._id)
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <svg
                      className="h-5 w-5 mr-1"
                      fill={
                        hasUserLiked(selectedArticle._id)
                          ? "currentColor"
                          : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    {selectedArticle.likes.length}
                  </button>

                  <button
                    onClick={(e) => handleDislike(selectedArticle._id, e)}
                    className={`flex items-center ${
                      hasUserDisliked(selectedArticle._id)
                        ? "text-red-600"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    <svg
                      className="h-5 w-5 mr-1"
                      fill={
                        hasUserDisliked(selectedArticle._id)
                          ? "currentColor"
                          : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2m0 4h.01M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {selectedArticle.dislikes.length}
                  </button>
                </div>

                <button
                  onClick={() => handleBlock(selectedArticle._id)}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
