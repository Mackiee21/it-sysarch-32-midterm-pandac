import { useAppContext } from "../provider";
import { User2, Check, Trash2, EllipsisIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProducts, updateProfile } from "../queries";
import { ProductProps } from "../utils";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { state, update } = useAppContext();
  const profileRef = useRef<HTMLDivElement>(null);
  const [openOptions, setOpenOptions] = useState<string | null>(null);
  const [boundToUpdate, setBoundToUpdate] = useState<boolean>(false);

  const { isPending, isError, data } = useQuery({
    queryFn: getProducts,
    queryKey: ["products"],
  });
  const { mutateAsync } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      profileRef.current?.classList.replace(
        "border-slate-300",
        "border-teal-500"
      );
      profileRef.current?.classList.replace("border-2", "border-4");
      setTimeout(() => {
        profileRef.current?.classList.replace(
          "border-teal-500",
          "border-slate-300"
        );
        profileRef.current?.classList.replace("border-4", "border-2");
      }, 1000);
      update(data);
      setBoundToUpdate(false);
    },
  });

  const {
    isError: deleteError,
    error: deleteErrorProb,
    isPending: isDeleting,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      form: new FormData(e.target as HTMLFormElement),
      id: state._id as string,
      prevImage: state.image as string,
    };
    mutateAsync(payload);
  };
  const ownerProducts = data?.filter(
    (product: ProductProps) => product.productOwner === state._id
  );
  return (
    <section className="h-full">
      <div className="flex gap-5">
        <div className="relative">
          <div
            ref={profileRef}
            className="w-40 h-40 rounded-full border-2 border-slate-300"
          >
            <img
              src={state.image as string}
              alt="profile"
              className="aspect-square rounded-full object-cover object-center"
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="absolute -translate-y-1/2 flex flex-col items-center gap-1 w-full p-0.5 left-1/2 -translate-x-1/2"
          >
            {!boundToUpdate ? (
              <button type="button" className="bg-slate-200 p-2 rounded-full">
                <User2 size={20} />
              </button>
            ) : (
              <button type="submit" className="bg-teal-500 p-2 rounded-full">
                <Check size={20} color="white" />
              </button>
            )}
            <input
              onChange={() => setBoundToUpdate(!boundToUpdate)}
              type="file"
              title=""
              name="profile"
              className={`text-transparent ${
                boundToUpdate ? "scale-0" : "scale-100"
              } absolute inset-0 cursor-pointer`}
            />
          </form>
        </div>
        <div className="p-3 flex flex-col justify-between">
          <div className="leading-5">
            <h1 className="text-lg font-medium">{state.name}</h1>
            <p className="text-gray-700 font-normal">{state.email}</p>
          </div>
          <div className="flex">
            <div className="border-2 border-e-0 border-slate-200 text-center leading-5 py-1 px-4">
              <h1 className="font-semibold">{state.orders.length}</h1>
              <p className="text-xs font-medium text-gray-500">Orders</p>
            </div>
            <div className="border-2 border-slate-200 py-1 text-center leading-5 px-4">
              <h1 className="font-semibold">{ownerProducts?.length || 0}</h1>
              <p className="text-xs font-medium text-gray-500">Products</p>
            </div>
            <a
              href="https://github.com/mackiee21"
              target="_blank"
              className="bg-red-700 hover:opacity-80 transition-all text-white/90 grid place-items-center px-8"
            >
              <p>GitHub</p>
            </a>
          </div>
        </div>
      </div>
      {/* where the products go */}
      <section className="mt-16 pb-10">
        {isPending ? (
          <div className="grid mt-10 place-items-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="home-grid">
              {ownerProducts.map((product: ProductProps) => {
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
                            openOptions === product._id
                              ? "scale-100"
                              : "scale-0"
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
      </section>
    </section>
  );
};

export default Profile;
