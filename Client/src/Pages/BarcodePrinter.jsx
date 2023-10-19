import { useEffect, useRef, useState } from 'react';
import Barcode from 'react-barcode';

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

    // Define the number of barcodes you want to display
    const numBarcodes = 27; // Adjust based on your needs

    // Create an array of JSX elements to represent the barcodes
    const barcodeElements = [];

    for (let i = 0; i < numBarcodes; i++) {
        barcodeElements.push(
            <> <div key={`barcode-${i}`} >
                <Barcode
                    width={1}
                    height={70}
                    format="CODE128"
                    ref={ref}
                    value={product?.productName}
                />

            </div>

            </>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="barcode-print">
            <div className="grid grid-cols-3">
                {barcodeElements}
            </div>
            <button className="print-button" onClick={handlePrint}>Print</button>
        </div>
    );
};

export default BarcodePrinter;