import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateInputValue } from '@/store/chat';

export const useChatInput = () => {
    const dispatch = useDispatch();
    const inputValue = useSelector((state: RootState) => state.chat.inputValue);
    const setInputValue = (value: string) => dispatch(updateInputValue(value));

    return { inputValue, setInputValue, };
}