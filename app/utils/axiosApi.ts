import axios from 'axios';

export const axiosPostData = (url: string, formData: FormData) => axios.post(url, formData);

export const axiosGetData = async (url: string) => {
  const response = await axios.get(url);
  return response?.data;
};
