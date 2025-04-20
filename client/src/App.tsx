import { Toaster } from "react-hot-toast"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/DashBoard/Home"
import RegisterPage from "./Pages/Auth/RegisterPage"
import Login from "./Pages/Auth/Login"
import Dashboard from "./Pages/DashBoard/Dashboard"
import Settings from "./Pages/Settings/Settings"
import PreferencesPage from "./Pages/Settings/UpdatePreference"
import UpdatePassword from "./Pages/Settings/UpdatePassword"
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
