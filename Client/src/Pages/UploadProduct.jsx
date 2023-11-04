import { useForm } from "react-hook-form";

const UploadProduct = () => {
    const { register, handleSubmit, reset } = useForm()
    
    const onSubmit = async (data) => {
        try {
          const response = await fetch('http://localhost:3000/addProduct', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
      
          if (response.ok) {
            // Data was successfully uploaded to the server
            console.log('Data successfully uploaded');
            alert('Data successfully uploaded');
            reset();
          } else {
            // Handle error cases
            console.error('Failed to upload data to the server');
          }
        } catch (error) {
          console.error('An error occurred while uploading data:', error);
        }
      };
      

    return (
        <div>
            <h3 className="text-center text-3xl font-bold my-12">Upload Products</h3>
            <form className="flex form flex-col gap-1 " onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="">Category</label>
                <input {...register("category", { required: true})} />
                <label htmlFor="">Sub Category</label>
                <input {...register("subCategory", { required: true})} />
                <label htmlFor="">Product Name</label>
                <input {...register("productName", { required: true})} />
                <label htmlFor="">SKU</label>
                <input {...register("SKU", { required: true})} />
                <label htmlFor="">Product Quantity</label>
                <input
                type='number' {...register("quantity", { required: true })} />
                <label htmlFor="">Per Unit Price</label>
                <input
                type='number' {...register("price", { required: true})} />
                <input type="submit" />
            </form>

        </div>
    );
};

export default UploadProduct;