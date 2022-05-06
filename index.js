const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.s1ibi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try {
        await client.connect();
        const serviceCollection = client.db('bikeMart').collection('inventory');
        app.get('/service', async (req, res) => {
            const queary = {};
            const cursor = serviceCollection.find(queary);
            const result = await cursor.limit(6).toArray();
            res.send(result);
        })
        app.get('/manageInventory', async (req, res) => {
            const queary = {};
            const cursor = serviceCollection.find(queary);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const queary = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(queary);
            res.send(service);
        })

        //update
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: updateUser.quantity
                }
            }
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('My mongodb');
})
app.listen(port, () => {
    console.log('Assignment-11', port);
})