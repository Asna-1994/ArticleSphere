
import { Route, Routes } from 'react-router-dom'
import CreateArticle from '../Pages/Articles/CreateArticle'
import MyArticles from '../Pages/Articles/MyArticles'
import ArticleDetails from '../Pages/Articles/ArticleDetails'


const ArticleRoutes = () => {

  return (
  <Routes>
    <Route path='create' element={<CreateArticle/>} />
    <Route path='my-articles' element={<MyArticles/>} />
    <Route path=':articleId' element={<ArticleDetails/>}/>
  </Routes>
  )
}

export default ArticleRoutes
