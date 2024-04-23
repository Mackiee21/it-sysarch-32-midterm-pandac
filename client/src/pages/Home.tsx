import { useQuery } from "@tanstack/react-query"
import { getProducts } from "../queries"


type ProductProps = {
  name: string
  price: number
  _id: string
  productImage?: string //make this one required later
}
const Home = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  })

  const handleDeleteProduct = (id: string) => {
    
  }
  return (
    <div>
      {isPending ? <div className="grid mt-10 place-items-center"><p>Loading...</p></div> : <>
      <div className="home-grid">
        {data.map((product: ProductProps) => {
          return <div key={product._id} className="grid row-span-2 gap-0 grid-rows-subgrid rounded-md bg-slate-50 overflow-clip outline-1 outline outline-slate-200">
            <img src={product.productImage} alt="product" className="w-full aspect-square" />
            <div className="py-2 px-3 flex justify-between">
              <h1 className="font-normal ">{product.name}</h1>
              <p className="text-black/70">${product.price}</p>
            </div>
          </div>
        })}
      </div>
      </>}
    </div>
  )
}

export default Home
