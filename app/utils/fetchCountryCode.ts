import { axiosGetData } from './axiosApi';

export const fetchCountryCodeApi = async () => {
  const data = await axiosGetData('https://ipapi.co/json');
  return data?.country.toUpperCase();
};
