const logDetails = async (selectedProducts, totalInvoicePrice, totalPrice, selectedCategory) => {
    let totalBuyingPrice = 0;
    selectedProducts.forEach(product => {
        totalBuyingPrice += product.buyingPrice * product.units;
    });

    const profit = totalPrice - totalBuyingPrice;

    const details = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        number: document.getElementById('number').value,
        date: document.getElementById('date').value,
        serial: document.getElementById('invoice').value, // Assuming 'invoice' is the correct ID
        category: selectedCategory,
        discount: document.getElementById('discount').value,
        discountType: document.getElementById('discountType').value,
        products: selectedProducts.map(product => ({
            productName: product.productName,
            sellingPrice: product.sellingPrice,
            units: product.units,
            totalPrice: product.totalPrice
        })),
        subtotal: totalInvoicePrice,
        totalPrice: totalPrice,
        profit: profit
    };
    // console.log(details)
    try {
        const response = await fetch('https://robazz-inventory-c3eda9f5a18d.herokuapp.com/addInvoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        });

        const data = await response.json();

        if (data) {
            console.log('Invoice added successfully');
        } else {
            console.log('Failed to add invoice');
        }
    } catch (error) {
        console.error('Error:', error);
    }

};
export default logDetails;

// Function to fetch products from the database
export const fetchProducts = async (setProductData) => {
    try {
        const response = await fetch('https://robazz-inventory-c3eda9f5a18d.herokuapp.com/products'); // Replace with your API endpoint
        if (response.ok) {
            const data = await response.json();
            setProductData(data); // Assuming the response is an array of products
        } else {
            console.error('Failed to fetch products');
        }
    } catch (error) {
        console.error('An error occurred while fetching products:', error);
    }
};


// fetching all products
export const useProducts = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://robazz-inventory-c3eda9f5a18d.herokuapp.com/products'); // Replace with your API endpoint
            if (response.ok) {
                const data = await response.json();
                setProducts(data); // Assuming the response is an array of products
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('An error occurred while fetching products:', error);
        } finally {
            setLoading(false);
        }
    };
    return {
        products,
        getProducts,
        loading
    };

};

// for update modal 
import { useState } from 'react';

export const useProductModal = () => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState({
        productName: '',
        SKU: '',
        quantity: 0,
        buyingPrice: 0,
        sellingPrice: 0,
        threshold: 0,
    });

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditModalVisible(true);
    };

    const handleClose = () => {
        setEditingProduct({
            productName: '',
            SKU: '',
            quantity: 0,
            buyingPrice: 0,
            sellingPrice: 0,
            threshold: 0,
        });
        setEditModalVisible(false);
    };
    const handleUpdateProduct = async () => {
        // Create an object containing only the fields to be updated
        const updatedFields = {
            productName: editingProduct.productName,
            SKU: editingProduct.SKU,
            quantity: parseInt(editingProduct.quantity, 10), // Convert to integer
            buyingPrice: parseFloat(editingProduct.buyingPrice), // Convert to float
            sellingPrice: parseFloat(editingProduct.sellingPrice), // Convert to float
            threshold: parseFloat(editingProduct.threshold), // Convert to float
        };

        try {
            const response = await fetch(`https://robazz-inventory-c3eda9f5a18d.herokuapp.com/updateProduct/${editingProduct._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields), // Send only the fields to be updated
            });

            if (response.ok) {
                console.log('Product updated successfully');
                alert('Product updated successfully');
                setEditModalVisible(false); // Close the modal
                handleClose();
                window.location.reload();
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('An error occurred while updating product:', error);
        }
    };
    return {
        editModalVisible,
        editingProduct,
        handleEdit,
        handleClose,
        setEditingProduct,
        handleUpdateProduct,
    };
};