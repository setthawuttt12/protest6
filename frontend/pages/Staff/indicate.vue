<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-h5 text-center">จัดการตัวชี้วัด</h1>
                    </v-card-title>
                    <v-card-text >
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col md="6" cols="12">
                                    <v-select label="หัวข้อการประเมิน" v-model="form.id_topic" :error-messages="error.id_topic" prepend-inner-icon="mdi-information" :items="topics.map((t)=>({title:t.name_topic,value:t.id_topic}))"></v-select>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-text-field label="ชื่อตัวชี้วัด" v-model="form.name_indicate" :error-messages="error.name_indicate"></v-text-field>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <v-textarea label="รายละเอียด" v-model="form.detail_indicate" :error-messages="error.detail_indicate" rows="3"></v-textarea>
                                </v-col>
                                 <v-col md="6" cols="12">
                                    <v-select label="น้ำหนักคะแนน" v-model="form.point_indicate" :error-messages="error.point_indicate" :items="[1,2,3,4,5]"></v-select>
                                </v-col>
                                 <v-col md="6" cols="12">
                                    <v-select label="ประเภทตัวเลือก" v-model="form.check_indicate" :error-messages="error.check_indicate" :items="[{title:'มี',value:'y'},{title:'ไม่มี',value:'n'}]"></v-select>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <center>
                                        <v-btn class="text-center ma-1" color="primary" type="submit">{{ form.id_indicate ? 'อัปเดต' :'บันทึก' }}</v-btn>
                                        <v-btn class="text-center ma-1" color="#7d0c14" @click="reset()">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <br>
                        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
                        <br>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">หัวข้อการประเมิน</th>
                                    <th class="border text-center">ชื่อตัวชี้วัด</th>
                                    <th class="border text-center">รายละเอียด</th>
                                    <th class="border text-center">น้ำหนักคะแนน</th>
                                    <th class="border text-center">คะแนนเต็ม</th>
                                    <th class="border text-center">ประเภทตัวเลือก</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_indicate"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_topic }}</td>
                                    <td class="border text-center">{{ items.name_indicate }}</td>
                                    <td class="border text-center">{{ items.detail_indicate }}</td>
                                    <td class="border text-center">{{ items.point_indicate }}</td>
                                    <td class="border text-center">{{ items.point_indicate * 4 }}</td>
                                    <td class="border text-center">{{ items.check_indicate === 'y' ? 'มี' :'ไม่มี' }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn size="small" class="text-center text-white ma-3" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn size="small" class="text-white ma-3" color="red" @click="del(items.id_indicate)">ลบ</v-btn>
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

const typeR = ['กรรมการประเมิน']
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
const topics = ref([])

const form = ref(
    {
        id_indicate:null,
        id_topic:'',
        name_indicate:'',
        detail_indicate:'',
        point_indicate:'',
        check_indicate:''
    }
)

const reset = () => {

    form.value = {
        id_indicate:null,
        id_topic:'',
        name_indicate:'',
        detail_indicate:'',
        point_indicate:'',
        check_indicate:''
    }

}

const emailRegex = /^[^\s]+@[^\s]+[^\s]+\.[^\s]{,2}$/i

function validateForm(){

    const f =form.value
    error.value = {}

    if(!f.id_topic)error.value.id_topic = 'กรุณาเลือกหัวข้อการประเมิน'
    if(!f.name_indicate.trim())error.value.name_indicate = 'กรุณากรอกชื่อตัวชี้วัด'
    if(!f.point_indicate)error.value.point_indicate = 'กรุณาเลือกน้ำหนักคะแนน'

    if(!f.check_indicate)error.value.check_indicate = 'กรุณาเลือกประเภทตัวเลือก'

    return Object.keys(error.value).length === 0

}

const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/indicate/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
        const res2 = await axios.get(`${staff}/topic/show`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error("Error fetching showE")
    }

}

const result = computed(()=>{

    if(!search.value)return dataResult.value

    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{

        return(

            item.name_indicate?.toLowerCase().includes(s)

        )

    })

})

const saveMember = async()=>{

    if(!validateForm())return
    const f = form.value
    try {
        f.id_indicate
        ?await axios.put(`${staff}/indicate/update/${f.id_indicate}`,f,{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/indicate/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error indicate",error)
    }

}

const edit = (items:any)=>{

    form.value = {...items}

}

const del = async(id_indicate:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้')) return
    try {
        
        await axios.delete(`${staff}/indicate/delete/${id_indicate}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()

    } catch (error) {
        console.error("Error delete indicate",error)
    }

}
onMounted(fetch)
</script>

<style scoped>

</style>