const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const uri = process.env.MONGODB_URI;

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    const db = client.db('drive-fleet');
    const CarCollection = db.collection('cars');

    app.get('/cars', async (req, res) => {
      const result = await CarCollection.find().toArray();
      res.json(result);
    })

    app.post('/cars', async (req, res) => {
      const carData = req.body
      console.log(carData);
      const result = await CarCollection.insertOne(carData)
      res.json(result)
    });

    app.get('/cars/:id', async (req, res) => {
      const {id} = req.params

      const result = await CarCollection.findOne({_id: new ObjectId(id)})
      res.json(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('SERVER is running fine!')
})

app.listen(PORT, () => {
  console.log(`SERVER is running on port ${PORT}`);
})