import axiosInstance from "../Instance/axiosInstance";
import { registerData } from "../Interfaces/interfaces";
import { updatePasswordData } from "../Pages/UpdatePassword";

export const registerService = async(data : registerData) => {
    try{
        const response = await axiosInstance.post('/auth/register', data)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while registering`)
    }

}

export const loginService = async(data: { identifier: string; password: string }) => {
    try{
        const response = await axiosInstance.post('/auth/login', data)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while Login`)
    }

}


export const logoutService = async() => {
    try{
        const response = await axiosInstance.post('/auth/logout')
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while Logout`)
    }

}

export const updatePassword = async(updateData : updatePasswordData) => {
    try{
        const response = await axiosInstance.patch('/auth/change-password', updateData)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while updating password`)
    }
}