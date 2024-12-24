import { destroyCookie, parseCookies } from 'nookies';
import axios from 'axios';
import HttpStatus from '@/enums/http-status.enum';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/admin`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const cookies = parseCookies(); // Retrieves cookies on the client side
    const accessTokenAdmin = cookies?.accessTokenAdmin;
    console.log(accessTokenAdmin);
    // If token is present, add it to request's Authorization Header
    if (accessTokenAdmin && config?.headers) {
      config.headers.Authorization = `Bearer ${accessTokenAdmin}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error?.response.status;

      if (status === HttpStatus.HTTP_UNAUTHORIZED) {
        // Remove access and refresh tokens when unauthorized or forbidden
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          destroyCookie(null, 'accessTokenAdmin', { path: '/' });
          destroyCookie(null, 'refreshTokenAdmin', { path: '/' });

          // Redirect to login page
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
