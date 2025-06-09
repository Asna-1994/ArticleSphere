


import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import Header from '../../Components/Header/Header';
import { RootState } from '../../Redux/store';
import { Category } from '../../Interfaces/interfaces';
import { getAllCategories } from '../../services/categoryService';
import { updateArticle, uploadArticle } from '../../services/articleService';
import { useLocation } from 'react-router-dom';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_MB = 5;

const schema = Yup.object().shape({
  title: Yup.string().required('Article title is required'),
  description: Yup.string().required('Description is required'),
  content: Yup.string()
    .required('Content is required')
    .max(280, 'Content must be at most 280 characters'),
  category: Yup.string().required('Please select a category'),
  tags: Yup.string().required('Tags are required'),
});

interface ImageUrl {
  url: string;
  publicId: string;
}

const CreateArticle = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isEditMode, setIsEditMode] = useState(false);
  const [removedImages, setRemovedImages] = useState<ImageUrl[]>([]);
  const [existingImages, setExistingImages] = useState<ImageUrl[]>([]);

  const location = useLocation();
  const { article } = location.state || {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (!isEditMode && images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (isEditMode && existingImages.length === 0 && images.length === 0) {
      toast.error('Your article must have at least one image');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('tags', JSON.stringify(data.tags.split(',').map((tag: string) => tag.trim())));

    images.forEach((img) => formData.append('images', img));

    try {
      let response;
      if (isEditMode) {
        formData.append('removedImages', JSON.stringify(removedImages));
        response = await updateArticle(article._id, formData);
      } else {
        response = await uploadArticle(formData);
      }

      if (response.data.success) {
        toast.success(`Article ${isEditMode ? 'updated' : 'created'} successfully`);
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    }

    reset();
    setImages([]);
    setImagePreviews([]);
    setRemovedImages([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    const currentExistingCount = existingImages.length - removedImages.length;
    const totalImagesCount = currentExistingCount + images.length + newFiles.length;
    
    if (totalImagesCount > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    for (let file of newFiles) {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > MAX_IMAGE_SIZE_MB) {
        toast.error(`${file.name} is larger than ${MAX_IMAGE_SIZE_MB}MB`);
        continue;
      }
      validFiles.push(file);
    }

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    if (isEditMode) {
      if (index < existingImages.length) {
        const imageToRemove = existingImages[index];
        setRemovedImages(prev => [...prev, imageToRemove]);
        
        const updatedExisting = [...existingImages];
        updatedExisting.splice(index, 1);
        setExistingImages(updatedExisting);
        
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);
      } else {
        const newIndex = index - existingImages.length;
        const updatedImages = [...images];
        updatedImages.splice(newIndex, 1);
        setImages(updatedImages);
        
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);
      }
    } else {
      const updatedImages = [...images];
      const updatedPreviews = [...imagePreviews];
      updatedImages.splice(index, 1);
      updatedPreviews.splice(index, 1);
      setImages(updatedImages);
      setImagePreviews(updatedPreviews);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.categories);
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };

    if (isAuthenticated) fetchCategories();

    if (article) {
      setIsEditMode(true);
      
      // Populate form values
      reset({
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.category?._id || '',
        tags: article.tags?.join(', ') || '',
      });

      // Set existing images
      if (article.imageUrls && Array.isArray(article.imageUrls)) {
        setExistingImages(article.imageUrls);
        
        // Set image previews for display
        const previewsFromServer = article.imageUrls.map((img: ImageUrl) => img.url);
        setImagePreviews(previewsFromServer);
      }
    }
  }, [isAuthenticated, article, reset]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow mt-10 transition-colors duration-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white transition-colors duration-200">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Article Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Article Name
            </label>
            <input
              {...register('title')}
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            />
            {errors.title && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-200">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Short Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            />
            {errors.description && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-200">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Content */}
          {/* <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Full Content
            </label>
            <textarea
              {...register('content')}
              rows={6}
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            />
            {errors.content && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-200">
                {errors.content.message}
              </p>
            )}
          </div> */}
          {/* Content */}
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
    Full Content
  </label>
  <textarea
    {...register('content')}
    rows={6}
    maxLength={280}
    className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
  />
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
    Max 280 characters
  </p>
  {errors.content && (
    <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-200">
      {errors.content.message}
    </p>
  )}
</div>


          {/* Category */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Category
            </label>
            <select
              {...register('category')}
              defaultValue={article?.category?.categoryName || ''}
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-200">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Tags (comma-separated)
            </label>
            <input
              {...register('tags')}
              placeholder="e.g. AI, NASA, Football"
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            />
            {errors.tags && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-200">
                {errors.tags.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Upload Images ({imagePreviews.length}/{MAX_IMAGES})
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 dark:file:bg-blue-700 file:text-white hover:file:bg-blue-700 dark:hover:file:bg-blue-600 transition-colors duration-200"
              disabled={imagePreviews.length >= MAX_IMAGES}
            />

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative w-40 h-40">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded border border-gray-300 dark:border-gray-600 transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white border border-gray-300 dark:border-gray-600 transition-all duration-200"
                    >
                      <X size={16} className="text-gray-600 dark:text-gray-300 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors duration-200"
          >
            {isEditMode ? 'Update Article' : 'Publish Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
