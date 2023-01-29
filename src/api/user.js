import {iAxios} from "@/api/http";


export const userLogin = ({username, password}) => {
    return iAxios.post('/user/login', {
        username,
        password
    })
}
