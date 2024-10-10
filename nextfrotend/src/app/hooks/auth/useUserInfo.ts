import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateUserInfo } from '@/store/auth';

export const useUserInfo = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const updateUserInfoVal = (value: UserInfo) => dispatch(updateUserInfo(value));

    return { userInfo, updateUserInfoVal, };
}