<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-h5 text-center">จัดการผู้รับการประเมินผล</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col md="12" cols="12">
                                    <v-text-field label="ชื่อหัวข้อการประเมิน" v-model="form.name_topic" :error-messages="error.name_topic" prepend-inner-icon="mdi-information"></v-text-field>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <center>
                                        <v-btn class="text-center m-1" color="primary" type="submit">{{ form.id_topic ? 'อัปเดต' :'บันทึก' }}</v-btn>
                                        <v-btn class="text-center m-1" color="#7d0c14" @click="reset()">ยกเลิก</v-btn>
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
                                    <th class="border text-center">ชื่อหัวข้อการประเมิน</th>
                                    <th class="border text-center">จัดการ</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_topic"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_topic }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn size="small" class="text-center text-white ma-3" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn size="small" class="text-white ma-3" color="red" @click="del(items.id_topic)">ลบ</v-btn>
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
        id_topic:null,
        name_topic:''
        
    }
)

const reset = () => {

    form.value = {
        id_topic:null,
        name_topic:''
    }

}

const emailRegex = /^[^\s]+@[^\s]+[^\s]+\.[^\s]{,2}$/i

function validateForm(){

    const f =form.value
    error.value = {}

    if(!f.name_topic.trim())error.value.name_topic = 'กรุณากรอกชื่อหัวข้อการประเมิน'

    return Object.keys(error.value).length === 0

}

const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/topic/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data

    } catch (error) {
        console.error("Error fetching showE")
    }

}

const result = computed(()=>{

    if(!search.value)return dataResult.value

    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{

        return(

            item.name_topic?.toLowerCase().includes(s) 

        )

    })

})

const saveMember = async()=>{

    if(!validateForm())return
    const f = form.value

    try {
        f.id_topic
        ?await axios.put(`${staff}/member/update/${f.id_topic}`,f,{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/member/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error Topic",error)
    }

}

const edit = (items:any)=>{

    form.value = {...items}

}

const del = async(id_topic:number)=>{

    try {
        
        await axios.delete(`${staff}/topic/delete/${id_topic}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()

    } catch (error) {
        console.error("Error delete topic",error)
    }

}
onMounted(fetch)
</script>

<style scoped>

</style>