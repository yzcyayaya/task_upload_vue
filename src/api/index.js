import axios from "axios"

const baseUrl = "http://127.0.0.1:9000/"



const instance = axios.create({
    baseURL: baseUrl,
    timeout: 6000,
});
// 请求拦截，添加token
instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token')
    if(token) {
        config.headers['authorization'] = token
    }
    return config
})

instance.Url = baseUrl
export default instance