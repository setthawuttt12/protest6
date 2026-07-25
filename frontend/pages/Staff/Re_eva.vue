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
                        <br>
                        <center><v-btn class="text-center text-white noP" color="success" @click="print()">พิมพ์</v-btn></center>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, staff } from '~/API/base';
const result = ref([])
const token = import.meta.client ? localStorage.getItem('token'):null


const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/member/showE`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error fetching showE")
    }

}

const print = ()=>{
    window.print()
}



onMounted(fetch)
</script>

<style scoped>

@media print{

    .v-app-bar,.v-btn,.noP{

        display: none !important;
        margin: 0px !important;
        padding: 0px !important;
        margin-top: 0px !important;
        width: 100% !important;

    }

    td,th{
        border: 1px solid black !important;
        color: black !important;
    }

    h1,h2,h3,h4,h5,h6,p{
        color: black !important;
    }

}

</style>