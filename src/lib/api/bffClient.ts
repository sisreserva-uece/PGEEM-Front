import axios from 'axios';
import { toast } from 'sonner';
import { extractErrorMessage } from './extractErrorMessage';

const bffClient = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

bffClient.interceptors.response.use(
  response => response,
  (error) => {
    const shouldShowToast = error.config?._showToastOnError !== false;

    if (shouldShowToast && error.response) {
      const message = extractErrorMessage(error.response.data);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default bffClient;
