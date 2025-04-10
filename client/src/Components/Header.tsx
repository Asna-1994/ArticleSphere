import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/store";
import { Link, useNavigate } from "react-router-dom";
import { logoutService } from "../services/authServices";
import toast from "react-hot-toast";
import { logOut } from "../Redux/slices/authSlice";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
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

  return (
    <header className="bg-gray-100 py-4 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 text-center ">
        <span className="text-black">ArticleSphere</span>
      </h1>

          <nav className="hidden md:block">
            <ul className="flex flex-row gap-6 text-gray-600">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 transition duration-200"
                >
                  Home
                </Link>
              </li>

              {isAuthenticated && (
                <li className="relative" ref={articleDropdownRef}>
                  <button
                    onClick={() => setArticleDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 hover:text-blue-500 transition duration-200"
                  >
                    Articles <ChevronDown size={16} />
                  </button>

                  {articleDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <Link
                        to="/articles/create"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Create Article
                      </Link>
                      <Link
                        to="/articles/my-articles"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        My Articles
                      </Link>
                    </div>
                  )}
                </li>
              )}

              {isAuthenticated ? (
                <>
                  <li className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-1 hover:text-green-500 transition duration-200"
                    >
                      <span>{user?.firstName}</span>
                      <ChevronDown size={16} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4">
                        <div className="mb-2 flex justify-center items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                            {user?.firstName?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {user?.firstName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <hr className="my-2" />
                        <Link
                          to="/settings"
                          className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
                        >
                          Settings
                        </Link>
                        <Link
                          to="/update-preferences"
                          className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
                        >
                          Update Preferences
                        </Link>
                        <Link
                          to="/update-password"
                          className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
                        >
                          Update Password
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded mt-1"
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
                      className="hover:text-purple-500 transition duration-200"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="hover:text-purple-500 transition duration-200"
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {menuOpen && (
            <nav className="">
              <ul className="flex flex-col gap-1 text-gray-600">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-500 transition duration-200"
                  >
                    Home
                  </Link>
                </li>

                {isAuthenticated && (
                  <li className="relative" ref={articleDropdownRef}>
                    <button
                      onClick={() => setArticleDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-1 hover:text-blue-500 transition duration-200"
                    >
                      Articles <ChevronDown size={16} />
                    </button>

                    {articleDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                        <Link
                          to="/articles/create"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Create Article
                        </Link>
                        <Link
                          to="/articles/my-articles"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          My Articles
                        </Link>
                      </div>
                    )}
                  </li>
                )}

                {isAuthenticated ? (
                  <>
                    <li className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="flex items-center gap-1 hover:text-green-500 transition duration-200"
                      >
                        <span>{user?.firstName}</span>
                        <ChevronDown size={16} />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4">
                          <div className="mb-2 flex justify-center items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                              {user?.firstName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">
                                {user?.firstName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                          <hr className="my-2" />
                          <Link
                            to="/settings"
                            className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
                          >
                            Settings
                          </Link>
                          <Link
                            to="/update-preferences"
                            className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
                          >
                            Update Preferences
                          </Link>
                          <Link
                            to="/update-password"
                            className="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
                          >
                            Update Password
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded mt-1"
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
                        className="hover:text-purple-500 transition duration-200"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="hover:text-purple-500 transition duration-200"
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
