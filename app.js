import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.SECRET_KEY)

const port = process.env.PORT || 9000

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.get('/',(req, res) => {
    res.send('Hello batohi')
})

app.post('/api/v1/payments/create',async (req,res)=>{
    const {total} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, //in subunit of a currency
        currency: 'usd'
    })

    res.status(201)
        .json({
            clientSecret: paymentIntent.client_secret
        })
})

app.listen(port,()=>{
    console.log(`Server listening on port ${port}`)
})
