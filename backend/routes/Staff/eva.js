const express = require('express')
const bc = require('bcrypt')
const router = express.Router()
const db = require('../../db')
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_member,id_sys,day_eva,status_eva} = req.body
        const [rows] = await db.query(`insert into tb_eva(id_member,id_sys,day_eva,status_eva) values(?,?,?,?)`,[id_member,id_sys,day_eva,1])

        res.json(rows,{message:'save eva'})

    } catch (error) {
        console.error("error save eva",error)
        res.status(500).json({message:"error save eva"})
    }


})

router.put('/update/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_eva} = req.params
        const {id_member,id_sys,day_eva,status_eva} = req.body
        
        const [rows] = await db.query(`update tb_eva set id_member=?,id_sys=?,day_eva=?,status_eva=? where id_eva = ?`,[id_member,id_sys,day_eva,1,id_eva])
        res.json(rows,{message:'update round'})

        
    } catch (error) {
        console.error("error update round",error)
        res.status(500).json({message:"error update round"})
    }


})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_system s,tb_member m,tb_eva e where e.id_sys = s.id_sys and e.id_member = m.id_member order by id_eva desc`)
        res.json(rows,{message:'get eva'})

    } catch (error) {
        console.error("error get memeberE",error)
        res.status(500).json({message:"error get eva"})
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

router.delete('/delete/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const {id_eva} = req.params
        
        const [rows] = await db.query(`delete from tb_eva where id_eva = ?`,[id_eva])
        res.json(rows,{message:'delete eva'})

    } catch (error) {
        console.error("error get eva",error)
        res.status(500).json({message:"error delete eva"})
    }


})

module.exports = router

