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
                                <v-col md="6" cols="12">
                                    <v-text-field label="ชื่อ" v-model="form.first_name" :error-messages="error.first_name" prepend-inner-icon="mdi-alpha-f"></v-text-field>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-text-field label="นามสกุล" v-model="form.last_name" :error-messages="error.last_name" prepend-inner-icon="mdi-alpha-l"></v-text-field>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email" prepend-inner-icon="mdi-email"></v-text-field>
                                </v-col>
                                 <v-col md="6" cols="12">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>
                                 <v-col md="6" cols="12">
                                    <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="conP" :error-messages="error.conP" :prepend-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" :type="showPw2 ? 'text':'password'" @click:prepend-inner="show2 = !show2 , showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <v-select label="ประเภทสมาชิก" v-model="form.role" :error-messages="error.role" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <center>
                                        <v-btn class="text-center m-1" color="primary" type="submit">{{ form.id_member ? 'อัปเดต' :'บันทึก' }}</v-btn>
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
                                    <th class="border text-center">ชื่อ-สกุล</th>
                                    <th class="border text-center">อีเมล</th>
                                    <th class="border text-center">ชื่อผู้ใช้</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="border text-center">{{ items.email }}</td>
                                    <td class="border text-center">{{ items.username }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn size="small" class="text-center text-white ma-3" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn size="small" class="text-white ma-3" color="red" @click="del(items.id_member)">ลบ</v-btn>
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
        id_member:null,
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:''
    }
)

const reset = () => {

    form.value = {
        id_member:null,
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:''
    }

}

const emailRegex = /^[^\s]+@[^\s]+[^\s]+\.[^\s]{,2}$/i

function validateForm(){

    const f =form.value
    error.value = {}

    if(!f.first_name.trim())error.value.first_name = 'กรุณากรอกชื่อ'
    if(!f.last_name.trim())error.value.last_name = 'กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email = 'กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email = 'รูปแบบอีเมลไม่ถูกต้อง'

    if(!f.username.trim())error.value.username = 'กรุณากรอกชื่อผู้ใช้งาน'
    else if(f.username.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'

    if(!f.password.trim())error.value.password = 'กรุณากรอกรหัสผ่าน'
    else if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'
    else if(conP.value.trim() != f.password.trim())error.value.conP = 'รหัสผ่านไม่ตรงกัน'

    if(!f.role.trim())error.value.role = 'กรุณาเลือกประเภทสมาชิก'

    return Object.keys(error.value).length === 0

}

const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/member/showE`,{headers:{Authorization:`Bearer ${token}`}})
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

            item.first_name?.toLowerCase().includes(s)  ||
            item.last_name?.toLowerCase().includes(s)  ||
            item.email?.toLowerCase().includes(s)  ||
            item.username?.toLowerCase().includes(s) 

        )

    })

})

const saveMember = async()=>{

    if(!validateForm())return
    const f = form.value
    const payload = {
        first_name:f.first_name,
        last_name:f.last_name,
        email:f.email,
        username:f.username,
        password:f.password,
        role:f.role,
        ...(form.value.password ? {password:form.value.password}:null)
    }

    try {
        form.value.id_member 
        ?await axios.put(`${staff}/member/update/${form.value.id_member}`,payload,{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/member/save`,{...payload,password:form.value.password},{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
        conP.value = ''
    } catch (error) {
        console.error("Error manageEva",error)
    }

}

const edit = (items:any)=>{

    form.value = {...items}

}

const del = async(id_member:number)=>{

    try {
        
        await axios.delete(`${staff}/member/delete/${id_member}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()

    } catch (error) {
        console.error("Error delete Eva",error)
    }

}
onMounted(fetch)
</script>

<style scoped>

</style>