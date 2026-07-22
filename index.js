const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
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

    app.post('/cars', async (req, res) => {
      const carData = req.body
      console.log(carData);
      const result = await CarCollection.insertOne(carData)
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