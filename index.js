const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port =  process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekhl5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("CameraWorld");
      const cameraCollection = database.collection("Collection");
      const orderCollection = database.collection("order");
      const reviewCollection = database.collection("review");
      const usersCollection = database.collection("users");
      // create a document to insert
        // GET API
        app.get('/Collection', async(req,res)=>{
            const cursor = cameraCollection.find({});
            const Collection = await cursor.toArray();
            res.send(Collection);
        })

        app.get('/order', async(req,res)=>{
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })

        app.get('/review', async(req,res)=>{
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        })

        // //update

        app.get('/Collection/:id', async(req,res)=>{
            const id = req.params.id ;
            const query = {_id:ObjectId(id)};
            const user = await cameraCollection.findOne(query);
            res.send(user);
        })

        app.put('/Collection/:id', async(req,res)=>{
            const id = req.params.id;
            const updateuser = req.body;
            const filter ={_id:ObjectId(id)};
            const updateDoc = {
                $set:{
                    title:updateuser.title,
                    Details:updateuser.Details,
                    price:updateuser.price
                },
            };
            const result = await cameraCollection.updateOne(filter,updateDoc)
            res.json(result);
        })

        // //POST API, add review
        app.post('/review', async(req,res)=>{
            const data = req.body;

            const results = await reviewCollection.insertOne(data);
            console.log('hiting' ,req.body)
            res.json(results);
        });
        // //POST API, add product
        app.post('/Collection', async(req,res)=>{
            const data = req.body;

            const results = await cameraCollection.insertOne(data);
            console.log('hiting' ,req.body)
            res.json(results);
        });

        app.post('/order', async(req,res)=>{
            const data = req.body;

            const results = await orderCollection.insertOne(data);
            console.log('hiting' ,req.body)
            res.json(results);
        });
        app.post('/users', async(req,res)=>{
            const data = req.body;

            const results = await usersCollection.insertOne(data);
            console.log('hiting' ,req.body)
            res.json(results);
        });

        //put admin
        app.put ('/users/admin', async(req,res) =>{
            const user = req.body;
            const filter = {email:user.email};
            const updateDoc = { $set: { role:'admin' } };
            const results = await usersCollection.updateOne(filter,updateDoc);
            res.json(results);
        })

        // get admin 

        app.get('/users/:email', async(req,res)=>{
            const email = req.params.email ;
            const query = {email:email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false ;
            if(user?.role === 'admin'){
                isAdmin = true ;
            }

            res.json( { admin:isAdmin } );
        })

        //Delete API

        app.delete('/Collection/:id', async(req,res)=>{
            const id = req.params.id ;
            const query = {_id:ObjectId(id)};
            const result = await cameraCollection.deleteOne(query);
            res.json(result);
        })

        app.delete('/order/:id', async(req,res)=>{
            const id = req.params.id ;
            const query = {_id:(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

           

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);






app.get('/', (req,res)=>{
    res.send('running');
});

app.listen(port,()=> {
    console.log('listen',port);
})