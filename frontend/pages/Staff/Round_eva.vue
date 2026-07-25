<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-h5 text-center">จัดการรอบการประเมิน</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col md="6" cols="12">
                                    <v-text-field label="วันที่เปิดการประเมิน" v-model="form.day_open" :error-messages="error.day_open" type="date"></v-text-field>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-text-field label="วันที่ปิดการประเมิน" v-model="form.day_close" :error-messages="error.day_close" type="date"></v-text-field>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-text-field label="รอบการประเมิน" v-model="form.round_sys" :error-messages="error.round_sys" type="number"></v-text-field>
                                </v-col>
                                 <v-col md="6" cols="12">
                                    <v-text-field label="ปีการประเมิน" v-model="form.year_sys" :error-messages="error.year_sys" ></v-text-field>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <v-select label="สถานะการประเมิน" v-model="form.status_sys" :error-messages="error.status_sys"></v-select>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <center>
                                        <v-btn class="text-center m-1" color="primary" type="submit">{{ form.id_sys ? 'อัปเดต' :'บันทึก' }}</v-btn>
                                        <v-btn class="text-center m-1" color="#7d0c14" @click="reset()">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">วันที่เปิดการประเมิน</th>
                                    <th class="border text-center">วันที่ปิดการประเมิน</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">ปีการประเมิน</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_sys"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.day_open }}</td>
                                    <td class="border text-center">{{ items.day_close }}</td>
                                    <td class="border text-center">{{ items.round_sys }}</td>
                                    <td class="border text-center">{{ items.year_sys }}</td>
                                    <td class="border text-center">{{ items.status_sys === 'y' ? 'เปิด' : 'ปิด' }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn size="small" class="text-center text-white ma-3" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn size="small" class="text-white ma-3" color="red" @click="del(items.id_sys)">ลบ</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" colspan="10" v-if="result.length === 0">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, staff } from '~/API/base';

const typeR = ['ผู้รับการประเมินผล']
const pic_user = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const conP = ref('')
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)
const token = import.meta.client ? localStorage.getItem('token'):null
const dataResult = ref([])
const search = ref('')

const form = ref(
    {
        id_sys:null,
        day_open:'',
        day_close:'',
        round_sys:'',
        year_sys:'',
        status_sys:''
    }
)

const reset = () => {

    form.value = {
        id_sys:null,
        day_open:'',
        day_close:'',
        round_sys:'',
        year_sys:'',
        status_sys:''
    }

}

const emailRegex = /^[^\s]+@[^\s]+[^\s]+\.[^\s]{,2}$/i

function validateForm(){

    const f =form.value
    error.value = {}

    if(!f.day_open)error.value.day_open = 'กรุณากรอกวันที่เปิดการประเมิน'
    if(!f.day_open)error.value.day_open = 'กรุณากรอกวันที่ปิดการประเมิน'
    if(!f.round_sys)error.value.round_sys = 'กรุณากรอกรอบการประเมิน'

    if(!f.year_sys.trim())error.value.year_sys = 'กรุณากรอกปีการประเมิน'
    else if(f.year_sys.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'

    if(!f.status_sys)error.value.status_sys = 'กรุณาเลือกสถานะการประเมิน'

    return Object.keys(error.value).length === 0

}

const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/round/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error fetching showE")
    }

}

const result =ref([])

const saveMember = async()=>{

    if(!validateForm())return
    const f = form.value
    try {
        f.id_sys
        ?await axios.put(`${staff}/round/update/${f.id_sys}`,f,{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/round/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error round",error)
    }

}

const edit = (items:any)=>{

    form.value = {...items}

}

const del = async(id_sys:number)=>{

    try {
        
        await axios.delete(`${staff}/round/delete/${id_sys}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()

    } catch (error) {
        console.error("Error delete round",error)
    }

}
onMounted(fetch)
</script>

<style scoped>

</style>