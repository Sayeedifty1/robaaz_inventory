import {
    createBrowserRouter,
   
  } from "react-router-dom";
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
    }
  ]);

  export default router;