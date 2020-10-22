const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.SECRET_KEY)
const bodyParser = require('body-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const database = require(__dirname+'/firebase.js').database
const storage = require(__dirname+'/firebase.js').storage
const fs = require('fs')

const port = process.env.PORT || 9000

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.get('/',(req, res) => {
    res.send('Hello mater d')
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

app.get('/feedback/weekly',(req, res) => {
    const data = []

    database.collection('weekly review')
        .get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                data.push(doc.data())
            })

            const weeklyCsvWriter = createCsvWriter({
                path: 'weeklyReview.csv',
                header: [
                    {id: 'firstName', title: 'Firstname'},
                    {id: 'lastName', title: 'Lastname'},
                    {id: 'comment', title: 'Comment'},
                    {id: 'feeling', title: 'Feeling'},
                ]
            });

            weeklyCsvWriter
                .writeRecords(data)
                .then(()=> {
                    console.log('The CSV file was written successfully')

                    fs.createReadStream(__dirname+'/weeklyReview.csv')
                        .pipe(res)

                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'weeklyReview' + '.csv\"');
                });
        })
})

app.get('/feedback/monthly',(req, res) => {
    const data = []

    database.collection('monthly review')
        .get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                data.push(doc.data())
            })

            const monthlyCsvWriter = createCsvWriter({
                path: 'monthlyReview.csv',
                header: [
                    {id: 'firstName', title: 'Firstname'},
                    {id: 'lastName', title: 'Lastname'},
                    {id: 'comment', title: 'Comment'},
                    {id: 'feeling', title: 'Feeling'},
                    {id: 'month', title: 'Month'},
                ]
            });

            monthlyCsvWriter
                .writeRecords(data)
                .then(()=> {
                    console.log('The CSV file was written successfully')

                    fs.createReadStream(__dirname+'/monthlyReview.csv')
                        .pipe(res)

                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'monthlyReview' + '.csv\"');
                });
        })
})

app.listen(port,"0.0.0.0",()=>{
    console.log(`Server listening on port ${port}`)
})
