const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

//root

app.get("/", (req, res) => {
  res.send("coffee store server is working");
});

app.listen(port, () => console.log("PORT:", port));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@main.h0ug1.mongodb.net/?retryWrites=true&w=majority&appName=main`;

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
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffeeList");
    const usersCollection = client.db("usersDB").collection("usersList");

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = { _id: new ObjectId(id) };

      const data = await coffeeCollection.findOne(coffee);
      res.send(data);
    });

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });
    app.put("/coffee/:id", async (req, res) => {
      const newDetails = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const options = { upsert: true };
      const updatedData = {
        $set: newDetails,
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = { _id: new ObjectId(id) };

      const result = await coffeeCollection.deleteOne(coffee);
      res.send(result);
    });

    // User related requests

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = { _id: new ObjectId(id) };

      const data = await usersCollection.findOne(user);
      res.send(data);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const newDetails = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const options = { upsert: true };
      const updatedData = {
        $set: newDetails,
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });
    app.patch("/user", async (req, res) => {
      const newDetails = req.body;
      const email = req.body.email;
      const filter = { email: email };

      const updatedData = {
        $set: newDetails,
      };
      const result = await usersCollection.updateOne(filter, updatedData);
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
