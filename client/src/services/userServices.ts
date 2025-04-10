import axiosInstance from "../Instance/axiosInstance";
import { updateProfileData } from "../Pages/Settings";


export const updateUserData = async(data :updateProfileData) => {
    try{
        const response = await axiosInstance.patch('/users/profile', data)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while updating account information`)
    }

}


export const updateUserPreferences = async(data :string[]) => {
    try{
        const response = await axiosInstance.patch('/users/preferences', data)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while updating preferences`)
    }

}

