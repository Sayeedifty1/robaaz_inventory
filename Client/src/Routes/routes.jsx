import {
    createBrowserRouter,
   
  } from "react-router-dom";
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
    }
  ]);

  export default router;