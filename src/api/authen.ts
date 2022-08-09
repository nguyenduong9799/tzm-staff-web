import { BeanUser, UserResponse } from 'types/user';
import request from 'utils/axios';

export const loginByUsername = (username: string, password: string) =>
  request.post('/accounts/authenticate-username-pass', { userName: username, password: password });

export const getUserInfo = () => request.get<{ data: UserResponse }>('/accounts');

const authenApi = { loginByUsername, getUserInfo };

export default authenApi;
