import { BeanUser } from 'src/@types/user';
import request from 'src/utils/axios';

export const loginByUsername = (username: string, password: string) =>
  request.post('/admin/login-by-username', { user_name: username, password });

export const getUserInfo = () => request.get<{ data: BeanUser }>('/staffs/me');

const authenApi = { loginByUsername, getUserInfo };

export default authenApi;
