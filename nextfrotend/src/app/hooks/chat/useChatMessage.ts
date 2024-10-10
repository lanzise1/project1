import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {v4} from 'uuid'
import { bindActionCreators } from 'redux';
import { RootState } from '@/store/store';
import {getCurrentDate} from'@/utils'
import { createMessage, updateMessage } from '@/store/chat';
export const useChatMessage = () => {
    const dispatch = useDispatch();
    const messageList = useSelector((state: RootState) => state.chat.messageList);

    // 使用 useCallback 以便在依赖不变时复用该函数
    const createChatMessage = useCallback((messageContent:any) => {
        const newMessageId = v4();
        const message = {
            id: newMessageId,
            time: getCurrentDate('sec'),
            ...messageContent
        };

        dispatch(createMessage(message));

        return newMessageId;
    }, [dispatch]); // dispatch 是依赖


    const actions = bindActionCreators({
        updateMessage
    }, dispatch);
    return { messageList,createChatMessage, ...actions };
}