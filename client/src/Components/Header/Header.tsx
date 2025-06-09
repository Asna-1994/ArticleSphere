// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../Redux/store";
// import { Link, useNavigate } from "react-router-dom";
// import { logoutService } from "../../services/authServices";
// import toast from "react-hot-toast";
// import { logOut } from "../../Redux/slices/authSlice";
// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, Menu, X ,Sun, Moon} from "lucide-react";
// import { toggleTheme } from "../../Redux/slices/themeSlice";

// const Header = () => {
//   const { user, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const { isDark} = useSelector((state:RootState) => state.theme)

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [articleDropdownOpen, setArticleDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLLIElement>(null);
//   const articleDropdownRef = useRef<HTMLLIElement>(null);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       const response = await logoutService();
//       if (response.data.success) {
//         toast.success("Successfully logged out");
//         dispatch(logOut());
//         navigate("/");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   const handleThemeToggle = () => {
//     dispatch(toggleTheme())
//   }

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }

//       if (
//         articleDropdownRef.current &&
//         !articleDropdownRef.current.contains(event.target as Node)
//       ) {
//         setArticleDropdownOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <header className="bg-gray-100 py-4 shadow-md">
//       <div className="container mx-auto px-6">
//         <div className="flex justify-between items-center">
//         <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 text-center ">
//         <span className="text-black">ArticleSphere</span>
//       </h1>

//           <nav className="hidden md:block">
//             <ul className="flex flex-row gap-6 text-gray-600">
//               <li>
//                 <Link
//                   to="/"
//                   className="hover:text-blue-500 transition duration-200"
//                 >
//                   Home
//                 </Link>
//               </li>

//               {isAuthenticated && (
//                 <li className="relative" ref={articleDropdownRef}>
//                   <button
//                     onClick={() => setArticleDropdownOpen((prev) => !prev)}
//                     className="flex items-center gap-1 hover:text-blue-500 transition duration-200"
//                   >
//                     Articles <ChevronDown size={16} />
//                   </button>

//                   {articleDropdownOpen && (
//                     <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
//                       <Link
//                         to="/articles/create"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       >
//                         Create Article
//                       </Link>
//                       <Link
//                         to="/articles/my-articles"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       >
//                         My Articles
//                       </Link>
//                     </div>
//                   )}
//                 </li>
//               )}


//                    <li>
//                 <button
//                   onClick={handleThemeToggle}
//                   className={`p-2 rounded-lg ${isDark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'} transition duration-200`}
//                   aria-label="Toggle theme"
//                 >
//                   {isDark ? <Sun size={20} /> : <Moon size={20} />}
//                 </button>
//               </li>

//               {isAuthenticated ? (
//                 <>
//                   <li className="relative" ref={dropdownRef}>
//                     <button
//                       onClick={() => setDropdownOpen((prev) => !prev)}
//                       className="flex items-center gap-1 hover:text-green-500 transition duration-200"
//                     >
//                       <span>{user?.firstName}</span>
//                       <ChevronDown size={16} />
//                     </button>

//                     {dropdownOpen && (
//                       <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4">
//                         <div className="mb-2 flex justify-center items-center gap-2">
//                           <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
//                             {user?.firstName?.[0]?.toUpperCase() || "U"}
//                           </div>
//                           <div>
//                             <p className="text-sm font-semibold">
//                               {user?.firstName}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {user?.email}
//                             </p>
//                           </div>
//                         </div>
//                         <hr className="my-2" />
//                         <Link
//                           to="/settings"
//                           className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
//                         >
//                           Settings
//                         </Link>
//                         <Link
//                           to="/update-preferences"
//                           className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
//                         >
//                           Update Preferences
//                         </Link>
//                         <Link
//                           to="/update-password"
//                           className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
//                         >
//                           Update Password
//                         </Link>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded mt-1"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li>
//                     <Link
//                       to="/login"
//                       className="hover:text-purple-500 transition duration-200"
//                     >
//                       Login
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/register"
//                       className="hover:text-purple-500 transition duration-200"
//                     >
//                       Signup
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </nav>
//           <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
//             {menuOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </button>

//           {menuOpen && (
//             <nav className="">
//               <ul className="flex flex-col gap-1 text-gray-600">
//                 <li>
//                   <Link
//                     to="/"
//                     className="hover:text-blue-500 transition duration-200"
//                   >
//                     Home
//                   </Link>
//                 </li>

//                 {isAuthenticated && (
//                   <li className="relative" ref={articleDropdownRef}>
//                     <button
//                       onClick={() => setArticleDropdownOpen((prev) => !prev)}
//                       className="flex items-center gap-1 hover:text-blue-500 transition duration-200"
//                     >
//                       Articles <ChevronDown size={16} />
//                     </button>

//                     {articleDropdownOpen && (
//                       <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
//                         <Link
//                           to="/articles/create"
//                           className="block px-4 py-2 text-sm hover:bg-gray-100"
//                         >
//                           Create Article
//                         </Link>
//                         <Link
//                           to="/articles/my-articles"
//                           className="block px-4 py-2 text-sm hover:bg-gray-100"
//                         >
//                           My Articles
//                         </Link>
//                       </div>
//                     )}
//                   </li>
//                 )}

//                 {isAuthenticated ? (
//                   <>
//                     <li className="relative" ref={dropdownRef}>
//                       <button
//                         onClick={() => setDropdownOpen((prev) => !prev)}
//                         className="flex items-center gap-1 hover:text-green-500 transition duration-200"
//                       >
//                         <span>{user?.firstName}</span>
//                         <ChevronDown size={16} />
//                       </button>

//                       {dropdownOpen && (
//                         <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4">
//                           <div className="mb-2 flex justify-center items-center gap-2">
//                             <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
//                               {user?.firstName?.[0]?.toUpperCase() || "U"}
//                             </div>
//                             <div>
//                               <p className="text-sm font-semibold">
//                                 {user?.firstName}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {user?.email}
//                               </p>
//                             </div>
//                           </div>
//                           <hr className="my-2" />
//                           <Link
//                             to="/settings"
//                             className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
//                           >
//                             Settings
//                           </Link>
//                           <Link
//                             to="/update-preferences"
//                             className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
//                           >
//                             Update Preferences
//                           </Link>
//                           <Link
//                             to="/update-password"
//                             className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
//                           >
//                             Update Password
//                           </Link>
//                           <button
//                             onClick={handleLogout}
//                             className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded mt-1"
//                           >
//                             Logout
//                           </button>
//                         </div>
//                       )}
//                     </li>
//                   </>
//                 ) : (
//                   <>
//                     <li>
//                       <Link
//                         to="/login"
//                         className="hover:text-purple-500 transition duration-200"
//                       >
//                         Login
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/register"
//                         className="hover:text-purple-500 transition duration-200"
//                       >
//                         Signup
//                       </Link>
//                     </li>
//                   </>
//                 )}
//               </ul>
//             </nav>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../Redux/store";
// import { Link, useNavigate } from "react-router-dom";
// import { logoutService } from "../../services/authServices";
// import toast from "react-hot-toast";
// import { logOut } from "../../Redux/slices/authSlice";
// import { toggleTheme } from "../../Redux/slices/themeSlice";
// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";

// const Header = () => {
//   const { user, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );
//   const { isDark } = useSelector((state: RootState) => state.theme);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [articleDropdownOpen, setArticleDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLLIElement>(null);
//   const articleDropdownRef = useRef<HTMLLIElement>(null);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       const response = await logoutService();
//       if (response.data.success) {
//         toast.success("Successfully logged out");
//         dispatch(logOut());
//         navigate("/");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   const handleThemeToggle = () => {
//     dispatch(toggleTheme());
//   };

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }

//       if (
//         articleDropdownRef.current &&
//         !articleDropdownRef.current.contains(event.target as Node)
//       ) {
//         setArticleDropdownOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Apply theme to document
//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDark]);

//   return (
//     <header className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} py-4 shadow-md transition-colors duration-200`}>
//       <div className="container mx-auto px-6">
//         <div className="flex justify-between items-center">
//           <h1 className={`text-xl md:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'} text-center transition-colors duration-200`}>
//             <span>ArticleSphere</span>
//           </h1>

//           <nav className="hidden md:block">
//             <ul className={`flex flex-row gap-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//               <li>
//                 <Link
//                   to="/"
//                   className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-500'} transition duration-200`}
//                 >
//                   Home
//                 </Link>
//               </li>

//               {isAuthenticated && (
//                 <li className="relative" ref={articleDropdownRef}>
//                   <button
//                     onClick={() => setArticleDropdownOpen((prev) => !prev)}
//                     className={`flex items-center gap-1 ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-500'} transition duration-200`}
//                   >
//                     Articles <ChevronDown size={16} />
//                   </button>

//                   {articleDropdownOpen && (
//                     <div className={`absolute left-0 mt-2 w-52 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg z-20`}>
//                       <Link
//                         to="/articles/create"
//                         className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                       >
//                         Create Article
//                       </Link>
//                       <Link
//                         to="/articles/my-articles"
//                         className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                       >
//                         My Articles
//                       </Link>
//                     </div>
//                   )}
//                 </li>
//               )}

//               {/* Theme Toggle Button */}
//               <li>
//                 <button
//                   onClick={handleThemeToggle}
//                   className={`p-2 rounded-lg ${isDark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'} transition duration-200`}
//                   aria-label="Toggle theme"
//                 >
//                   {isDark ? <Sun size={20} /> : <Moon size={20} />}
//                 </button>
//               </li>

//               {isAuthenticated ? (
//                 <>
//                   <li className="relative" ref={dropdownRef}>
//                     <button
//                       onClick={() => setDropdownOpen((prev) => !prev)}
//                       className={`flex items-center gap-1 ${isDark ? 'hover:text-green-400' : 'hover:text-green-500'} transition duration-200`}
//                     >
//                       <span>{user?.firstName}</span>
//                       <ChevronDown size={16} />
//                     </button>

//                     {dropdownOpen && (
//                       <div className={`absolute right-0 mt-2 w-56 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg z-20 p-4`}>
//                         <div className="mb-2 flex justify-center items-center gap-2">
//                           <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
//                             {user?.firstName?.[0]?.toUpperCase() || "U"}
//                           </div>
//                           <div>
//                             <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                               {user?.firstName}
//                             </p>
//                             <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
//                               {user?.email}
//                             </p>
//                           </div>
//                         </div>
//                         <hr className={`my-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
//                         <Link
//                           to="/settings"
//                           className={`block text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} px-3 py-2 rounded`}
//                         >
//                           Settings
//                         </Link>
//                         <Link
//                           to="/update-preferences"
//                           className={`block text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} px-3 py-2 rounded`}
//                         >
//                           Update Preferences
//                         </Link>
//                         <Link
//                           to="/update-password"
//                           className={`block text-sm ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} px-3 py-2 rounded`}
//                         >
//                           Update Password
//                         </Link>
//                         <button
//                           onClick={handleLogout}
//                           className={`w-full text-left text-sm text-red-600 ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} px-3 py-2 rounded mt-1`}
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li>
//                     <Link
//                       to="/login"
//                       className={`${isDark ? 'hover:text-purple-400' : 'hover:text-purple-500'} transition duration-200`}
//                     >
//                       Login
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/register"
//                       className={`${isDark ? 'hover:text-purple-400' : 'hover:text-purple-500'} transition duration-200`}
//                     >
//                       Signup
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </nav>

//           <div className="flex items-center gap-2 md:hidden">
//             {/* Mobile Theme Toggle */}
//             <button
//               onClick={handleThemeToggle}
//               className={`p-2 rounded-lg ${isDark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'} transition duration-200`}
//               aria-label="Toggle theme"
//             >
//               {isDark ? <Sun size={20} /> : <Moon size={20} />}
//             </button>

//             <button onClick={() => setMenuOpen(!menuOpen)}>
//               {menuOpen ? (
//                 <X className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
//               ) : (
//                 <Menu className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
//               )}
//             </button>
//           </div>

//           {menuOpen && (
//             <nav className={`absolute top-16 right-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-4 z-20`}>
//               <ul className={`flex flex-col gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
//                 <li>
//                   <Link
//                     to="/"
//                     className={`block py-2 ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-500'} transition duration-200`}
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Home
//                   </Link>
//                 </li>

//                 {isAuthenticated && (
//                   <li className="relative" ref={articleDropdownRef}>
//                     <button
//                       onClick={() => setArticleDropdownOpen((prev) => !prev)}
//                       className={`flex items-center gap-1 py-2 ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-500'} transition duration-200`}
//                     >
//                       Articles <ChevronDown size={16} />
//                     </button>

//                     {articleDropdownOpen && (
//                       <div className={`mt-2 ml-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded p-2`}>
//                         <Link
//                           to="/articles/create"
//                           className={`block px-2 py-1 text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
//                           onClick={() => setMenuOpen(false)}
//                         >
//                           Create Article
//                         </Link>
//                         <Link
//                           to="/articles/my-articles"
//                           className={`block px-2 py-1 text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
//                           onClick={() => setMenuOpen(false)}
//                         >
//                           My Articles
//                         </Link>
//                       </div>
//                     )}
//                   </li>
//                 )}

//                 {isAuthenticated ? (
//                   <>
//                     <li>
//                       <span className={`block py-2 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                         {user?.firstName}
//                       </span>
//                     </li>
//                     <li>
//                       <Link
//                         to="/settings"
//                         className={`block py-2 text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         Settings
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/update-preferences"
//                         className={`block py-2 text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         Update Preferences
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/update-password"
//                         className={`block py-2 text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         Update Password
//                       </Link>
//                     </li>
//                     <li>
//                       <button
//                         onClick={() => {
//                           handleLogout();
//                           setMenuOpen(false);
//                         }}
//                         className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-700"
//                       >
//                         Logout
//                       </button>
//                     </li>
//                   </>
//                 ) : (
//                   <>
//                     <li>
//                       <Link
//                         to="/login"
//                         className={`block py-2 ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-500'} transition duration-200`}
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         Login
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/register"
//                         className={`block py-2 ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-500'} transition duration-200`}
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         Signup
//                       </Link>
//                     </li>
//                   </>
//                 )}
//               </ul>
//             </nav>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { Link, useNavigate } from "react-router-dom";
import { logoutService } from "../../services/authServices";
import toast from "react-hot-toast";
import { logOut } from "../../Redux/slices/authSlice";
import { toggleTheme } from "../../Redux/slices/themeSlice";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { isDark } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [articleDropdownOpen, setArticleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const articleDropdownRef = useRef<HTMLLIElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await logoutService();
      if (response.data.success) {
        toast.success("Successfully logged out");
        dispatch(logOut());
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        articleDropdownRef.current &&
        !articleDropdownRef.current.contains(event.target as Node)
      ) {
        setArticleDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply theme to document - this enables Tailwind's dark: variants
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="bg-gray-100 dark:bg-gray-900 py-4 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white text-center transition-colors duration-200">
            <span>ArticleSphere</span>
          </h1>

          <nav className="hidden md:block">
            <ul className="flex flex-row gap-6 text-gray-600 dark:text-gray-300">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
                >
                  Home
                </Link>
              </li>

              {isAuthenticated && (
                <li className="relative" ref={articleDropdownRef}>
                  <button
                    onClick={() => setArticleDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
                  >
                    Articles <ChevronDown size={16} />
                  </button>

                  {articleDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                      <Link
                        to="/articles/create"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Create Article
                      </Link>
                      <Link
                        to="/articles/my-articles"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        My Articles
                      </Link>
                    </div>
                  )}
                </li>
              )}

              {/* Theme Toggle Button */}
              <li>
                <button
                  onClick={handleThemeToggle}
                  className="p-2 rounded-lg text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-200"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </li>

              {isAuthenticated ? (
                <>
                  <li className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-1 hover:text-green-500 dark:hover:text-green-400 transition duration-200"
                    >
                      <span>{user?.firstName}</span>
                      <ChevronDown size={16} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 p-4">
                        <div className="mb-2 flex justify-center items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                            {user?.firstName?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user?.firstName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <Link
                          to="/settings"
                          className="block text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                        >
                          Settings
                        </Link>
                        <Link
                          to="/update-preferences"
                          className="block text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                        >
                          Update Preferences
                        </Link>
                        <Link
                          to="/update-password"
                          className="block text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                        >
                          Update Password
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded mt-1"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-purple-500 dark:hover:text-purple-400 transition duration-200"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="hover:text-purple-500 dark:hover:text-purple-400 transition duration-200"
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>

          {menuOpen && (
            <nav className="absolute top-16 right-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-20">
              <ul className="flex flex-col gap-2 text-gray-600 dark:text-gray-300">
                <li>
                  <Link
                    to="/"
                    className="block py-2 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>

                {isAuthenticated && (
                  <li className="relative" ref={articleDropdownRef}>
                    <button
                      onClick={() => setArticleDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-1 py-2 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
                    >
                      Articles <ChevronDown size={16} />
                    </button>

                    {articleDropdownOpen && (
                      <div className="mt-2 ml-4 bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <Link
                          to="/articles/create"
                          className="block px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          onClick={() => setMenuOpen(false)}
                        >
                          Create Article
                        </Link>
                        <Link
                          to="/articles/my-articles"
                          className="block px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          onClick={() => setMenuOpen(false)}
                        >
                          My Articles
                        </Link>
                      </div>
                    )}
                  </li>
                )}

                {isAuthenticated ? (
                  <>
                    <li>
                      <span className="block py-2 font-medium text-gray-900 dark:text-white">
                        {user?.firstName}
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/update-preferences"
                        className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        Update Preferences
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/update-password"
                        className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        Update Password
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block py-2 hover:text-purple-500 dark:hover:text-purple-400 transition duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block py-2 hover:text-purple-500 dark:hover:text-purple-400 transition duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        Signup
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
