import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../queries";
import { LucideShoppingBag } from "lucide-react";

import { useAppContext } from "../provider";
import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

type ProductProps = {
  name: string;
  price: number;
  _id: string;
  productImage: string; //make this one required later
  productOwner: string;
};
const Home = () => {
  const { tokenExpired } = useAppContext();

  const { isPending, data } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    retry: !tokenExpired, //THIS MEANS MO RETRY RA SIYA IF ANG STATUS IS TOKEN EXPIRED IS TRUE (FIXED THE ISSUE RELATED TO SHOWING THE MODAL ON PAGE LOAD)
  });

  return (
    <div>
      {isPending ? (
        <div className="grid mt-10 place-items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <ProductGrid data={data} />
      )}
    </div>
  );
};

export default Home;
