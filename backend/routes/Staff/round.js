const express = require('express')
const bc = require('bcrypt')
const router = express.Router()
const db = require('../../db')
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {day_open,day_close,round_sys,year_sys,status_sys} = req.body
        const [rows] = await db.query(`insert into tb_system(day_open,day_close,round_sys,year_sys,status_sys) values(?,?,?,?,?)`,[day_open,day_close,round_sys,year_sys,status_sys])

        res.json(rows,{message:'save round'})

    } catch (error) {
        console.error("error save round",error)
        res.status(500).json({message:"error save round"})
    }


})

router.put('/update/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_sys} = req.params
        const {day_open,day_close,round_sys,year_sys,status_sys} = req.body
        
        const [rows] = await db.query(`update tb_system set day_open=?,day_close=?,round_sys=?,year_sys=?,status_sys=? where id_sys = ?`,[day_open,day_close,round_sys,year_sys,status_sys,id_sys])
        res.json(rows,{message:'update round'})

        
    } catch (error) {
        console.error("error update round",error)
        res.status(500).json({message:"error update round"})
    }


})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_system order by id_sys desc`)
        res.json(rows,{message:'get round'})

    } catch (error) {
        console.error("error get memeberE",error)
        res.status(500).json({message:"error get round"})
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

router.delete('/delete/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const {id_sys} = req.params
        
        const [rows] = await db.query(`delete from tb_system where id_sys = ?`,[id_sys])
        res.json(rows,{message:'delete round'})

    } catch (error) {
        console.error("error get round",error)
        res.status(500).json({message:"error delete round"})
    }


})

module.exports = router

