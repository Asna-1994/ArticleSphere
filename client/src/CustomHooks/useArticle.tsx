import React, { useCallback, useRef, useState } from 'react'
import { Article } from '../Pages/Dashboard';
import { blockArticle, disLikeArticle, getAllArticles, likeArticle } from '../services/articleService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

const useArticle = () => {

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [blockedArticles, setBlockedArticles] = useState<string[]>([]);
    const isFetchingRef = useRef(false);
    const { user } = useSelector(
        (state: RootState) => state.auth
      );

  const fetchArticles = async (page: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const response = await getAllArticles(page, 10);
      if (response.data.success) {
        const newArticles = response.data.articles;
        setArticles((prev) => [...prev, ...newArticles]);
        setHasMore(page < response.data.totalPages);
      } else {
        toast.error("Failed to fetch articles");
      }
    } catch (error: any) {
      toast.error(error.message || "Error fetching articles");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

    const observer = useRef<IntersectionObserver | null>(null);
    const lastArticleRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
  
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        });
  
        if (node) observer.current.observe(node);
      },
      [isLoading, hasMore, currentPage]
    );

    const handleLike = async (articleId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!user?._id)
          return toast.error("You must be logged in to like articles");
    
        try {
          const article = articles.find((a) => a._id === articleId);
          if (!article) return;
    
          const hasLiked = article.likes.some((like) => like._id === user._id);
    
          setArticles((prevArticles) =>
            prevArticles.map((article) => {
              if (article._id !== articleId) return article;
    
              if (hasLiked) {
                return {
                  ...article,
                  likes: article.likes.filter((like) => like._id !== user._id),
                };
              }
    
              return {
                ...article,
                likes: [
                  ...article.likes,
                  {
                    _id: user._id!,
                    firstName: user.firstName,
                    lastName: user.lastName,
                  },
                ],
                dislikes: article.dislikes.filter(
                  (dislike) => dislike._id !== user._id
                ),
              };
            })
          );
    
          if (selectedArticle && selectedArticle._id === articleId) {
            setSelectedArticle({
              ...selectedArticle,
              likes: hasLiked
                ? selectedArticle.likes.filter((like) => like._id !== user._id)
                : [
                    ...selectedArticle.likes,
                    {
                      _id: user._id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                    },
                  ],
              dislikes: selectedArticle.dislikes.filter(
                (dislike) => dislike._id !== user._id
              ),
            });
          }
    
          await likeArticle(articleId);
        } catch (error: any) {
          fetchArticles(currentPage);
          toast.error(error.message || "Failed to like article");
        }
      };
    
      const handleDislike = async (articleId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!user?._id)
          return toast.error("You must be logged in to dislike articles");
    
        try {
          const article = articles.find((a) => a._id === articleId);
          if (!article) return;
    
          const hasDisliked = article.dislikes.some(
            (dislike) => dislike._id === user._id!
          );
    
          setArticles((prevArticles) =>
            prevArticles.map((article) => {
              if (article._id !== articleId) return article;
    
              if (hasDisliked) {
                return {
                  ...article,
                  dislikes: article.dislikes.filter(
                    (dislike) => dislike._id !== user._id!
                  ),
                };
              }
    
              return {
                ...article,
                dislikes: [
                  ...article.dislikes,
                  {
                    _id: user._id!,
                    firstName: user.firstName,
                    lastName: user.lastName,
                  },
                ],
                likes: article.likes.filter((like) => like._id !== user._id),
              };
            })
          );
    
          if (selectedArticle && selectedArticle._id === articleId) {
            setSelectedArticle({
              ...selectedArticle,
              dislikes: hasDisliked
                ? selectedArticle.dislikes.filter(
                    (dislike) => dislike._id !== user._id
                  )
                : [
                    ...selectedArticle.dislikes,
                    {
                      _id: user._id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                    },
                  ],
              likes: selectedArticle.likes.filter((like) => like._id !== user._id),
            });
          }
    
          await disLikeArticle(articleId);
        } catch (error: any) {
          fetchArticles(currentPage);
          toast.error(error.message || "Failed to dislike article");
        }
      };
    
      const handleBlock = async (articleId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!user?._id)
          return toast.error("You must be logged in to block articles");
    
        try {
          setBlockedArticles((prev) => [...prev, articleId]);
    
          setArticles((prevArticles) =>
            prevArticles.filter((article) => article._id !== articleId)
          );
    
          if (selectedArticle && selectedArticle._id === articleId) {
            setShowModal(false);
          }
    
          await blockArticle(articleId);
        } catch (error: any) {
          fetchArticles(currentPage);
          setBlockedArticles((prev) => prev.filter((id) => id !== articleId));
          toast.error(error.message || "Failed to block article");
        }
      };
    
      const closeModal = () => {
        setShowModal(false);
        setSelectedArticle(null);
      };
    
      const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
    
      const hasUserLiked = (articleId: string): boolean => {
        if (!user?._id) return false;
    
        const article = articles.find((art) => art._id === articleId);
        return article
          ? article.likes.some((like) => like._id === user._id)
          : false;
      };
    
      const hasUserDisliked = (articleId: string): boolean => {
        if (!user?._id) return false;
    
        const article = articles.find((a) => a._id === articleId);
        return article
          ? article.dislikes.some((dislike) => dislike._id === user._id)
          : false;
      };

  return {lastArticleRef,showModal, setShowModal, setArticles, 
    articles, hasMore, handleArticleClick, hasUserDisliked,
     hasUserLiked, handleBlock,formatDate, closeModal,handleDislike,
      handleLike , setHasMore, setCurrentPage, fetchArticles,
    blockedArticles,setBlockedArticles , currentPage, isLoading,
     setIsLoading,selectedArticle, setSelectedArticle
}
}

export default useArticle
