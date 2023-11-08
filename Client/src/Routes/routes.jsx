import {
  createBrowserRouter,

} from "react-router-dom";
import Main from "../layout/Main";
import BarcodePrinter from "../Pages/BarcodePrinter";
import InvoiceGenerator from "../Pages/InvoiceGenerator";
import Products from "../Pages/Products";
import UploadProduct from "../Pages/UploadProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <h1>404 Not Found</h1>,
    children: [
      {
        path: "/",
        element: <Products />,
      },
      {
        path: "/upload-product",
        element: <UploadProduct />,
      },

    ]
  },
  {
    path: "/invoice",
    element: <InvoiceGenerator />,
  },
  {
    path: "/barcode",
    element: <BarcodePrinter />,
  }

  // {
  //     path: "/",
  //     element: <UploadProduct/>,
  //   },
  //   {
  //     path: "/products",
  //     element: <Products/>,
  //   },
  //   {
  //     path: "/invoice",
  //     element: <InvoiceGenerator/>,
  //   },
  //   {
  //     path: "barcode",
  //     element: <BarcodePrinter/>,
  //   }
]);

export default router;