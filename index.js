const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors());-- comment out on instruction , for fetching data vercel
const corsConfig = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://asg10-type02.web.app",
  ],

  credentials: true,
};
app.use(cors(corsConfig));

app.use(express.json());

// mongo

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggulbwq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect(); --- commented out as per inturction
    const database = client.db("itemDB");
    const itemCollection = database.collection("items");

    app.get("/items", async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const item = await itemCollection.findOne(query);
      res.send(item);
    });

    app.post("/items", async (req, res) => {
      const item = req.body;
      console.log("new item", item);
      const result = await itemCollection.insertOne(item);
      res.send(result);
    });

    // myCraft item data :
    app.get("/mycraft/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await itemCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 }); --- commented out as per inturction
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Simple Art & craft Server is running");
});

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
