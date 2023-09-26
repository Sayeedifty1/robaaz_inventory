const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

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


        app.post('/addProduct', async (req, res) => {
            try {
                // Fetch the last serial number from the database
                const lastProduct = await productCollection.findOne({}, { sort: { serialNumber: -1 } });
                let lastSerialNumber = lastProduct ? lastProduct.serialNumber : 0;

                const newProduct = req.body;

                // Increase the serial number based on the last serial number
                newProduct.serialNumber = lastSerialNumber + 1;

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