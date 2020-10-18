const dotenv = require('dotenv')
dotenv.config()
const https = require('https')
const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.SECRET_KEY)
const bodyParser = require('body-parser')

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

// app.listen(port,()=>{
//     console.log(`Server listening on port ${port}`)
// })

const httpsServer = https.createServer(app)

httpsServer.listen(9000,()=>{
    console.log('server started on port 9000')
})
