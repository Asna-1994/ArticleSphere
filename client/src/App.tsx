import { Toaster } from "react-hot-toast"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import RegisterPage from "./Pages/RegisterPage"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import Settings from "./Pages/Settings"
import PreferencesPage from "./Pages/UpdatePreference"
import UpdatePassword from "./Pages/UpdatePassword"
import ArticleRoutes from "./routes/ArticleRoutes"
import NotFound from "./Pages/NotFound"



const App = () => {

  return (
    <BrowserRouter>

    <Toaster position="top-right" reverseOrder={false} />
<Routes>
<Route path="/" element={<Home/>}/>
<Route  path="/register" element={<RegisterPage/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/dashboard"  element={<Dashboard/>}/>
<Route path="/settings" element={<Settings/>} />
<Route path="*" element={<NotFound/>}/>

<Route path="/update-preferences" element={<PreferencesPage/>}/>
<Route path="/update-password" element={<UpdatePassword/>} />
<Route  path="/articles/*" element={<ArticleRoutes/>}/>
</Routes>
</BrowserRouter>
  )
}

export default App
