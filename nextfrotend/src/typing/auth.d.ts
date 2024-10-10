interface RegisterRequstParams {
    username: string
    password:string
}
interface LoginRequstParams {
  username: string
  password:string
}
interface UserInfo {
    id: number,
  name: null|string,
  email: null|string,
  phone: null|string,
  username: string
}