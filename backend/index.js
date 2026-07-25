require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors ({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use(express.urlencoded({extended:true}))

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const dash = require('./routes/dash')
app.use('/api/dash',dash)

//Staff api
const member = require('./routes/Staff/member')
app.use('/api/Staff/member',member)

const topic = require('./routes/Staff/topic')
app.use('/api/Staff/topic',topic)

const indicate = require('./routes/Staff/indicate')
app.use('/api/Staff/indicate',indicate)

const round = require('./routes/Staff/round')
app.use('/api/Staff/round',round)

const eva = require('./routes/Staff/eva')
app.use('/api/Staff/eva',eva)

const commit = require('./routes/Staff/commit')
app.use('/api/Staff/commit',commit)

const score_member2 = require('./routes/Staff/score_member')
app.use('/api/Staff/score_member',score_member2)

const score_commit2 = require('./routes/Staff/score_commit')
app.use('/api/Staff/score_commit',score_commit2)

const status = require('./routes/Staff/status')
app.use('/api/Staff/status',status)

const doc = require('./routes/Staff/doc')
app.use('/api/Staff/doc',doc)


app.use((req,res)=> res.status(404).json({message:'404 Invalid Route09'}))
app.listen(PORT, ()=> console.log(`SERVER RUNNING ON PORT ${PORT}`))