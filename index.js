const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://rashedbro12:Sx0GYI0crY3A01ng@cluster0.opwsprt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect(); 

    const visitorsCollection = client.db("test").collection("visitors");

    //  GET API (Visitor Count Read)




    app.get("/api/visitor", async (req, res) => {
        try {
          const visitor = await visitorsCollection.findOne({}, { projection: { count: 1, _id: 0 } }); 
      
          res.json({ count: visitor ? visitor.count : 0 }); 
        } catch (err) {
          console.error("Error fetching visitor count:", err);
          res.status(500).json({ message: "Server error" });
        }
      });

    // app.get("/api/visitor", async (req, res) => {
    //   try {
    //     const visitor = await visitorsCollection.findOne({ _id: "visitor_counter" });

    //     if (!visitor) {
    //       return res.json({ count: 0 });
    //     }
    //     res.json({ count: visitor.count });
    //   } catch (err) {
    //     console.error("Error fetching visitor count:", err);
    //     res.status(500).json({ message: "Server error" });
    //   }
    // });

    //  POST API (Increase Visitor Count)
    app.post("/api/visitor/increase", async (req, res) => {
      try {
        const visitor = await visitorsCollection.findOneAndUpdate(
          { _id: "visitor_counter" },
          { $inc: { count: 1 } },
          { upsert: true, returnDocument: "after" }
        );

        res.json({ count: visitor.value.count });
      } catch (err) {
        console.error("Error increasing visitor count:", err);
        res.status(500).json({ message: "Server error" });
      }
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Connection Error:", error);
  }
}
run().catch(console.dir);

// ✅ Server Start
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
