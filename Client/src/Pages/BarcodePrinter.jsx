import React, { useEffect, useRef, useState } from 'react';
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';

const BarcodePrinter = () => {

    const ref = useRef();
    const [product, setProduct] = useState(null);

    // Function to fetch product data from local storage
    useEffect(() => {
        const storedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
        if (storedProduct) {
            setProduct(storedProduct);
        }
    }, []);

    return (
        <div className="barcode-print">
            <div>
                <Barcode
                    width={1}
                    height={100}
                    format="CODE128"
                    displayValue={true}
                    ref={ref}
                    value={product?.productName}
                />
            </div>
            <ReactToPrint
                trigger={() => <button>Print Barcode</button>}
                content={() => ref.current}
                displayValue={false} // Hide the text display below the barcode
            />
        </div>
    );
};

export default BarcodePrinter;
