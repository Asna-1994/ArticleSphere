import  { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../../Components/Header';
import { getUserArticles } from '../../services/articleService';
import ArticleCard from './ArticleCard';
import { Article } from '../Dashboard';

export interface imageObject {
    
        url :string,
        publicId : string;
      
}



const MyArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getUserArticles()
        if (response.data.success) {
          setArticles(response.data.articles);
          console.log(response.data.articles)
        } else {
          toast.error(response.data.message || 'Failed to fetch articles');
        }
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong');
      }
    };

    fetchArticles();
  }, []);




  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Articles</h1>

        {articles.length === 0 ? (
          <p className="text-gray-600">You haven't written any articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article , index) => (
            <ArticleCard article={article} key={article._id}  index={index}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
