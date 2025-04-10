
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginService } from '../services/authServices';
import Header from '../Components/Header';
import { useDispatch } from 'react-redux';
import { userLogin } from '../Redux/slices/authSlice';


export interface loginData {
  emailOrPhone: string;
  password: string;
}


const Login = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<loginData>();
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const onSubmit = async (data: loginData) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailOrPhone);
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
    <div>
        <Header/>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', {
                validate: value => {
                  const phone = watch('phone');
                  return phone || value || 'Either email or phone number is required';
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
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
  className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
/>
{errors.emailOrPhone && (
  <p className="text-sm text-red-500">{errors.emailOrPhone.message}</p>
)}

            {/* <input
              type="tel"
              {...register('phone', {
                validate: value => {
                  const email = watch('email');
                  return email || value || 'Either phone number or email is required';
                },
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: 'Invalid phone number',
                },
              })}
              className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            /> */}
            {/* {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>} */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
    </div>
    
  );
};

export default Login;
