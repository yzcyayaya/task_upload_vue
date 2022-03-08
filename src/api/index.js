import axios from "axios"

const baseUrl = "http://127.0.0.1:9000/"
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 6000,
});
instance.Url = baseUrl
export default instance