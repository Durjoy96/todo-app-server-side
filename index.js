const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;
require("dotenv").config();

//middleware
app.use(express.json());
app.use(cors());

//routes
const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.BD_PASSWORD}@cluster0.ht4sm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const usersCollection = client.db("ToDoApp").collection("users");
    const tasksCollection = client.db("ToDoApp").collection("tasks");

    // add a new user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const query = { email: newUser.email };
      const user = await usersCollection.findOne(query); // check if user already exists
      if (user) {
        res.status(400).send("User already exists");
        return; // stop the function
      }
      const result = await usersCollection.insertOne(newUser);
      res.json(result);
    });

    //add a new task
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      const result = await tasksCollection.insertOne(newTask);
      res.json(result);
    });

    //get all tasks
    app.get("/tasks", async (req, res) => {
      const tasks = await tasksCollection.find().toArray();
      res.send(tasks);
    });

    //update a task category
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      delete updatedTask._id; // Remove the _id field
      console.log(updatedTask);
      const query = { _id: new ObjectId(id) };
      const update = { $set: updatedTask };
      const result = await tasksCollection.updateOne(query, update);
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

app.get("/", (req, res) => {
  res.send("server working...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

run().catch(console.dir);
