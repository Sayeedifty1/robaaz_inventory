import  { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import InvoiceGenerator from './InvoiceGenerator';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState({
        
        productName: '',
        SKU: '',
        quantity: 0,
        price: 0,
    });

    // Function to fetch products from the database
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/products'); // Replace with your API endpoint
            if (response.ok) {
                const data = await response.json();
                setProducts(data); // Assuming the response is an array of products
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('An error occurred while fetching products:', error);
        }
    };

    // Fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    const columns = [
        {
            name: 'SL No.',
            selector: 'serialNumber',
            sortable: true,
        },
        {
            name: 'Product Name',
            selector: 'productName',
            sortable: true,
        },
        {
            name: 'SKU',
            selector: 'SKU',
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: 'quantity',
            sortable: true,
        },
        {
            name: 'Price',
            selector: 'price',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex gap-4 text-center'>
                    <button className='p-1 bg-blue-500 text-white  rounded-lg' onClick={() => handleEdit(row)}>Edit</button>
                    <button className='p-1 bg-red-500 text-white  rounded-lg' onClick={() => handleDelete(row)}>Delete</button>
                    <button className='p-1 bg-green-500 text-white  rounded-lg'>Bulk Print</button>
                </div>
            ),
        },
    ];

    const handleEdit = (product) => {
        // Set the editing product when the "Edit" button is clicked
        setEditingProduct(product);
        setEditModalVisible(true);
    };

    const handleClose = () => {
        // Clear the editing product and close the modal
        setEditingProduct({
            _id: '',
            productName: '',
            SKU: '',
            quantity: 0,
            price: 0,
        });
        setEditModalVisible(false);
    };

    const handleUpdateProduct = async () => {
        // Create an object containing only the fields to be updated
        const updatedFields = {
            productName: editingProduct.productName,
            SKU: editingProduct.SKU,
            quantity: parseInt(editingProduct.quantity, 10), // Convert to integer
            price: parseFloat(editingProduct.price), // Convert to float
        };
    
        try {
            const response = await fetch(`http://localhost:5000/updateProduct/${editingProduct._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields), // Send only the fields to be updated
            });
    
            if (response.ok) {
                console.log('Product updated successfully');
                alert('Product updated successfully');
                fetchProducts(); // Refresh the product list after the update
                setEditModalVisible(false); // Close the modal
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('An error occurred while updating product:', error);
        }
    };
    

    const handleDelete = async (product) => {
        try {
            const response = await fetch(`http://localhost:5000/deleteProduct/${product._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Product deleted successfully
                console.log('Product deleted successfully');
                alert('Product deleted successfully');
                fetchProducts();
                // You may also want to update your local state or refetch the products from the server
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('An error occurred while deleting product:', error);
        }
    };

 

    return (
        <div className='relative'>
            <h3 className="text-center text-3xl font-bold my-12">Products</h3>
            {editModalVisible && (
                <div className=" w-[300px] flex-shrink-0 justify-center shadow-2xl bg-base-100 absolute z-20 left-80">
                    <div className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="product Name"
                                className="input input-bordered"
                                value={editingProduct.productName}
                                onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
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
                                onChange={(e) => setEditingProduct({ ...editingProduct, SKU: e.target.value })}
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
                                onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Price</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Price"
                                className="input input-bordered"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            />
                        </div>
                        <div className="form-control mt-6">
                            <button onClick={handleUpdateProduct} className="">Update Product</button>
                            <button onClick={handleClose} className="">Close Modal</button>
                           
                        </div>
                    </div>
                </div>
            )}

            <DataTable
                columns={columns}
                data={products}
                pagination
            />
            {/* <InvoiceGenerator
            productData={products}
            /> */}
        </div>
    );
};

export default Products;
