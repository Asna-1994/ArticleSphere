
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getAllCategories } from "../services/categoryService";
import { Category } from "../Interfaces/interfaces";
import { updateUserPreferences } from "../services/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../Redux/slices/authSlice";

const PreferencesPage = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [preferences, setPreferences] = useState<string[]>(user?.preferences || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const dispatch = useDispatch()

  const togglePreference = (categoryId: string) => {
    setPreferences((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    try {
const response = await updateUserPreferences(preferences)
if(response.data.success){
    toast.success("Preferences updated!");
    dispatch(updateUser({user : response.data.updatedUser}))
}else{
toast.error(response.data.message)
}
    } catch (err: any) {
      toast.error(err.message || "Failed to update preferences.");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.categories);
      } catch (err: any) {
        toast.error("Failed to fetch categories");
      }
    };

    if (isAuthenticated) fetchCategories();
  }, [isAuthenticated]);

  return (
    <div>
      <Header />
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Article Preferences</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => togglePreference(category._id)}
              className={`px-3 py-1 rounded-full border ${
                preferences.includes(category._id)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;
