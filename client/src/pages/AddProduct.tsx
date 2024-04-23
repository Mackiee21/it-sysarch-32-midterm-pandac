import { useAppContext } from "../provider";
import React, { useState } from "react";
import Button from "../components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../queries";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const AddProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [prevousFile, setPreviousFile] = useState<File>();
  const [preview, setPreview] = useState<string>(state.image as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("PRODUCT CHANGED", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target?.files?.[0] as File;
      setPreviousFile(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      const newFile = new DataTransfer();
      newFile.items.add(prevousFile as File);
      e.target.files = newFile.files;
      console.log(e.target.files);
    }
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }), navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const productData = new FormData(e.target as HTMLFormElement);
    productData.append("productOwnerId", state._id as string);

    mutate(productData);
  };
  if (error instanceof AxiosError) {
    if (error?.response?.data.message !== "Token has expired") {
      alert(error?.response?.data.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[600px] mx-auto p-5 rounded-md grid grid-cols-12 gap-5"
    >
      <div className="col-span-6 add-product-group flex flex-col gap-1.5">
        <label htmlFor="product-name" className="">
          Product Name
        </label>
        <input
          name="name"
          className="p-1.5 rounded"
          type="text"
          id="product-name"
          placeholder=""
          required
        />
      </div>
      <div className="col-span-6 add-product-group flex flex-col gap-1.5">
        <label htmlFor="product-price" className="">
          Price
        </label>
        <input
          name="price"
          className="p-1.5 rounded"
          type="text"
          id="product-price"
          placeholder="0.00"
          required
        />
      </div>
      <div className="flex relative col-span-6">
        <input
          onChange={handleChange}
          type="file"
          name="product_photo"
          className="bg-transparent cursor-pointer text-transparent"
          accept="jpg, jpeg, png"
          required
        />
        <div className="absolute inset-0 -z-[1] grid place-items-center border-2 rounded border-slate-200">
          <div className="flex flex-col items-center">
            <Plus size={30} />
            <p className="select-none font-normal tracking-wide text-gray-600">
              Upload an Image
            </p>
          </div>
        </div>
      </div>
      <img
        src={preview ?? state.image}
        className="border-2 border-slate-200 col-span-6 rounded aspect-square w-full"
      />
      <Button className="col-span-12 mt-3 bg-gray-600" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default AddProduct;
