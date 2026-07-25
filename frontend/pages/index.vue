<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card color="#7d0c14">
                    <v-card-title>
                        <center><v-img src="/img/logo.png" width="30%"></v-img></center>
                        <h1 class="text-h5 text-center">เข้าสู่ระบบ</h1>
                        <h2 class="text-center">NTC EVALUATION SYSTEM</h2>
                        <h3 class="text-center">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</h3>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-alert type="error" variant="tonal" v-if="error">{{ error }}</v-alert>
                        <v-form @submit.prevent="Login">
                            <v-row>
                                 <v-col md="12" cols="12">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="username" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>
                                 <v-col md="12" cols="12">
                                    <v-text-field label="รหัสผ่าน" v-model="password" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <v-select label="ประเภทสมาชิก" v-model="role" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                                <v-col md="12" cols="12">
                                    <center>
                                        <v-btn class="text-center ma-1" color="primary" type="submit">เข้าสู่ระบบ</v-btn>
                                        <v-btn class="text-center ma-1" color="#7d0c14" type="reset">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <nuxt-link to="/regis"><p class="text-center text-blue text-decorated-none">หากไม่มีบัญชีอยู่ สมัครสมาชิก</p></nuxt-link>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import auth from '~/API/auth';
import { api } from '~/API/base';

const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const pic_user = ref<File | null>(null)
const error = ref('')
const username = ref('')
const password = ref('')
const role = ref('')
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)

definePageMeta(
    {
        layout:false
    }
)

const Login = async()=>{

    try {
        
        const res = await auth.login(
            {
                username:username.value,
                password:password.value,
                role:role.value,
            }
        )
        console.log("login Success",res.data)
        localStorage.setItem('token',res.data.token)
        const userRole = res.data.role
        if(userRole === 'ฝ่ายบุคลากร')useRouter().push('/Staff')
        else if(userRole === 'ผู้รับการประเมินผล')useRouter().push('/Evaluatee')
        else if(userRole === 'กรรมการประเมิน')useRouter().push('/Committee')
    } catch (err:any) {
        console.error("Error login",error)
        error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
    }

}

</script>

<style scoped>

</style>