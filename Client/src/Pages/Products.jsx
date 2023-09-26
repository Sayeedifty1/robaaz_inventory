import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component'; // You may need to install this library
import InvoiceGenerator from './InvoiceGenerator';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);


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
                <div>
                    <button onClick={() => handleEdit(row)}>Edit</button>
                    <button onClick={() => handleDelete(row)}>Delete</button>
                    <input type="checkbox" onChange={() => handleSelect(row)} />
                </div>
            ),
        },
    ];

    const handleEdit = (product) => {
        // Implement the edit functionality, e.g., open a modal or navigate to an edit page
        console.log('Edit product:', product);
        setEditModalVisible(true);
    };
    const handleClose = () => {
        setEditModalVisible(false);
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


    const handleSelect = (product) => {
        // Implement the select functionality, e.g., update the selected state for the product
        console.log('Select product:', product);
    };

    return (
        <div className='relative'>
            <h3 className="text-center text-3xl font-bold my-12">Products</h3>
            {editModalVisible &&
                <div className=" w-[300px] flex-shrink-0 justify-center shadow-2xl bg-base-100 absolute z-20 left-80">
                    <div className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Name</span>
                            </label>
                            <input type="text" placeholder="product Name" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">SKU</span>
                            </label>
                            <input type="text" placeholder="SKU" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Quantity</span>
                            </label>
                            <input type="number" placeholder="Quantity" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Price</span>
                            </label>
                            <input type="number" placeholder="price" className="input input-bordered" />
                        </div>
                        <div className="form-control mt-6">
                            <button className="">Update Product</button>
                            <button onClick={handleClose} className="">Close Modal</button>
                        </div>
                    </div>

                </div>}
            <DataTable
                columns={columns}
                data={products}
                pagination
                selectableRows // Enable row selection
                selectableRowsHighlight // Highlight selected rows
            />
            <InvoiceGenerator
            productData={products}
            />
        </div>
    );
};

export default Products;
