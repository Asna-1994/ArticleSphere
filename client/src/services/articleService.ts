import axiosInstance from "../Instance/axiosInstance";



export const getAllArticles = async(page : number, limit : number) => {
    try{
        const response = await axiosInstance.get(`/articles?page=${page}&limit=${limit}`)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while fetching articles`)
    }

}


export const getUserArticles = async() => {
    try{
        const response = await axiosInstance.get('/articles/user')
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while getting articles`)
    }

}

export const deleteArticleService = async(articleId : string) => {
    try{
        const response = await axiosInstance.delete(`/articles/${articleId}`)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while deleting article`)
    } 
}


export const likeArticle = async(articleId : string) => {
    try{
        const response = await axiosInstance.post(`/articles/${articleId}/like`)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while liking article`)
    } 
}


export const disLikeArticle = async(articleId : string) => {
    try{
        const response = await axiosInstance.post(`/articles/${articleId}/dislike`)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while disliking article`)
    } 
}

export const blockArticle = async(articleId : string) => {
    try{
        const response = await axiosInstance.post(`/articles/${articleId}/block`)
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while blocking article`)
    } 
}

export const uploadArticle = async(data :FormData ) => {
    try{
        const response = await axiosInstance.post('/articles', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while publishing article`)
    }

}


export const updateArticle = async(articleId : string, data :FormData ) => {
    console.log(data)
    try{
        const response = await axiosInstance.patch(`/articles/${articleId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response
    }
    catch(err : any){
        console.log(err)
        throw new Error(err.response?.data?.message || `Error while updating article`)
    }

}