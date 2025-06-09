

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { imageObject } from "../Articles/MyArticles";
import useArticle from "../../CustomHooks/useArticle";
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
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    lastArticleRef, showModal, setArticles,
    articles, handleArticleClick, hasUserDisliked,
    hasUserLiked, handleBlock, formatDate, closeModal, handleDislike,
    handleLike, setHasMore, setCurrentPage, fetchArticles,
    blockedArticles, currentPage, isLoading,
    selectedArticle, hasMore // Make sure this is available from your useArticle hook
  } = useArticle()

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Header />

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Feed
          </h1>

          {isLoading && articles.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 transition-colors duration-200">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No articles found in your feed. Try updating your preferences in
                settings.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {articles.map((article, index) => {
                  const isLast = index === articles.length - 1;
                  return (
                    <div
                      key={article._id}
                      ref={isLast ? lastArticleRef : null}
                      className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg transition-all hover:shadow-lg duration-200"
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                            {article.author.firstName.charAt(0)}
                            {article.author.lastName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {article.author.firstName} {article.author.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(article.createdAt)}
                            </p>
                          </div>
                          <span className="ml-auto inline-block px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {article.category.categoryName}
                          </span>
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => handleArticleClick(article)}
                        >
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {article.title}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
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

                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span>Tap to read more</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                          <div className="flex space-x-6">
                            <button
                              onClick={(e) => handleLike(article._id, e)}
                              className={`flex items-center transition-colors duration-200 ${
                                hasUserLiked(article._id)
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
                              className={`flex items-center transition-colors duration-200 ${
                                hasUserDisliked(article._id)
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
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

              {/* Loading indicator for more posts */}
              {isLoading && articles.length > 0 && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading more posts...</span>
                </div>
              )}

              {/* No more posts indicator */}
              {!hasMore && !isLoading && articles.length > 0 && (
                <div className="py-8">
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <svg 
                        className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        You've reached the end! No more posts to load.
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Check back later for new content
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
          aria-label="Back to top"
        >
          <svg 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}

      {/* Article Modal */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                    {selectedArticle.author.firstName.charAt(0)}
                    {selectedArticle.author.lastName.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedArticle.author.firstName}{" "}
                      {selectedArticle.author.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(selectedArticle.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
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
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {selectedArticle.category.categoryName}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
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

              <div className="prose max-w-none mb-6 text-gray-700 dark:text-gray-300">
                {selectedArticle.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                <div className="flex space-x-6">
                  <button
                    onClick={(e) => handleLike(selectedArticle._id, e)}
                    className={`flex items-center transition-colors duration-200 ${
                      hasUserLiked(selectedArticle._id)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
                    className={`flex items-center transition-colors duration-200 ${
                      hasUserDisliked(selectedArticle._id)
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
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
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
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
