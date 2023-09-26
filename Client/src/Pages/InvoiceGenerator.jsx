import  { useState } from 'react';

const InvoiceGenerator = ({ productData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]); // Use an array to store selected products
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle product search
  const handleSearch = () => {
    const filteredProducts = productData.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

  // Function to set the selected product in the state
  const selectProduct = (product) => {
    // Add the selected product to the selectedProducts array
    setSelectedProducts([...selectedProducts, product]);
    console.log('Selected Product:', product);
  };

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
          handleSearch(); // Trigger search as you type
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
      <p>Added products: {selectedProducts.length}</p> {/* Use selectedProducts.length to count selected products */}
    </div>
  );
};

export default InvoiceGenerator;
