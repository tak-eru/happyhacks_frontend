import axios from 'axios';
import { API_URL } from 'utils/const';
import { User } from '../types';

export const getUser = async (id: string) => {
  const res = await axios.get<{
    data: User;
  }>(`${API_URL}/users/${id}`);
  return {
    sub: res.data.data.sub,
    name: res.data.data.name,
    email: res.data.data.email,
    picture: res.data.data.picture,
  };
};