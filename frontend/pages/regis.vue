<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card color="#7d0c14">
                    <v-card-title>
                        <center><v-img src="/img/logo2.png" width="20%"></v-img></center>
                        <h1 class="text-h5 text-center">สมัครสมาชิก</h1>
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
                                <v-col md="6" cols="12">
                                    <v-select label="ประเภทสมาชิก" v-model="form.role" :error-messages="error.role" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-file-input label="รูปผู้ใช้งาน" v-model="pic_user" :error-messages="error.pic_user" accept=".png , .jpg" hint="รองรับเฉพาะไฟล์ PNG และ JPG" persistent-hint></v-file-input>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <center>
                                        <v-btn class="text-center ma-1" color="primary" type="submit">สมัครสมาชิก</v-btn>
                                        <v-btn class="text-center ma-1" color="#7d0c14" type="reset">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <nuxt-link to="/"><p class="text-center text-blue text-decorated-none">หากมีบัญชีอยู่แล้ว? เข้าสู่ระบบ</p></nuxt-link>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api } from '~/API/base';

const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const pic_user = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const conP = ref('')
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)

definePageMeta(
    {
        layout:false
    }
)

const form = ref(
    {
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:''
    }
)

const emailRegex = /^[^\s]+@[^\s]+[^\s]+\.[^\s]{2,}$/i

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


const saveMember = async()=>{

    if(!validateForm())return
    const formData = new FormData
    formData.append('form',JSON.stringify(form.value))
    formData.append('pic_user',pic_user.value!)

    try {
        
        await axios.post(`${api}/auth/regis`,formData)
        alert('สมัครสำเร็จ')
        navigateTo('/',{replace:true})

    } catch (error) {
        console.error("Error Register",error)
    }

}

</script>

<style scoped>

</style>