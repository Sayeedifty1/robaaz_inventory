import { useEffect, useState } from 'react';
import logo from '../../public/Artboard.png';
import signature from '../assets/sig.jpeg';
const InvoiceGenerator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
  const [selectedCategory, setSelectedCategory] = useState('invoice'); // Default to 'invoice'
  const [productData, setProductData] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('fixed');


  // Function to fetch products from the database
  const fetchProducts = async () => {
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

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const savedSelectedProducts = JSON.parse(localStorage.getItem('selectedProducts'));
    if (savedSelectedProducts) {
      setSelectedProducts(savedSelectedProducts);
    }
  }, []);

  const handleSearch = () => {
    const filteredProducts = productData.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

  const selectProduct = (product) => {
    if (product.quantity === 0) {
      alert('This product is out of stock.');
    } else if (selectedProducts.find((p) => p._id === product._id)) {
      alert('Product already selected'); // Show an alert if the product is already selected
    } else {
      setSelectedProducts([...selectedProducts, product]);
      localStorage.setItem('selectedProducts', JSON.stringify([...selectedProducts, product]));
    }
  };


  const handleUnitsChange = (product, units) => {
    // Ensure units are within the available quantity
    if (units < 0) {
      units = 0; // Avoid negative units
    } else if (units > product.quantity) {
      units = product.quantity; // Cap units at the available quantity
    }

    const updatedProducts = selectedProducts.map((p) => {
      if (p._id === product._id) {
        return {
          ...p,
          units,
          totalPrice: units * p.price,
        };
      }
      return p;
    });

    setSelectedProducts(updatedProducts);
    localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
  };

  // Calculate the total price by summing up the total prices of selected products
  const totalInvoicePrice = selectedProducts.reduce((total, product) => total + (product.totalPrice || 0), 0);
  const handlePrintInvoice = async () => {
    window.print();
    const invoiceData = {
      selectedProducts: selectedProducts.map((product) => ({
        _id: product._id,
        units: product.units,
      })),
    };

    try {
      const response = await fetch('http://localhost:3000/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        // Handle a successful response, e.g., show a success message or update your UI.
      } else {
        console.error('Failed to generate the invoice');
      }
    } catch (error) {
      console.error('An error occurred while generating the invoice:', error);
    }
  };

  let calculatedDiscount = 0;

  if (discountType === 'fixed') {
    // If it's a fixed amount, parse the discount as a number
    calculatedDiscount = parseFloat(discount);
  } else if (discountType === 'percentage') {
    // If it's a percentage, parse the discount as a percentage and calculate the discount
    const percentageDiscount = parseFloat(discount);
    calculatedDiscount = (percentageDiscount / 100) * totalInvoicePrice;
  }

  // Calculate the total price by subtracting the discount
  const totalPrice = totalInvoicePrice - calculatedDiscount;


  return (
    <div className='w-[90%] border mx-auto py-4'>
      <img className='w-full h-[150px]' src={logo} alt="logo" />
      <div className='relative'>
        <div className='bg-color bg-[#669999] p-5 ' ></div>
        <p id='category' className='absolute top-0 right-40 bg-white py-1 px-4 text-2xl font-bold text-blue-900 uppercase'>
          {selectedCategory}
        </p>
      </div>
      <div>
        <input
          type="search"
          className="border  my-3 print-button"
          placeholder="Search for a product"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch();
          }}
        />
        <ul>
          {searchResults.map((product) => (
            <li key={product._id}>
              <button onClick={() => selectProduct(product)}>{product.productName}</button>
            </li>
          ))}
        </ul>
        <div className="App border">
          <div className="flex">
            <div className="w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
              <div className="mb-4 flex items-center">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 w-1/3">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 w-1/3">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="address" className="text-sm font-medium text-gray-700 w-1/3">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="number" className="text-sm font-medium text-gray-700 w-1/3">Number:</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  placeholder="Enter your number"
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
            </div>
            <div className="w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Invoice Information</h2>
              <div className="mb-4 flex items-center">
                <label htmlFor="date" className="text-sm font-medium text-gray-700 w-1/3">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={currentDate} // Set the current date as the default value
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="invoice" className="text-sm font-medium text-gray-700 w-1/3">Invoice:</label>
                <input
                  type="text"
                  id="invoice"
                  name="invoice"
                  placeholder="Enter invoice number"
                  className="mt-1 px-1   border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="category" className="text-sm font-medium text-gray-700 w-1/3">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 px-1 border rounded-lg flex-1"
                >
                  <option value="invoice">Invoice</option>
                  <option value="quotation">Quotation</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>

      <table className='w-full text-center border mt-10'>
        <thead className='border'>
          <tr>
            <th className='border w-[40%]'>Product Name</th>
            <th className='border'>Price</th>
            <th className='border w-[10%]'>Units</th>
            <th className='border'>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr className='border' key={product._id}>
              <td className='border w-[40%]'>{product.productName}</td>
              <td className='border'>{product.price}</td>
              <td className='border w-[10%]'>
                <input
                  className='text-center'
                  type="number"
                  value={product.units || 0}
                  onChange={(e) => handleUnitsChange(product, parseInt(e.target.value, 10))}
                />
              </td>
              <td className='border'>{product.totalPrice || 0}</td>
            </tr>
          ))}
          <tr className='border'>
            <td colSpan="3" className="border text-right pr-2">Subtotal:</td>
            <td className="border">{totalInvoicePrice}</td>
          </tr>
          <tr className='border'>
            <td colSpan="3" className="border text-right pr-2">Discount:</td>
            <input
              type="text"
              id="discount"
              name="discount"
              placeholder="Enter discount"
              className="mt-1 px-1 border w-20 text-right rounded-lg flex-1"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <select
              name="discountType"
              id="discountType"
              className="ml-2 mt-1 w-12 border rounded-lg px-1"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="fixed">TK</option>
              <option value="percentage">%</option>
            </select>
          </tr>
          <tr className='border'>
            <td colSpan="3" className="border text-right pr-2">Total Price:</td>
            <td className="border">{totalPrice}</td>
          </tr>
        </tbody>
      </table>
      <p className='p-2'>Thank you for your business</p>
      <div className='p-2'>
        <img className='w-24' src={signature} alt="signature" />
        <p className='relative left-2 border-t w-[100px]'>Signature</p>
      </div>
      {selectedCategory === 'invoice' ? (
        <button className='print-button btn btn-success' onClick={handlePrintInvoice}>Print Invoice</button>
      ) : (
        <button className='print-button btn btn-info mr-2' onClick={() => window.print()}>Print Quotation</button>
      )}
    </div>
  );
};

export default InvoiceGenerator;
