import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UseLocalStorageUtil } from '@/utils';
import { LOCAL_STORAGE_USER_INFO } from '@/config';
import { AuthtState } from './types';

const localStorageUtil = new UseLocalStorageUtil();

const initialState: AuthtState = {
  userInfo: localStorageUtil.get(LOCAL_STORAGE_USER_INFO) || null,
  messageList: []
};

const authSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateUserInfo: (state: AuthtState, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorageUtil.set(LOCAL_STORAGE_USER_INFO, action.payload);
    },
  },
});

export const { updateUserInfo } = authSlice.actions;
export default authSlice.reducer;