import axiosInstance from "../Instance/axiosInstance";


export const getAllCategories = async() => {
    try{
        const response = await axiosInstance.get('/categories')
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || "Error while getting categories");
    }

}


export const getUserPreferences = async(userId  : string) => {
    try{
        const response = await axiosInstance.get(`/categories/${userId}`)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || "Error while getting user Preferences");
    }
}