const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//connection database
const uri = "mongodb+srv://service:WqppylUxViB54LVR@cluster0.ro517.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//jwt
function verifyJWT(req, res, next) {
    console.log('abc')
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
        return res.status(401).send({ message: 'UnAuthorize access' });

    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {

        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}

async function run() {
    try {
        await client.connect();
        const restaurantsCollection = client.db('restaurants').collection('allrasturents');
        const orderCollection = client.db('restaurants').collection('order');
        const userCollection = client.db('restaurants').collection('user');
        const reviewsCollection = client.db('restaurants').collection('reviews');



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


        app.post('/order', async (req, res) => {

            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })


        app.post('/reviews', async (req, res) => {

            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body
            const filter = { email: email };
            const option = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, option);
            //token
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
             console.log(token)
            res.send({ result, token });

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
