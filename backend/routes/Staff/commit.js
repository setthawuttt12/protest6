const express = require('express')
const bc = require('bcrypt')
const router = express.Router()
const db = require('../../db')
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.post('/save/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const {id_eva} = req.params.id_eva

        await db.query(`delete from tb_commit where id_eva = ?`,[id_eva])
        const m = req.body
        const v = m.map(p => [id_eva,p.id_member,p.role,'n'])
        await db.query(`insert into tb_commit(id_eva,id_member,level_commit,status_commit) values ?`,[v])

        res.json({message:'save commit'})

    } catch (error) {
        console.error("error save commit",error)
        res.status(500).json({message:"error save commit"})
    }


})


router.get('/member/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_eva} = req.params.id_eva
        const [pick] = await db.query(`select id_member,concat(first_name,'',last_name)as fullname_commit from tb_member where role= 'กรรมการประเมิน' order by id_member desc`)
        const [picked] = await db.query(`select id_commit,tb_member.id_member,first_name,last_name,level_commit as role from tb_member,tb_eva,tb_commit where tb_commit.id_eva = ? and tb_commit.id_member = tb_member.id_member`,[id_eva])
        
        res.json({pick,picked})
    } catch (error) {

        console.error("Error get",error)
        res.status(500).json({message:'Error get'})
        
        
    }

})

router.get('/header/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const {id_eva} = req.params.id_eva
        const [rows] = await db.query(`select * from tb_eva e,tb_member m,tb_system s where e.id_eva = ? and e.id_member = m.id_member and e.id_sys = s.id_sys`,[id_eva])
        res.json(rows[0])

    } catch (error) {
        console.error("error get header",error)
        res.status(500).json({message:"error get header"})
    }


})

router.delete('/delete/:id_commit',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        const {id_commit} = req.params
        
        const [rows] = await db.query(`delete from tb_commit where id_commit = ?`,[id_commit])
        res.json(rows,{message:'delete commit'})

    } catch (error) {
        console.error("error get commit",error)
        res.status(500).json({message:"error delete commit"})
    }


})

module.exports = router

