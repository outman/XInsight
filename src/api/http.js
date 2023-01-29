import axios from "axios";

let getAxios = (settings, timeout = 50000) => {
    axios.defaults.timeout = timeout
    const axiosInstance = axios.create(settings)
    axiosInstance.interceptors.request.use(
        (requestConfig) => {

            let token = localStorage.getItem('XINSIGHT-TOKEN')
            if (!token) {
                token = '';
            }
            requestConfig.headers.set("XINSIGHT-TOKEN", token)
            return requestConfig
        },
        (error) => {
            console.log('interceptors caused.', error)
            return Promise.reject(error)
        }
    )
    axiosInstance.interceptors.response.use(
        (response) => {
            console.log(response)
            if (response.status === 403) {
                window.location.href = '/login'
                return
            }
            return response.data
        },
        (error) => {
            if (error.response && error.response.status === 403) {
                window.location.href = '/login'
                return;
            }
            return Promise.reject(error);
        }
    )
    return axiosInstance
}

export const iAxios = getAxios({
    baseURL: '/api/v1',
    withCredentials: true,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})
