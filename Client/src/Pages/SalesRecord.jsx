import Container from "../shared/Container";

const SalesRecord = () => {
  return (
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
          className="tab"
          aria-label="Invoice"
          checked
        />
        <div role="tabpanel" className="tab-content p-10">
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th></th>
                  <th>Invoice</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Number of product</th>
                  <th>Product Name</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Littel, Schaden and Vandervort</td>
                  <td>Canada</td>
                  <td>12/16/2020</td>
                  <td>Blue</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* //TODO Quotation */}
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Quotation"
        />
        <div role="tabpanel" className="tab-content p-10">
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th></th>
                  <th>Quotation</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Number of product</th>
                  <th>Product Name</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Littel, Schaden and Vandervort</td>
                  <td>Canada</td>
                  <td>12/16/2020</td>
                  <td>Blue</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRecord;
