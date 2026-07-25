const express = require('express')
const bc = require('bcrypt')
const router = express.Router()
const db = require('../../db')
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {first_name,last_name,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows] = await db.query(`insert into tb_member(first_name,last_name,email,username,password,role) values(?,?,?,?,?,?)`,[first_name,last_name,email,username,hash,role])

        res.json(rows,{message:'save member'})

    } catch (error) {
        console.error("error save memeber",error)
        res.status(500).json({message:"error save member"})
    }


})

router.put('/update/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const { id_member } = req.params
        const {first_name,last_name,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows] = await db.query(`update tb_member set first_name = ? , last_name = ? , email = ? , username = ? , password = ? , role = ? where id_member = ?`,[first_name,last_name,email,username,hash,role,id_member])
            res.json(rows,{message:'update member'})
        }else{
            const [rows] = await db.query(`update tb_member set first_name = ? , last_name = ? , email = ? , username = ? , role = ? where id_member = ?`,[first_name,last_name,email,username,role,id_member])
            res.json(rows,{message:'update member'})
        }
        
    } catch (error) {
        console.error("error update memeber",error)
        res.status(500).json({message:"error update member"})
    }


})

router.get('/showE',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_member where role = 'ผู้รับการประเมินผล' order by id_member desc`)
        res.json(rows,{message:'get memberE'})

    } catch (error) {
        console.error("error get memeberE",error)
        res.status(500).json({message:"error get memberE"})
    }


})

router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_member where role = 'กรรมการประเมิน' order by id_member desc`)
        res.json(rows,{message:'get memberC'})

    } catch (error) {
        console.error("error get memeberE",error)
        res.status(500).json({message:"error get memberC"})
    }


})

router.delete('/delete/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const { id_member } = req.params
        
        const [rows] = await db.query(`delete from tb_member where id_member = ?`,[id_member])
        res.json(rows,{message:'delete member'})

    } catch (error) {
        console.error("error get memeberE",error)
        res.status(500).json({message:"error delete member"})
    }


})

module.exports = router


