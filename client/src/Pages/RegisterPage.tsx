import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Header from "../Components/Header";
import toast from "react-hot-toast";
import { registerService } from "../services/authServices";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { getAllCategories } from '../services/categoryService';
import { Eye, EyeOff } from "lucide-react";
import { Category } from '../Interfaces/interfaces';
import { registrationSchema } from '../utils/schema';


interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password: string;
  confirmPassword: string;
  preferences: string[];
}


const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      preferences: [] 
    }
  });

  const password = watch('password');
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        console.log(response.data);
        setCategories(response.data.categories);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    
    fetchCategories();
  }, [isAuthenticated, navigate]);
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const formattedDob = data.dob.toISOString().split('T')[0];
      
      const response = await registerService({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dob: formattedDob,
        password: data.password,
        preferences: data.preferences,
      });

      if (response.data.success) {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <Header />

      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name="dob"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="yyyy-MM-dd"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholderText="Select date of birth"
                      />
                    )}
                  />
                  {errors.dob && (
                    <p className="mt-2 text-sm text-red-600">{errors.dob.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Article preferences
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`preference-${category._id}`}
                          type="checkbox"
                          value={category._id}
                          {...register('preferences')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`preference-${category._id}`} className="font-medium text-gray-700">
                          {category.categoryName}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.preferences && (
                  <p className="mt-2 text-sm text-red-600">{errors.preferences.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-1 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Signing up...' : 'Sign up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;