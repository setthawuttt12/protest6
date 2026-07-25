const express = require('express')
const bc = require('bcrypt')
const router = express.Router()
const db = require('../db')
const {requireRole,verifyToken} = require('../middleware/authMiddleware')

router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [[staff]] = await db.query(`select count(*)as total from tb_member where role = 'ฝ่ายบุคลากร'`)
        const [[eva]] = await db.query(`select count(*)as total from tb_member where role = 'ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as total from tb_member where role = 'กรรมการประเมิน'`)
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[evaY]] = await db.query(`select count(*)as total from tb_eva where status_eva = 3`)
        const [[evaN]] = await db.query(`select count(*)as total from tb_eva where status_eva != 3`)
        res.json({
            box:[
                {title:'จำนวนฝ่ายบุคลากร',value:staff.total || 0},
                {title:'จำนวนกรรมการประเมิน',value:commit.total || 0},
                {title:'จำนวนผู้รับการประเมินผล',value:eva.total || 0},
            ],
            box2:[
                {title:'จำนวนแบบประเมิน',value:evaCount.total || 0},
                {title:'จำนวนแบบประเมินที่สำเร็จ',value:evaCount.total > 0 ? `${(evaY.total * 100 /evaCount.total).toFixed(2)}%`:`00.00%`},
                {title:'จำนวนแบบประเมินที่ไม่สำเร็จ',value:evaCount.total > 0 ? `${(evaN.total * 100 /evaCount.total).toFixed(2)}%`:`00.00%`},
            ],

        })

    } catch (error) {
        console.error("error get box",error)
        res.status(500).json({message:'Error get box'})
    }

})

module.exports = router