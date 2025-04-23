require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;
const app=express()

//middleware

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.0p516.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
  const paymentCollection=client.db("Restaurant").collection("payment")

//payment post 
app.post("/payments", async(req,res)=>{
  const data=req.body
  const result=await paymentCollection.insertOne(data)
  res.send(result)
})

//get payment
app.get('/payments/:email',async(req,res)=>{
  const email=req.params.email
  const query={email:email}
  const result=await paymentCollection.find(query).toArray();
  res.send(result)
})

  // get menu 
  app.get('/menu',async(req,res)=>{
    const result=await RestaurantMenu.find().toArray();
    res.send(result)
  })

//post menu

app.post("/menu",async(req,res)=>{
  const data=req.body
  const result=await RestaurantMenu.insertOne(data)
  res.send(result)
})
//delete menu
app.delete("/menu/delete/:id",async(req,res)=>{
const id=req.params.id
const query={_id:new ObjectId(id)}
const result=await RestaurantMenu.deleteOne(query)
res.send(result)
})

// update menu item
app.patch("/menu/update/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      name: updateData.name,
      category: updateData.category,
      price: updateData.price,
      recipe: updateData.recipe,
    },
  };
    const result = await RestaurantMenu.updateOne(filter, updateDoc);
    res.send(result);
});


  //get review 
  app.get('/review',async(req,res)=>{
    const result=await RestaurantReview.find().toArray();
    res.send(result)
  })


// cart post to database
  app.post("/order", async(req,res)=>{
    const card=req.body
    console.log(card)
    const query = {
      email: card.email,
      productId: card.productId
    };
    const existing = await OrderCollection.findOne(query);
    if (existing) {
      return res.send({ message: "Product already added" });
    }
    const result=await OrderCollection.insertOne(card)
    res.send(result)
  })

  //delete order
  app.delete("/order/delete/:id",async(req,res)=>{
  const id=req.params.id
  const query={_id: new ObjectId(id)}
  const result=await OrderCollection.deleteOne(query)
  res.send(result)
  })

  //get cart from database
  app.get("/orders",async(req,res)=>{
    const email=req.query.email
    const query={email : email}
   const result=await OrderCollection.find(query).toArray()
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
