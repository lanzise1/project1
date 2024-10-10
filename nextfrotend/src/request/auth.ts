import customFetch from "./request";

interface UserRegResponse {
    message: string;
    data: UserInfo;
    code:number
}

interface UserRLoginResponse {
    message: string;
    data: UserInfo;
    code:number
}
export const userRegisterApi = (data:RegisterRequstParams) => {
    return customFetch.post<UserRegResponse>(
        "/goapi/user/register",
        data,
    );
};
export const userLoginApi = (data:LoginRequstParams) => {
    return customFetch.post<UserRLoginResponse>(
        "/goapi/user/login",
        data,
    );
};
