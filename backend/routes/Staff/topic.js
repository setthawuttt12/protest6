const express = require('express')
const bc = require('bcrypt')
const router = express.Router()
const db = require('../../db')
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {name_topic} = req.body
        const [rows] = await db.query(`insert into tb_topic(name_topic) values(?)`,[name_topic])

        res.json(rows,{message:'save topic'})

    } catch (error) {
        console.error("error save topic",error)
        res.status(500).json({message:"error save topic"})
    }


})

router.put('/update/:id_topic',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_topic} = req.params
        const {name_topic} = req.body
        
        const [rows] = await db.query(`update tb_topic set name_topic = ? where id_topic = ?`,[name_topic,id_topic])
        res.json(rows,{message:'update topic'})

        
    } catch (error) {
        console.error("error update topic",error)
        res.status(500).json({message:"error update topic"})
    }


})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_topic order by id_topic desc`)
        res.json(rows,{message:'get topic'})

    } catch (error) {
        console.error("error get topic",error)
        res.status(500).json({message:"error get topic"})
    }


})

// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

//     try {
        
//         const [rows] = await db.query(`select * from tb_member where role = 'กรรมการประเมิน' order by id_member desc`)
//         res.json(rows,{message:'get memberC'})

//     } catch (error) {
//         console.error("error get memeberE",error)
//         res.status(500).json({message:"error get memberC"})
//     }


// })

router.delete('/delete/:id_topic',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const {id_topic} = req.params
        
        const [rows] = await db.query(`delete from tb_topic where id_topic = ?`,[id_topic])
        res.json(rows,{message:'delete topic'})

    } catch (error) {
        console.error("error get topic",error)
        res.status(500).json({message:"error delete topic"})
    }


})


module.exports = router
