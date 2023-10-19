import {
    createBrowserRouter,
   
  } from "react-router-dom";
import BarcodePrinter from "../Pages/BarcodePrinter";
import InvoiceGenerator from "../Pages/InvoiceGenerator";
import Products from "../Pages/Products";
import UploadProduct from "../Pages/UploadProduct";

const router = createBrowserRouter([
    {
      path: "/",
      element: <UploadProduct/>,
    },
    {
      path: "/products",
      element: <Products/>,
    },
    {
      path: "/invoice",
      element: <InvoiceGenerator/>,
    },
    {
      path: "barcode",
      element: <BarcodePrinter/>,
    }
  ]);

  export default router;