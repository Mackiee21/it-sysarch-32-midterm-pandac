import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProducts } from "../queries";
import { Trash2, EllipsisIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../provider";

type ProductProps = {
  name: string;
  price: number;
  _id: string;
  productImage: string; //make this one required later
  productOwner: string;
};
const Home = () => {
  const { tokenExpired, state } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openOptions, setOpenOptions] = useState<string | null>(null);
  const { isPending, data } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    retry: !tokenExpired, //THIS MEANS MO RETRY RA SIYA IF ANG STATUS IS TOKEN EXPIRED IS TRUE (FIXED THE ISSUE RELATED TO SHOWING THE MODAL ON PAGE LOAD)
  });

  const {
    isError: deleteError,
    error: deleteErrorProb,
    isSuccess,
    mutate,
  } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDeleteProduct = (id: string) => {
    mutate(id);
    if (deleteError) alert(deleteErrorProb.message);
    if (isSuccess) navigate("/");
  };

  return (
    <div>
      {isPending ? (
        <div className="grid mt-10 place-items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="home-grid">
            {data.map((product: ProductProps) => {
              return (
                <div
                  key={product._id}
                  onMouseLeave={() => setOpenOptions(null)}
                  className={`group relative grid row-span-2 gap-0 grid-rows-subgrid 
          rounded-md bg-slate-50 overflow-clip 
          outline-1 outline outline-slate-200 cursor-pointer
          hover:bg-zinc-100 transition-all`}
                >
                  <img
                    src={product.productImage}
                    alt="product"
                    className="w-full aspect-square"
                  />
                  <div className="py-2 px-3 flex justify-between">
                    <h1 className="font-normal ">{product.name}</h1>
                    <p className="text-black/70">${product.price}</p>
                  </div>
                  {state._id === product.productOwner && (
                    <div className="absolute right-0 bottom-0 w-full px-1">
                      <div
                        className={`${
                          openOptions === product._id ? "scale-100" : "scale-0"
                        } bg-white transition-all duration-200 ms-auto origin-bottom-right w-fit p-2 rounded-md border border-slate-200`}
                      >
                        <div
                          className="flex items-center gap-1"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 size={16} color="red" />
                          <span className="text-sm font-normal select-none">
                            Delete
                          </span>
                        </div>
                      </div>
                      <EllipsisIcon
                        className="scale-0 group-hover:scale-100 ms-auto text-black/70"
                        onClick={() =>
                          setOpenOptions(openOptions ? null : product._id)
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
