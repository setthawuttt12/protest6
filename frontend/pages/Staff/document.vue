<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-h5 text-center">จัดการผู้รับการประเมินผล</h1>
                    </v-card-title>
                    <v-card-text >
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col md="6" cols="12">
                                    <v-text-field label="ชื่อเอกสาร" v-model="name_doc" :error-messages="error.name_doc" prepend-inner-icon="mdi-file"></v-text-field>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-file-input label="เอกสาร" v-model="file" :error-messages="error.file" accept=".pdf" hint="รองรับเฉพาะไฟล์ PDF ขนาดไม่เกิน 10MB" persistent-hint></v-file-input>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <center>
                                        <v-btn class="text-center ma-1" color="primary" type="submit">บันทีก</v-btn>
                                        <v-btn class="text-center ma-1" color="#7d0c14" type="reset">ยกเลิก</v-btn>
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
                                    <th class="border text-center">ชื่อเอกสาร</th>
                                    <th class="border text-center">วันที่ออกเอกสาร</th>
                                    <th class="border text-center">เอกสาร</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_doc"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_doc }}</td>
                                    <td class="border text-center">{{ items.day_doc }}</td>
                                    <td class="border text-center">
                                        <v-btn v-if="items.file" class="text-center text-white" color="info" prepend-icon="mdi-eye" size="small" @click="view(items.file)">เปิดดู</v-btn>
                                    </td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn size="small" class="text-white ma-3" color="red" @click="del(items.id_doc)">ลบ</v-btn>
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
const file = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const token = import.meta.client ? localStorage.getItem('token'):null
const dataResult = ref([])
const name_doc = ref('')
const search = ref('')

const result = computed(()=>{

    if(!search.value)return dataResult.value

    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{

        return(

            item.name_doc?.toLowerCase().includes(s) 

        )

    })

})

const view = (filename:string)=>{
    const url = new URL(`/uploads/document/${filename}`,api).href
    window.open(url,'_blank')


}

const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/doc/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data

    } catch (error) {
        console.error("Error fetching showE")
    }

}

const saveMember = async()=>{

    if(!name_doc.value.trim() || !file.value)return alert('กรอกข้อมูลให้ครบถ้วน')
    const maxSize = 10 * 1024 * 1024
    if(file.value.size > maxSize){
       return alert("ไฟล์มีขนาดใหญ่เกิน 10 MB")
    }
    const formData = new FormData
    formData.append('name_doc',name_doc.value)
    formData.append('file',file.value!)

    try {
        await axios.post(`${staff}/doc/save`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        file.value = null
        name_doc.value = ''
        await fetch()
    } catch (error) {
        console.error("Error doc",error)
    }

}

const del = async(id_doc:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้')) return
    try {
        
        await axios.delete(`${staff}/doc/delete/${id_doc}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        file.value = null
        name_doc.value = ''

    } catch (error) {
        console.error("Error delete doc",error)
    }

}
onMounted(fetch)
</script>

<style scoped>

</style>