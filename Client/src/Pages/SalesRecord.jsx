import { useEffect, useState } from "react";

const SalesRecord = () => {
  const [activeTab, setActiveTab] = useState("invoice");
  const [data, setData] = useState([]);
  // fetch data from database according to the category
  const fetchCategoryData = async (category) => {
    const response = await fetch(
      `https://robazz-inventory-c3eda9f5a18d.herokuapp.com/invoiceCategory/${category}`
    );
    const data = await response.json();

    // Use the data
    console.log(data);
    setData(data);
  };

  // Call fetchCategoryData with the category you want
  useEffect(() => {
    fetchCategoryData(activeTab);
  }, [activeTab]);

  return (
    <>
      <h3 className="text-center text-3xl font-bold my-12">Sales Record</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "30vh",
        }}
      >
        <div role="tablist" className="tabs tabs-lg tabs-bordered">
          {/* //TODO Invoice */}
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab w-100"
            aria-label="Invoice"
            checked={activeTab === "invoice"}
            onChange={() => setActiveTab("invoice")}
          />
          <div role="tabpanel" className="tab-content p-10">
            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>SL. NO</th>
                    <th>Invoice</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Number of product</th>
                    <th>Product Name</th>
                    <th>Total Price</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item) => (
                    <tr key={item._id}>
                      <th>1</th>
                      <td>{item.serial}</td>
                      <td>{item.name}</td>
                      <td>{item.number}</td>
                      <td>{item?.products?.length}</td>
                      <td>
                        {item?.products?.map((product, index) => (
                          <p key={index}>{product.productName}</p>
                        ))}
                      </td>
                      <td>{item.totalPrice}</td>
                      <td>{item.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* //TODO Quotation */}
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab w-100"
            aria-label="Quotation"
            checked={activeTab === "quotation"}
            onChange={() => setActiveTab("quotation")}
          />
          <div role="tabpanel" className="tab-content p-10">
            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>SL.NO</th>
                    <th>Quotation</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Number of product</th>
                    <th>Product Name</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item) => (
                    <tr key={item._id}>
                      <th>1</th>
                      <td>{item.serial}</td>
                      <td>{item.name}</td>
                      <td>{item.number}</td>
                      <td>{item?.products?.length}</td>
                      <td>
                        {item?.products?.map((product, index) => (
                          <p key={index}>{product.productName}</p>
                        ))}
                      </td>
                      <td>{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesRecord;
