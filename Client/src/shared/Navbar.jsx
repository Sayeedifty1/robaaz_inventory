import { NavLink, useLocation } from "react-router-dom";
import logo from "../../public/logo.png"
const Navbar = () => {
    const location = useLocation();
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
                    </div>
                    <div className="ml-6 dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://images.template.net/84874/free-white-robot-vector-geon5.jpg" alt="User Avatar" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
