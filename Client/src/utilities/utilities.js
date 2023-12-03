const logDetails = async (selectedProducts, totalInvoicePrice, totalPrice) => {
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
        invoice: document.getElementById('invoice').value,
        category: document.getElementById('category').value,
        discount: document.getElementById('discount').value,
        discountType: document.getElementById('discountType').value,
        products: selectedProducts.map(product => ({
            productName: product.productName,
            price: product.price,
            units: product.units,
            totalPrice: product.totalPrice
        })),
        subtotal: totalInvoicePrice,
        totalPrice: totalPrice,
        profit: profit
    };
// console.log(details)
    try {
        const response = await fetch('http://localhost:3000/addInvoice', {
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
    const response = await fetch('http://localhost:3000/products'); // Replace with your API endpoint
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