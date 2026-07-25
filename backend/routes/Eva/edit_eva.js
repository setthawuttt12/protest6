const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')
const bc = require('bcrypt')
const { route } = require('../auth')

router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows] = await db.query(`select first_name,last_name,username,email,role from tb_member where id_member=? `,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("Error GET Profile",err)
        res.status(500).json({message:'Error GET Profile'})
    }
})

router.put('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const {first_name,last_name,username,email,role,password} = req.body
        if(password && password.trim()){
            const hash  = await bc.hash(password,10)
            await db.query(`update tb_member set first_name=?,last_name=?,username=?,password=?,role=?,email=? where id_member='${id_member}'`,[first_name,last_name,username,hash,role,email])
        }else{
            await db.query(`update tb_member set first_name=?,last_name=?,username=?,role=?,email=? where id_member='${id_member}'`,[first_name,last_name,username,hash,role,email])
        }
        res.json({message:'Update Success+'})
    } catch (error) {
        console.error("Error Update",error)
        res.status(500).json({message:'Error Update'})
    }
})

module.exports = router