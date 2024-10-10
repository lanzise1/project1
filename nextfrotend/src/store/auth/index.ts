import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthtState } from './types';
import { UseLocalStorageUtil } from '@/utils';
const localStorageUtil = new UseLocalStorageUtil();
const LOCAL_STORAGE_USER_INFO = 'userInfo';
const initialState: AuthtState = {
  userInfo: localStorageUtil.get(LOCAL_STORAGE_USER_INFO) || null,
  messageList: []
};

const authSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorageUtil.set(LOCAL_STORAGE_USER_INFO, action.payload);
    },
  },
});

export const { updateUserInfo } = authSlice.actions;
export default authSlice.reducer;