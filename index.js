const express = require('express');
const app = express();

const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mr0jtjc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const classesCollection = client.db('summer-camp').collection('classes');
    const instructorsCollection = client.db('summer-camp').collection('instructors');
    const usersCollection = client.db('summer-camp').collection('users');
    app.get('/classes',async(req,res)=>{
        const result = await classesCollection.find().toArray();
        res.send(result);
    })
    app.get('/instructors',async(req,res)=>{
        const result = await instructorsCollection.find().toArray();
        res.send(result);
    })
    app.get('/allusers',async(req,res)=>{
        const result = await usersCollection.find().toArray();
        res.send(result);
    })
    app.get('/users', async(req,res)=>{
        const email = req.query.email;
        console.log(email);
        const query = { email: email }
        const result = await usersCollection.findOne(query);
        console.log(result);
        res.send(result);
    })

    app.patch('/allusers/admin/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: 'admin'
          },
        };
  
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
  
      })
    app.patch('/allusers/instructor/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: 'instructor'
          },
        };
  
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
  
      })
      app.delete('/allusers/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        res.send(result);
      })

    app.post('/users', async (req, res) => {
        const user = req.body;
        console.log(user);
        const query = { email: user.email }
        const existingUser = await usersCollection.findOne(query);
  
        if (existingUser) {
          return res.send({ message: 'user already exists' })
        }
  
        const result = await usersCollection.insertOne(user);
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



app.get('/',(req,res)=>{
    res.send('server is running!');
})
app.listen(port, ()=>{
    console.log(`Summer Camp is on the go on port: ${port} `);
})