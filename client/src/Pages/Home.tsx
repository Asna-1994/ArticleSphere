import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { useSelector } from 'react-redux';
import DashboardPage from './Dashboard';
import { RootState } from '../Redux/store';



const HomePage: React.FC = () => {

  const navigate = useNavigate();
  const {  isAuthenticated }= useSelector((state:RootState) => state.auth)


  if(isAuthenticated){
    return <DashboardPage/>
  }


  return (
    <div>
<Header/>
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">
        Welcome to <span className="text-blue-600">ArticleSphere</span>
      </h1>
      <p className="text-gray-600 text-center text-lg max-w-xl mb-8">
        Discover insightful articles, express your opinions, and connect with other curious minds. Sign in to get started or browse freely.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow transition"
        >
       Signup
        </button>
      </div>
    </div>
    </div>
 
  );
};

export default HomePage;
