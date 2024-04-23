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