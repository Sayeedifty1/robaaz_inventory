/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import logo from "../../public/Artboard.png";
import signature from "../assets/sig.jpeg";
import logDetails, { fetchProducts } from "../utilities/utilities";

const InvoiceGenerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  // const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
  const [selectedCategory, setSelectedCategory] = useState("invoice"); // Default to 'invoice'
  const [productData, setProductData] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("fixed");
  const [skuSearch, setSkuSearch] = useState(""); // New state for SKU search
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [searchQuotation, setSearchQuotation] = useState("");

  // Place these lines at the beginning of your component
  const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format
  const [invoiceCount, setInvoiceCount] = useState(
    Number(localStorage.getItem(currentDate)) || 0
  );
  const [serialNumber, setSerialNumber] = useState("");

  const fetchQuotation = async () => {
    const response = await fetch(
      `https://robazz-inventory-c3eda9f5a18d.herokuapp.com/invoice/${searchQuotation}`
    );
    const dataArray = await response.json();

    // Check if dataArray is defined before setting the state
    if (dataArray && dataArray.length > 0) {
      const data = dataArray[0]; // Assuming you want to use the first item in the array
      setName(data.name || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setNumber(data.number || "");
      // setSerialNumber(data.serial || '');
      // setSelectedCategory(data.category || '');
      setDiscount(data.discount || 0);
      setDiscountType(data.discountType || "fixed");
      setSelectedProducts(data.products);
    } else {
      console.error("Data is undefined or empty");
    }
  };

  useEffect(() => {
    // This will run every time invoiceNumber changes
  }, [serialNumber]);

  useEffect(() => {
    const storedDate = localStorage.getItem("date");
    if (storedDate !== currentDate) {
      localStorage.setItem("date", currentDate);
      setInvoiceCount(0);
    }
    if (selectedCategory === "invoice") {
      const newInvoiceNumber = `${currentDate.slice(2).replace(/-/g, "")}${
        invoiceCount + 1
      }`;
      setSerialNumber(newInvoiceNumber);
    }
  }, [currentDate, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (e.target.value !== "invoice") {
      const newQuotationNumber = `Q-${currentDate.slice(2).replace(/-/g, "")}${
        invoiceCount + 1
      }`;
      setSerialNumber(newQuotationNumber);
    }
  };
  // Function to search for a product by SKU and add it automatically as you type
  useEffect(() => {
    if (!skuSearch) {
      return; // Do not perform the search if the SKU search is empty
    }
    const matchingProduct = productData.find(
      (product) => product.SKU === skuSearch
    );
    if (matchingProduct) {
      if (matchingProduct.quantity === 0) {
        alert("This product is out of stock.");
      } else if (selectedProducts.find((p) => p._id === matchingProduct._id)) {
        console.log("product added");
      } else {
        setSelectedProducts([...selectedProducts, matchingProduct]);
        localStorage.setItem(
          "selectedProducts",
          JSON.stringify([...selectedProducts, matchingProduct])
        );
      }
    }

    // Note: The SKU search input is not cleared here to allow continuous typing
  }, [skuSearch, productData, selectedProducts]);

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts(setProductData);
  }, []);

  useEffect(() => {
    const savedSelectedProducts = JSON.parse(
      localStorage.getItem("selectedProducts")
    );
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
      alert("This product is out of stock.");
    } else if (selectedProducts.find((p) => p._id === product._id)) {
      alert("Product already selected"); // Show an alert if the product is already selected
    } else {
      setSelectedProducts([...selectedProducts, product]);
      localStorage.setItem(
        "selectedProducts",
        JSON.stringify([...selectedProducts, product])
      );
      setSearchResults([]); // Clear the search results
      setSearchTerm(""); // Clear the search term
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
          totalPrice: units * p.sellingPrice,
        };
      }
      return p;
    });

    setSelectedProducts(updatedProducts);
    localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
  };

  // function to clear local storage
  const clearLocalStorage = () => {
    localStorage.clear();
    setSelectedProducts([]);
  };

  // Calculate the total price by summing up the total prices of selected products
  const totalInvoicePrice = selectedProducts.reduce(
    (total, product) => total + (product.totalPrice || 0),
    0
  );
  const handlePrintInvoice = async () => {
    window.print();
    let newInvoiceNumber;
    if (selectedCategory === "invoice") {
      newInvoiceNumber = `${currentDate.slice(2).replace(/-/g, "")}${
        invoiceCount + 1
      }`;
      setSerialNumber(newInvoiceNumber);
      setInvoiceCount((prevCount) => prevCount + 1);
      localStorage.setItem(currentDate, invoiceCount + 1);
    }
    const invoiceData = {
      invoiceNumber: newInvoiceNumber,
      selectedProducts: selectedProducts.map((product) => ({
        _id: product._id,
        units: product.units,
      })),
    };
    location.reload();
    clearLocalStorage();
    try {
      const response = await fetch(
        "https://robazz-inventory-c3eda9f5a18d.herokuapp.com/generate-invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        }
      );

      if (response.ok) {
        // Handle a successful response, e.g., show a success message or update your UI.
      } else {
        console.error("Failed to generate the invoice");
      }
    } catch (error) {
      console.error("An error occurred while generating the invoice:", error);
    }
  };

  let calculatedDiscount = 0;

  if (discountType === "fixed") {
    // If it's a fixed amount, parse the discount as a number
    calculatedDiscount = parseFloat(discount);
  } else if (discountType === "percentage") {
    // If it's a percentage, parse the discount as a percentage and calculate the discount
    const percentageDiscount = parseFloat(discount);
    calculatedDiscount = (percentageDiscount / 100) * totalInvoicePrice;
  }

  // Calculate the total price by subtracting the discount
  const totalPrice = totalInvoicePrice - calculatedDiscount;

  // Function to update the price of a product
  const handlePriceChange = (product, newPrice) => {
    // Find the product in the selectedProducts array
    const productIndex = selectedProducts.findIndex(
      (p) => p._id === product._id
    );

    // Create a new array with the updated product
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[productIndex] = { ...product, sellingPrice: newPrice };
console.log(product.sellingPrice)
    // Update the state and local storage
    setSelectedProducts(newSelectedProducts);
    localStorage.setItem(
      "selectedProducts",
      JSON.stringify(newSelectedProducts)
    );
  };

  return (
    <div className="w-[90%] border mx-auto py-4">
      <img className="w-full h-[150px]" src={logo} alt="logo" />
      <div className="relative">
        <div className="bg-color bg-[#669999] p-5 "></div>
        <p
          id="category"
          className="absolute top-0 right-40 bg-white py-1 px-4 text-2xl font-bold text-blue-900 uppercase"
        >
          {selectedCategory}
        </p>
      </div>
      <div>
        <div className="flex justify-between">
          <input
            type="search"
            className="border my-3 print-button"
            placeholder="Search by SKU"
            value={skuSearch}
            onChange={(e) => setSkuSearch(e.target.value)}
          />
          <div className="print-button">
            <input
              type="search"
              className="border my-3 mr-2"
              placeholder="Search by Quotation Number"
              value={searchQuotation}
              onChange={(e) => setSearchQuotation(e.target.value)}
            />
            <button
              onClick={()=>fetchQuotation()}
              className="bg-blue-300 p-1  rounded-lg text-white"
            >
              Search
            </button>
          </div>

          <input
            type="search"
            className="border  my-3 print-button"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch();
            }}
          />
        </div>
        <ul>
          {searchResults.map((product) => (
            <li key={product._id}>
              <button onClick={() => selectProduct(product)}>
                {product.productName}
              </button>
            </li>
          ))}
        </ul>
        <div className="App border">
          <div className="flex">
            <div className="w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 w-1/3"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Your Name"
                  value={name}
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 w-1/3"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700 w-1/3"
                >
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="number"
                  className="text-sm font-medium text-gray-700 w-1/3"
                >
                  Number:
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={number}
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
            </div>
            <div className="w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Invoice Information</h2>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-gray-700 w-1/3"
                >
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={currentDate} // Set the current date as the default value
                  className="mt-1 px-1  border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="invoice"
                  className="text-sm font-medium text-gray-700 w-1/3"
                >
                  {selectedCategory.charAt(0).toUpperCase() +
                    selectedCategory.slice(1).toLowerCase()}
                  :
                </label>
                <input
                  type="text"
                  id="invoice"
                  name={
                    selectedCategory === "invoice" ? "invoice" : "quotation"
                  }
                  value={serialNumber}
                  placeholder="Enter invoice number"
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="mt-1 px-1 border rounded-lg flex-1"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 w-1/3"
                >
                  Category:
                </label>
                <select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e)}
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

      <table className="w-full text-center border mt-10">
        <thead className="border">
          <tr>
            <th className="border w-[40%]">Product Name</th>
            <th className="border">Price</th>
            <th className="border w-[10%]">Units</th>
            <th className="border">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr className="border" key={product._id}>
              <td className="border w-[40%]">{product.productName}</td>
              <td className="border">
                <input
                  className="text-center"
                  type="number"
                  defaultValue={product.sellingPrice}
                  onChange={(e) =>
                    handlePriceChange(product, parseFloat(e.target.value))
                  }
                />
              </td>
              <td className="border w-[10%]">
                <input
                  className="text-center"
                  type="number"
                  value={product.units || 0}
                  onChange={(e) =>
                    handleUnitsChange(product, parseInt(e.target.value, 10))
                  }
                />
              </td>
              <td className="border">{totalPrice}</td>
            </tr>
          ))}
          <tr className="border">
            <td colSpan="3" className="border text-right pr-2">
              Subtotal:
            </td>
            <td className="border">{totalInvoicePrice}</td>
          </tr>
          <tr className="border">
            <td colSpan="3" className="border text-right pr-2">
              Discount:
            </td>
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
          <tr className="border">
            <td colSpan="3" className="border text-right pr-2">
              Total Price:
            </td>
            <td className="border">{totalPrice}</td>
          </tr>
        </tbody>
      </table>
      <p className="p-2">Thank you for your business</p>
      <div className="p-2">
        <img className="w-24" src={signature} alt="signature" />
        <p className="relative left-2 border-t w-[100px]">Signature</p>
      </div>
      <div className="flex justify-end">
        {selectedCategory === "invoice" ? (
          <button
            className="print-button btn btn-success"
            onClick={() => {
              handlePrintInvoice();
              logDetails(
                selectedProducts,
                totalInvoicePrice,
                totalPrice,
                selectedCategory
              );
            }}
          >
            Print Invoice
          </button>
        ) : (
          <button
            className="print-button btn btn-info mr-2"
            onClick={() => {
              logDetails(
                selectedProducts,
                totalInvoicePrice,
                totalPrice,
                selectedCategory
              );
              window.print();
            }}
          >
            Print Quotation
          </button>
        )}
        <button
          onClick={clearLocalStorage}
          className="print-button btn btn-warning ml-2"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
