const express = require('express');
const app  = express();

const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
const objectId = require('mongodb').ObjectId;
require('dotenv').config()

app.use(cors());
app.use(express.json());


//userName : pratice-one
//password: k5afIsbNbbSqOWw0

// mongoDB connection

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.cwl7e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{

        await client.connect();
        const serviceCollaction =  client.db("serices").collection("service");

        app.get('/service',async(req,res)=>{
            const quary = {};
            const data = serviceCollaction.find(quary);
            const result = await data.toArray();
            res.send(result);
        })

        app.get('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const quary = {_id: objectId(id)};
            const data = serviceCollaction.find(quary);
            const result =  await data.toArray();
            res.send(result);
        })

        app.post('/service',async(req,res)=>{
            const data = req.body;
            const result = await serviceCollaction.insertOne(data);
            res.send(result);
        })

        app.put('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: objectId(id)};
            const data = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set:{
                    name: data.name,
                    photoUrl:data.photoUrl,
                    someText:data.someText
                }
            }
            const result = await serviceCollaction.updateOne(filter,updateDoc,options);
            res.send(result);
        })
        // delete 
        app.delete('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const quary = {_id: objectId(id)};
            const result = await serviceCollaction.deleteOne(quary);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Db connected');
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})