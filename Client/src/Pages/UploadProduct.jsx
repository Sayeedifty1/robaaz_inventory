import { useForm } from "react-hook-form";

const UploadProduct = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://robazz-inventory-c3eda9f5a18d.herokuapp.com/addProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        // Data was successfully uploaded to the server
        console.log("Data successfully uploaded");
        alert("Data successfully uploaded");
        reset();
      } else {
        // Handle error cases
        console.error("Failed to upload data to the server");
      }
    } catch (error) {
      console.error("An error occurred while uploading data:", error);
    }
  };

  return (
    <div>
      <h3 className="text-center text-3xl font-bold my-12">Upload Products</h3>
      <form
        className="form grid grid-cols-2 gap-1 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label htmlFor="">Category</label>
          <input {...register("category", { required: true })} />
        </div>
        <div>
          <label htmlFor="">Sub Category</label>
          <input {...register("subCategory", { required: true })} />
        </div>
        <div>
          <label htmlFor="">Product Name</label>
          <input {...register("productName", { required: true })} />
        </div>
        <div>
          <label htmlFor="">SKU</label>
          <input {...register("SKU", { required: true })} />
        </div>
        <div>
          <label htmlFor="">Product Quantity</label>
          <input type="number" {...register("quantity", { required: true })} />
        </div>
        <div>
          <label htmlFor="">Product threshold</label>
          <input type="number" {...register("threshold", { required: true })} />
        </div>
        <div>
          <label htmlFor="">Buying Price</label>
          <input
            type="number"
            {...register("buyingPrice", { required: true })}
          />
        </div>
        <div>
          <label htmlFor="">Selling Price</label>
          <input
            type="number"
            {...register("sellingPrice", { required: true })}
          />
        </div>
        <div className="col-span-2  flex justify-center ">
          <input
            className="btn btn-sm bg-orange-600 text-white text-lg w-36"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default UploadProduct;
