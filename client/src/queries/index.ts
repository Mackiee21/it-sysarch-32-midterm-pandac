import { axiosPrivate } from "../axios/axiosPrivate"

type ProductProps = FormData

export const getProducts = async () => {
    const response = await axiosPrivate.get('/api/products')
    return response.data.products
}

export const addProduct = async (payload: ProductProps) => {
    const response = await axiosPrivate.post("/api/products", payload)
    return response.data.product
}

export const deleteProduct = async (id: string) => {
    const response = await axiosPrivate.delete(`/api/products/${id}`)
    console.log(response)
}

export const updateProfile = async ({form, id, prevImage}: {form: FormData, id: string, prevImage: string}) => {
    const newFormData = new FormData()
    newFormData.append("profile", form.get("profile") as File)
    newFormData.append("prevImage", prevImage)
    for(let data of newFormData){
        console.log("data", data)
    }
    const response = await axiosPrivate.patch(`/api/auth/${id}`, newFormData )
    console.log("responses", response)
    return response.data.user
}