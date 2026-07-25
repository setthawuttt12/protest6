const express = require('express')
const bc = require('bcrypt')
const router = express.Router()
const db = require('../../db')
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_commit c where c.id_eva = ? and c.id_eva = e.id_eva and c.id_member = m.id_member`)
        res.json(rows,{message:'get status'})

    } catch (error) {
        console.error("error get memeberE",error)
        res.status(500).json({message:"error get status"})
    }


})


module.exports = router

