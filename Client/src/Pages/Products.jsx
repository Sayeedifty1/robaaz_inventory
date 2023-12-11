import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useProducts, useProductModal } from "../utilities/utilities";
import Loader from "../shared/Loader";
import { SlMagnifier } from "react-icons/sl";

const Products = () => {
  // const [products, setProducts] = useState([]);
  const {
    editModalVisible,
    editingProduct,
    handleEdit,
    setEditingProduct,
    handleClose,
    handleUpdateProduct,
  } = useProductModal();

  const { products, getProducts, loading } = useProducts();

  // eslint-disable-next-line no-unused-vars
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Function to filter products based on the search query
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  // Function to handle the search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fetch products when the component mounts
  useEffect(() => {
    getProducts();
  }, []);

  const columns = [
    {
      name: <div className="word-wrap">SL No.</div>,
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: <div className="word-wrap">Category</div>,
      selector: "category",
      sortable: true,
    },
    {
      name: <div className="word-wrap">Sub-Category</div>,
      selector: "subCategory",
      sortable: true,
    },
    {
      name: <div className="word-wrap">Product Name</div>,
      selector: "productName",
      sortable: true,
    },
    {
      name: "SKU",
      selector: "SKU",
      sortable: true,
    },
    {
      name: "Quantity",
      selector: "quantity",
      sortable: true,
      cell: (row) => (
        <div
          className={
            row.quantity === 0 ? "out-of-stock p-2 rounded text-white" : ""
          }
        >
          {row.quantity === 0 ? "Out of Stock" : row.quantity}
        </div>
      ),
    },
    {
      name: <div className="word-wrap">Buying Price</div>,
      selector: "buyingPrice",
      sortable: true,
    },
    {
      name: <div className="word-wrap">Selling Price</div>,
      selector: "sellingPrice",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-4 text-center">
          <button
            className="p-1 bg-blue-500 text-white  rounded-lg"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="p-1 bg-red-500 text-white rounded-lg"
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
    {
      name: "Barcode",
      cell: (row) => (
        <div className="flex gap-2 text-center">
          <input
            type="number"
            className="w-10 border border-black p-1 rounded-md"
            name={`barcodeCount-${row._id}`}
          />
          <button
            className="p-1 bg-green-500 text-white rounded-lg"
            onClick={() => handleBulkPrint(row)}
          >
            Bulk Print
          </button>
        </div>
      ),
    },
  ];
  const handleBulkPrint = (product) => {
    // Set the selected product for bulk print
    setSelectedProduct(product);
    localStorage.setItem("selectedProduct", JSON.stringify(product));

    const barcodeCountInputName = `barcodeCount-${product._id}`;
    const barcodeCount = document.querySelector(
      `input[name="${barcodeCountInputName}"]`
    ).value;
    const barcodeCountAsNumber = parseInt(barcodeCount, 10); // Use base 10
    localStorage.setItem("barcodeCount", barcodeCountAsNumber);

    window.open("/barcode");
  };

  const handleDelete = async (product) => {
    try {
      const response = await fetch(
        `https://robazz-inventory-c3eda9f5a18d.herokuapp.com/deleteProduct/${product._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Product deleted successfully
        console.log("Product deleted successfully");
        alert("Product deleted successfully");
        getProducts();
        // You may also want to update your local state or refetch the products from the server
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("An error occurred while deleting product:", error);
    }
  };

  return (
    <div className="relative w-[90%] mx-auto">
      <h3 className="text-center text-3xl font-bold my-12">Products</h3>
      {/* Search input */}
      <div className="mb-2 flex justify-end">
        <div className="relative">
          <SlMagnifier className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 bg-slate-200 rounded-md w-56 text-center py-2 pl-8" // added padding-left
          />
        </div>
      </div>
      {editModalVisible && (
        <div className="w-[650px]  shadow-slate-600 shadow-xl rounded-2xl absolute z-20 top-10 left-80 bg-slate-300">
          <div className="card-body grid grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                placeholder="Product Name"
                className="input input-bordered"
                value={editingProduct.productName}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    productName: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">SKU</span>
              </label>
              <input
                type="text"
                placeholder="SKU"
                className="input input-bordered"
                value={editingProduct.SKU}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    quantity: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="number"
                placeholder="Quantity"
                className="input input-bordered"
                value={editingProduct.quantity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    quantity: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Buying Price</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                className="input input-bordered"
                value={editingProduct.buyingPrice}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    buyingPrice: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Selling Price</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                className="input input-bordered"
                value={editingProduct.sellingPrice}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    sellingPrice: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Threshold</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                className="input input-bordered"
                value={editingProduct.threshold}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    threshold: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-control  gap-4 flex justify-end">
              <button
                onClick={handleUpdateProduct}
                className="btn btn-primary  rounded-lg"
              >
                Update
              </button>
            </div>
            <div className="form-control  flex justify-end gap-4 ">
              <button
                onClick={handleClose}
                className="btn btn-error rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="text-center">
          <Loader />
        </div>
      )}

      <DataTable
        columns={columns}
        data={searchQuery ? filteredProducts : products}
        pagination
        customStyles={{
          head: {
            style: {
              fontSize: "1", // Adjust the font size here ("xl" size)
            },
          },
          rows: {
            style: {
              fontSize: "12px", // Adjust the font size for table rows if needed
            },
          },
        }}
      />
    </div>
  );
};

export default Products;
