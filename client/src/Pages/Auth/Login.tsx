// import { useForm } from 'react-hook-form';
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Header from '../../Components/Header/Header';
// import { useDispatch } from 'react-redux';
// import { userLogin } from '../../Redux/slices/authSlice';
// import { loginService } from '../../services/authServices';


// export interface loginData {
//   emailOrPhone: string;
//   password: string;
// }


// const Login = () => {
//   const { register, handleSubmit,  formState: { errors } } = useForm<loginData>();
//   const navigate = useNavigate();
//   const dispatch = useDispatch()


//   const onSubmit = async (data: loginData) => {
//     const loginPayload = {
//       identifier: data.emailOrPhone,
//       password: data.password,
//     };
  
//     try {
//       const response = await loginService(loginPayload);
//       if (response.data.success) {
//         toast.success('Login successful');
//         const { user, token } = response.data;
//         dispatch(userLogin({ user, token }));
//         navigate('/dashboard');
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };
  
//   return (
//     <div>
//         <Header/>
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
//             <input
//   type="text"
//   {...register('emailOrPhone', {
//     required: 'Email or phone number is required',
//     validate: value => {
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//       const isPhone = /^\+?[1-9]\d{9,14}$/.test(value);
//       return isEmail || isPhone || 'Enter a valid email or phone number';
//     }
//   })}
//   className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
// />
// {errors.emailOrPhone && (
//   <p className="text-sm text-red-500">{errors.emailOrPhone.message}</p>
// )}

//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               {...register('password', { required: 'Password is required' })}
//               className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
//             />
//             {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//     </div>
    
//   );
// };

// export default Login;

import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../../Components/Header/Header';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../Redux/slices/authSlice';
import { loginService } from '../../services/authServices';

export interface loginData {
  emailOrPhone: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<loginData>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: loginData) => {
    const loginPayload = {
      identifier: data.emailOrPhone,
      password: data.password,
    };

    try {
      const response = await loginService(loginPayload);
      if (response.data.success) {
        toast.success('Login successful');
        const { user, token } = response.data;
        dispatch(userLogin({ user, token }));
        navigate('/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-200">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
            Login
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Email or Phone
              </label>
              <input
                type="text"
                {...register('emailOrPhone', {
                  required: 'Email or phone number is required',
                  validate: value => {
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    const isPhone = /^\+?[1-9]\d{9,14}$/.test(value);
                    return isEmail || isPhone || 'Enter a valid email or phone number';
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              />
              {errors.emailOrPhone && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1 transition-colors duration-200">
                  {errors.emailOrPhone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Password
              </label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              />
              {errors.password && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1 transition-colors duration-200">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;