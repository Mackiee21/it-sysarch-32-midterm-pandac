import { useQuery } from "@tanstack/react-query";
import { LucideShoppingBag } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import ProductGrid from "../components/ProductGrid";
import { useAppContext } from "../provider";
import {
  getProduct,
  getProductsOfOwner,
  ProductPropsWithOwner,
} from "../queries";

const ProductView = () => {
  const { id } = useParams();
  const { state } = useAppContext();
  const [view, setView] = useState<string>("seller");

  const { isPending, isError, data } = useQuery({
    queryKey: ["products", "product", id],
    queryFn: () => getProduct(id as string),
  });

  const handleChangeView = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const btn = e.target as HTMLButtonElement;
    Array.from(btn.parentElement?.children || []).forEach((child) => {
      child.classList.remove("active-btn");
    });
    btn.classList.add("bg-red-800");
    setView(btn.innerText.toLowerCase());
  };

  if (isPending) return <h1>Loading...</h1>;
  return (
    <section className="w-full max-w-[700px] mx-auto">
      <div className="grid md:grid-cols-2 md:gap-7 gap-2.5">
        <img
          src={data?.productImage}
          className="w-full aspect-square rounded-md"
        />
        <div className="">
          <h1 className="text-lg text-gray-700">{data?.name}</h1>
          <p className="mt-1">
            {data?.price === 0 ? (
              <span className="text-orange-700">FREE</span>
            ) : (
              "$" + data?.price
            )}
          </p>
          <Button className="mt-5">Add to Cart</Button>
        </div>
      </div>
      <div className="mt-10 py-2 border-t-[1.5px] border-slate-200">
        {data?.productOwner._id === state._id && (
          <div className="bg-red-800 text-white/90 py-2.5 rounded-sm mb-5 flex gap-1 items-start justify-center">
            <p className="block align-top">Viewing as owner</p>
          </div>
        )}
        <div className="product-view mb-5 grid grid-cols-[repeat(auto-fill,_minmax(120px,_max-content))]">
          <button
            onClick={handleChangeView}
            className={`${view === "seller" ? "active-btn" : ""}`}
          >
            Seller
          </button>
          <button
            onClick={handleChangeView}
            className={`${view === "products" ? "active-btn" : ""}`}
          >
            Products
          </button>
        </div>
        {view === "seller" ? (
          <SellerView data={data as ProductPropsWithOwner} />
        ) : (
          <SellerProducstView id={data?.productOwner._id as string} />
        )}
      </div>
    </section>
  );
};

export default ProductView;

const SellerView = ({ data }: { data: ProductPropsWithOwner }) => {
  return (
    <div className="flex gap-5">
      <img
        src={data?.productOwner.image}
        alt="product"
        className="w-48 aspect-square rounded"
      />
      <div className="flex flex-col items-start gap-5">
        <div className="leading-5">
          <h1 className="text-base">{data?.productOwner.name}</h1>
          <small className="text-sm text-gray-700">
            {data?.productOwner.email}
          </small>
        </div>
        <Button className="px-12 py-1.5 text-sm">Visit</Button>
      </div>
    </div>
  );
};

const SellerProducstView = ({ id }: { id: string }) => {
  // FETCH ALL THE PRODUCTS ASSOCIATED WITH THE SELLER
  const { isPending, isError, data } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsOfOwner(id),
  });
  return (
    <div>
      {isPending ? (
        <div className="grid mt-10 place-items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {data.length < 0 && <p>NO OTHER PRODUCTS</p>}
          {data.length > 0 && <ProductGrid data={data} />}
        </>
      )}
    </div>
  );
};
