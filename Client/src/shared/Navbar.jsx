import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import logo from "../../public/logo.png"
import Modal from './Modal'; // Import your Modal component
import { FaRegBell } from "react-icons/fa"

const Navbar = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    // Function to fetch products from the database
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://robazz-inventory-c3eda9f5a18d.herokuapp.com/products'); // Replace with your API endpoint
            if (response.ok) {
                const data = await response.json();
                setProducts(data); // Assuming the response is an array of products
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('An error occurred while fetching products:', error);
        }
    };

    // Fetch products when the component mounts
    useEffect(() => {
        const interval = setInterval(() => {
            fetchProducts();
        }, 2000); // Fetch every 2 seconds

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount



    const outOfStockProducts = products.filter(product => parseInt(product.quantity) <= parseInt(product.threshold));
    return (
        <div>
            <div className="navbar bg-base-100 w-[90%] mx-auto">
                <div className="flex-1">
                    <img className="w-16" src={logo} alt="" />
                </div>
                <div className="flex-none">
                    <div className="flex gap-8 text-xl ">
                        <NavLink to="/" className={` ${location.pathname === "/" ? "active" : "not-active"}`} exact>
                            Home
                        </NavLink>
                        <NavLink to="/upload-product" className={`${location.pathname === "/upload-product" ? "active" : "not-active"}`}>
                            Upload Products
                        </NavLink>

                        <NavLink to="/invoice" className={`${location.pathname === "/invoice" ? "active" : "not-active"}`}>
                            Invoice
                        </NavLink>
                        <NavLink to="/record" className={`${location.pathname === "/settings" ? "active" : "not-active"}`}>
                            Sales Record
                        </NavLink>
                        <div className="relative">
                            <FaRegBell className="h-6 w-6 cursor-pointer " onClick={() => setIsModalOpen(true)}></FaRegBell>
                            <p className="absolute h-4 w-4 rounded-full bg-red-600 bottom-7 left-3 text-xs text-white text-center">{outOfStockProducts?.length}</p>
                        </div>

                    </div>
                    <div className="ml-6 dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://images.template.net/84874/free-white-robot-vector-geon5.jpg" alt="User Avatar" />
                            </div>
                        </button>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} products={outOfStockProducts} />}
        </div>
    );
};

export default Navbar;