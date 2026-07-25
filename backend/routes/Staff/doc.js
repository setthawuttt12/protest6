const express = require('express')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/document')
const router = express.Router()
const db = require('../../db')
const fs = require('fs')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const file = req.files?.file
        const {name_doc} = req.body
        const maxSize = 10 * 1024 * 1024

        if(file.size > maxSize){
            return res.status(400).json({message:'ไฟล์มีขนาดใหญ่เกิน 10MB'})
        }
        const filename = Date.now() + path.extname(file.name)
        await file.mv(path.join(uploadDir,filename))
        await db.query(`insert into tb_doc(name_doc,day_doc,file) values(?,CURDATE(),?)`,[filename,filename])

        res.json({message:"doc Success"})

    } catch (error) {
        console.error("doc error",error)
        res.status(500).json({message:"error doc"})
    }

})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows,{message:'get doc'})

    } catch (error) {
        console.error("error get doc",error)
        res.status(500).json({message:"error get doc"})
    }


})

router.delete('/delete/:id_doc',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const {id_doc} = req.params
        
        const [[d]] = await db.query(`delete file from tb_doc where id_doc = ?`,[id_doc])
        const fp = path.join(uploadDir,d.file)
        if(fs.existSync(fp)){
            fs.unlinkSync(fp)
        }
        const [rows] = await db.query(`delete from tb_doc where id_doc = ?`,[id_doc])
        res.json(rows)

    } catch (error) {
        console.error("error get doc",error)
        res.status(500).json({message:"error delete doc"})
    }


})


module.exports = router