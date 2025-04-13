require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT || 5000;
const app=express()

//middleware

app.use(cors())
app.use(express.json())

// pass: RIFFK88n0u3AFQZB
// user: Restaurant
const result = process.env.USER_NAME;
console.log(result);

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.0p516.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


 //const uri = "mongodb+srv://Restaurant:RIFFK88n0u3AFQZB@cluster0.0p516.mongodb.net/?appName=Cluster0";

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

  //CREATE collection

  const RestaurantMenu=client.db("Restaurant").collection("menu")
  const RestaurantReview=client.db("Restaurant").collection("reviews")
  const OrderCollection=client.db("Restaurant").collection("order")


  // get menu 
  app.get('/menu',async(req,res)=>{
    const result=await RestaurantMenu.find().toArray();
    res.send(result)
  })

  //get review 
  app.get('/review',async(req,res)=>{
    const result=await RestaurantReview.find().toArray();
    res.send(result)
  })
  
// card post to database
  app.post("/order", async(req,res)=>{
    const card=req.body
    const result=await OrderCollection.insertOne(card)
    res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("server is running")
})

app.listen(port, () => {
    console.log(`the CRUD is Running port ${port}`);
});
