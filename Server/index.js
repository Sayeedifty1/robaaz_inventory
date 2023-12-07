const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

// ! Middleware
app.use(cors());
app.use(express.json());



// ! MongoDB Connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nsyuaxc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect((err => {
            if (err) {
                console.log(err);
                return;
            }
        }));
        const productCollection = client.db("robazz").collection("inventory");
        const salesCollection = client.db("robazz").collection("salesTrack");


        app.post('/addProduct', async (req, res) => {
            try {
                // Fetch the last serial number from the database
                // const lastProduct = await productCollection.findOne({}, { sort: { serialNumber: -1 } });
                // let lastSerialNumber = lastProduct ? lastProduct.serialNumber : 0;

                const newProduct = req.body;

                // Increase the serial number based on the last serial number
                // newProduct.serialNumber = lastSerialNumber + 1;

                // Insert the new product into the database
                const result = await productCollection.insertOne(newProduct);

                if (result.insertedCount > 0) {
                    res.send({ success: true, serialNumber: newProduct.serialNumber });
                } else {
                    res.send({ success: false });
                }
            } catch (error) {
                console.error('Error inserting product:', error);
                res.status(500).send({ success: false });
            }
        });



        // get all products from database
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });

        // delete a product
        app.delete('/deleteProduct/:id', (req, res) => {
            const id = new ObjectId(req.params.id);
            productCollection.deleteOne({ _id: id })
                .then(result => {
                    res.send(result.deletedCount > 0)
                })
        });
        app.post('/generate-invoice', async (req, res) => {
            try {
                const { selectedProducts } = req.body;

                // Loop through the selected products and update their quantities
                for (const selectedProduct of selectedProducts) {
                    const productId = new ObjectId(selectedProduct._id);
                    const unitsToSubtract = selectedProduct.units;

                    // Fetch the current product details from the database
                    const currentProduct = await productCollection.findOne({ _id: productId });

                    // Calculate the new quantity after subtracting units
                    const newQuantity = currentProduct.quantity - unitsToSubtract;

                    // Update the product's quantity in the database
                    await productCollection.updateOne(
                        { _id: productId },
                        { $set: { quantity: newQuantity } }
                    );
                }

                res.send({ success: true, message: 'Invoice generated successfully' });
            } catch (error) {
                console.error('Error generating invoice:', error);
                res.status(500).send({ success: false, message: 'An error occurred while generating the invoice' });
            }
        });


        // updating a product
        app.patch('/updateProduct/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            const updatedProduct = req.body;

            try {
                console.log('Received PATCH request with data:', updatedProduct); // Log the received data

                const result = await productCollection.updateOne(
                    { _id: id },
                    { $set: updatedProduct }
                );

                console.log('MongoDB Update Result:', result); // Log the MongoDB update result

                if (result.modifiedCount > 0) {
                    res.send({ success: true, message: 'Product updated successfully' });
                } else {
                    res.send({ success: false, message: 'No product was updated' });
                }
            } catch (error) {
                console.error('Error updating product:', error);
                res.status(500).send({ success: false, message: 'An error occurred while updating the product' });
            }
        });

        // invoice track
        app.post('/addInvoice', async (req, res) => {
            try {
                const newInvoice = req.body;
                // console.log(newInvoice)
                const result = await salesCollection.insertOne(newInvoice);

                if (result.insertedCount > 0) {
                    res.send({ success: true });
                } else {
                    res.send({ success: false });
                }
            } catch (error) {
                console.error('Error inserting invoice:', error);
                res.status(500).send({ success: false });
            }
        });

        // get quotation from db by serial number
        app.get('/invoice/:serialNumber', async (req, res) => {
            const serial = req.params.serialNumber;
            const result = await salesCollection.find({ serial: serial }).toArray();
            res.send(result);
        });


        // get quotation from db by category
        app.get('/invoiceCategory/:category', async (req, res) => {
            const category = req.params.category;
            const result = await salesCollection.find({ category: category }).toArray();
            res.send(result);
        });












        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Robazz server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})