const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//connection database
const uri = "mongodb+srv://service:WqppylUxViB54LVR@cluster0.ro517.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const restaurantsCollection = client.db('restaurants').collection('allrasturents');



        app.get('/restaurants', async (req, res) => {
            const query = {};
            const cursor = restaurantsCollection.find(query);
            const restaurants = await cursor.toArray();
            res.send(restaurants);
        })

        
        app.get('/restaurants/:id', async (req, res) => {
            const id = req.params.id;
            const query={_id: new ObjectId(id)}
            const restaurants = await restaurantsCollection.findOne(query);
            res.send(restaurants);
        })

     




        
        
    }

    finally {

    }


} run().catch(console.dir);




//check server
app.get('/', (req, res) => {
    res.send('running server ')
});



//check port
app.listen(port, () => {
    console.log("I AM FIRST OPERATION MOZAHID", port)

})
