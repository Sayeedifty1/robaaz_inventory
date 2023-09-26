import React, { useEffect, useState } from 'react';

const InvoiceGenerator = ({ productData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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
    <div>
      <h2>Invoice Generator</h2>
      <input
        type="search"
        className="border border-black"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch();
        }}
      />
      <h3>Search Results</h3>
      <ul>
        {searchResults.map((product) => (
          <li key={product._id}>
            <button onClick={() => selectProduct(product)}>{product.productName}</button>
          </li>
        ))}
      </ul>
      <h3>Selected Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Units</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.productName}</td>
              <td>{product.price}</td>
              <td>
                <input
                className='text-center'
                  type="number"
                  value={product.units || 0}
                  onChange={(e) => handleUnitsChange(product, parseInt(e.target.value, 10))}
                />
              </td>
              <td>{product.totalPrice || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Price: {totalInvoicePrice}</p> {/* Display the total invoice price */}
    </div>
  );
};

export default InvoiceGenerator;
