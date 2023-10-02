import { useEffect, useState } from 'react';
import logo from '../assets/Robazz.png';
import signature from '../assets/sig.jpeg';
const InvoiceGenerator = ({ productData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

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
    setSelectedProducts([...selectedProducts, product]);
    localStorage.setItem('selectedProducts', JSON.stringify([...selectedProducts, product]));
  };

  const handleUnitsChange = (product, units) => {
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

  return (
    <div className='w-[60%] border mx-auto py-4'>
      {/* <img className='w-[400px] h-[300px]' src={logo} alt="logo" /> */}
      <div className='relative'>
        <div className='bg-[#669999] p-5 ' ></div>
        <p className='absolute top-0 right-40 bg-white py-1 px-4 text-2xl font-bold text-blue-900'>
          INVOICE
        </p>
      </div>
      <div>
        <input
          type="search"
          className="border  my-3"
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
                <input
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Enter category"
                  className="mt-1 px-1 border rounded-lg flex-1"
                />
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
            <td className="border">- dis</td>
          </tr>
          <tr className='border'>
            <td colSpan="3" className="border text-right pr-2">Total Price:</td>
            <td className="border">total</td>
          </tr>
        </tbody>
      </table>
      <p className='p-2'>Thank you for your business</p>
      <div className='p-2'>
        <img className='w-24' src={signature} alt="signature" />
        <p className='relative left-2 border-t w-[100px]'>Signature</p>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
