const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.get('/user',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member,id_eva]
        )
        res.json(rows[0])
    }catch(err){
        console.error("Error GET User",err)
        res.status(500).json({message:'Error GET User'})
    }
})

router.get('/topics/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate `)
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    }catch(err){
        console.error("Error GET User",err)
        res.status(500).json({message:'Error GET User'})
    }
})

router.get('/scores/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
       
        const [rows] = await db.query(`select * from tb_indicate i,tb_evadetail d where id_eva = ? and i.id_indicate = d.id_indicate and status_eva in (2,3,4)`,[id_eva])
        const scores = {}
        rows.map(row =>{
            if(!scores[row.id_indicate]){
                scores[row.id_indicate] = {
                    a:null,
                    b:null,
                    c:null
                }
            }
            if(row.status_eva === 2)scores[row.id_indicate].a = row.score_commit * row.point_indicate
            if(row.status_eva === 3)scores[row.id_indicate].b = row.score_commit * row.point_indicate
            if(row.status_eva === 4)scores[row.id_indicate].c = row.score_commit * row.point_indicate

        })
        res.json({scores})

    }catch(err){
        console.error("Error GET scores",err)
        res.status(500).json({message:'Error GET scores'})
    }
})

router.get('/commit/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params.id_eva
        const [rows] = await db.query(`select * from tb_member m,tb_commit c,tb_system s,tb_eva e where e.id_eva = ? and e.id_eva = c.id_eva and c.id_member = m.id_member and e.id_sys = s.id_sys`,[id_eva])
        res.json(rows)
    }catch(err){
        console.error("Error GET User",err)
        res.status(500).json({message:'Error GET User'})
    }
})
module.exports = router