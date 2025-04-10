// import axios from 'axios';



// const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;


// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });





// export default axiosInstance;


import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
// Queue of requests that are waiting for the token to be refreshed
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Process the queue of failed requests
const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  
  failedQueue = [];
};

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is not 401 or the request has already been retried, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Check if we are already refreshing to avoid multiple refresh requests
    if (isRefreshing) {
      // Queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return axiosInstance(originalRequest);
      }).catch((err) => {
        return Promise.reject(err);
      });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Try to refresh the token
      await axiosInstance.post('/auth/refresh');
      
      // Mark as not refreshing anymore
      isRefreshing = false;
      
      // Process queue for waiting requests
      processQueue();
      
      // Retry the original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // If refresh token fails, reject all queued requests and redirect to login
      isRefreshing = false;
      processQueue(refreshError);
      
      // Clear cookies and redirect to login
      // This will effectively log the user out
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/api/auth/refresh; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Redirect to login page
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;