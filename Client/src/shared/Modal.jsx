/* eslint-disable no-unused-vars */

import { useProductModal } from "../utilities/utilities";

/* eslint-disable react/prop-types */
const Modal = ({ onClose, products }) => {

    const {
        editModalVisible,
        editingProduct,
        handleEdit,
        setEditingProduct,
        handleClose,
        handleUpdateProduct,
    } = useProductModal();

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Notifications
                                    </h3>
                                    <div className="mt-2">
                                        {products.length > 0 ? (
                                            <ul className="divide-y divide-gray-200">
                                                {products.map(product => (
                                                    <li key={product._id} className="py-4 px-2">
                                                        <p className="text-sm text-gray-800">
                                                            Product {product.productName} is going out of stock, please restock.
                                                        </p>
                                                        <button onClick={() => handleEdit(product)} className="btn-xs btn-info rounded-lg text-white">Edit</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Your cart is currently empty.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {editModalVisible && (
                <div className="w-[300px] flex-shrink-0 justify-center shadow-2xl bg-base-100 absolute z-20 left-80">
                    <div className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Product Name"
                                className="input input-bordered"
                                value={editingProduct.productName}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        productName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">SKU</span>
                            </label>
                            <input
                                type="text"
                                placeholder="SKU"
                                className="input input-bordered"
                                value={editingProduct.SKU}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        quantity: parseInt(e.target.value, 10),
                                    })
                                }
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Quantity</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Quantity"
                                className="input input-bordered"
                                value={editingProduct.quantity}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        quantity: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Buying Price</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Price"
                                className="input input-bordered"
                                value={editingProduct.buyingPrice}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        buyingPrice: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Selling Price</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Price"
                                className="input input-bordered"
                                value={editingProduct.sellingPrice}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        sellingPrice: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Threshold</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Price"
                                className="input input-bordered"
                                value={editingProduct.threshold}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        threshold: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-control mt-6 gap-4">
                            <button
                                onClick={handleUpdateProduct}
                                className="btn btn-primary rounded-lg"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleClose}
                                className="btn btn-error rounded-lg text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Modal;