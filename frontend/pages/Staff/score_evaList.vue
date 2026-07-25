<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-h5 text-center">ผลสรุปคะแนนผู้รับการประเมินผล</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ผู้รับการประเมินผล</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="border text-center">คะแนน</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                    <th class="border text-center">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="border text-center">รอบการประเมินที่:{{ items.round_sys }} ปี:{{ items.year_sys }}</td>
                                    <td class="border text-center">{{ items.day_eva }}</td>
                                    <td class="border text-center">
                                        {{ items.total_eva === null ? 'รอรับการประเมิน' : items.total_eva }}คะแนน
                                    </td>
                                    <td class="border text-center">
                                        <v-btn class="text-center text-white" size="small" :color="bg(items.status_eva)">{{ items.status_eva === 1 ? 'รอการประเมินตนเอง' : items.status_eva === 2 ?  'รอกรรมการประเมิน' : 'ประเมินสำเร็จ'  }}</v-btn>
                                    </td>
                                    <td class="border text-center">
                                        <v-btn class="text-center text-white" size="small" color="info" @click="go(items.id_eva)">รายละเอียด</v-btn>
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
const token = import.meta.client ? localStorage.getItem('token'):null
const result = ref([])
const search = ref('')


const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error fetching eva")
    }

}

const bg = (status_eva:number)=>{
    if(status_eva === 1)return 'error'
    else if(status_eva === 2)return 'wa'
}


const go = (id_eva:number) =>{

    navigateTo({path:`/Staff/score_eva-${id_eva}`})

}

onMounted(fetch)

</script>

<style scoped>

</style>