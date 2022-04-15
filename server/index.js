const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/user.model")
const jwt = require("jsonwebtoken")


const port = 1337

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/User_data', ()=>{
    console.log("Successfully connected to database User_data")
})

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.create({
            name: req.body.name, 
            email: req.body.email,
            password: req.body.password,
        })
        res.json({ status: 'ok' })
    }catch(err){
        res.json({ status : "error", error: "Duplicate email" })
    }
})


app.post('/api/login', async (req, res) => {
    console.log(req.body)
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    if (user) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            }, 
            'secret123'
        )
        return res.json({ status: 'ok' , user: token})
    } else {
        return res.json({ status: 'error', user: false })
    }
})


// app.post('/api/quote', async (req, res) => {
// 	const token = req.headers['x-access-token']

// 	try {
// 		const decoded = jwt.verify(token, 'secret123')
// 		const email = decoded.email
// 		await User.updateOne(
// 			{ email: email },
// 			{ $set: { quote: req.body.quote } }
// 		)

// 		return res.json({ status: 'ok' })
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: 'invalid token' })
// 	}
// })

app.listen(port, ()=> {
    console.log("Successfully connected to port " + port)
})