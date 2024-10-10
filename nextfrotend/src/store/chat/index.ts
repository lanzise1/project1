import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState } from './types';

const initialState: ChatState = {
  inputValue: '',
  messageList: []
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    createMessage: (state, action: PayloadAction<TchatMessageItem>) => {
      state.messageList.push(action.payload)
      console.log(`output->action.payload`, action.payload)
    },
    updateMessage: (state, action: PayloadAction<{ id: string, text: string }>) => {
      const actionData = {
        id: action.payload.id,
        text: action.payload.text
      }
      const index = state.messageList.findIndex(i => i.id === actionData.id);
      if (index !== -1) {
        state.messageList[index].text += actionData.text;
      }
    }
  },
});

export const { updateInputValue, updateMessage, createMessage } = chatSlice.actions;
export default chatSlice.reducer;