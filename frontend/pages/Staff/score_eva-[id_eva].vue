<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
                    <v-card class="pa-1">
                        <h1 class="text-center text-h5">ผลสรุปคะแนนผู้รับการประเมินผล</h1>
                        <p>{{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบการประเมินที่:{{ user.first_name }} ปี:{{ user.last_name }}</p>
                    </v-card>
                    <br>
                    <v-row v-for="(t,index) in topics" :key="t.id_topic">
                        <v-col cols="12" md="12">
                            <h1 class="text-h5">{{ index+1 }}.{{ t.name_topic }}</h1>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="border text-center">ตัวชี้วัด</th>
                                        <th class="border text-center">รายละเอียดตัวชี้วัด</th>
                                        <th class="border text-center">น้ำหนักคะแนน</th>
                                        <th class="border text-center">คะแนนเต็ม</th>
                                        <th class="border text-center">รายละเอียดแบบประเมิน</th>
                                        <th class="border text-center">ไฟล์เอกสาร</th>
                                        <th class="border text-center">คะแนนที่ได้</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="items in topics.indicates" :key="items.id_indicate">
                                        <td class="border text-center">{{ items.name_indicate }}</td>
                                        <td class="border text-center">{{ items.detail_indicate }}</td>
                                        <td class="border text-center">{{ items.point_indicate }}</td>
                                        <td class="border text-center">{{ items.point_indicate*4 }}</td>
                                        <td class="border text-center">{{ items.detail_eva }}</td>
                                        <td class="border text-center"><v-btn v-if="items.file_eva" class="text-center text-white" color="info" prepend-icon="mdi-eye" size="small" @click="view(items.file_eva)">เปิดดู</v-btn></td>
                                        <td class="border text-center">
                                            {{ items.score_member * items.point_indicate }} คะแนน
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>
                    <br>
                    <div>
                        <v-card color="success" class="text-end">คะแนนรวม: {{ user.total_eva }} คะแนน</v-card>
                    </div>
                    
                </v-form>
                <v-alert v-else-if="user.status_eva ===1" type="info">รอการประเมินตนเอง</v-alert>
                <v-alert v-else type="warning">ไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, staff } from '~/API/base';

const user = ref<any>({})
const topics = ref<any>([])
const token = import.meta.client ? localStorage.getItem('token') : null
const id_eva = useRoute().params.id_eva

const view = (filename:any) =>{

    const url = `http://localhost:3001/api/uploads/evadetail/${filename}`
    window.open(url,'_blank')

}



const fetchUser = async () => {

    try {

        const res = await axios.get(`${staff}/score_member/user/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        user.value = res.data
        

    } catch (error) {
        console.error("Error fetching user")
    }

}

const fetchTopics = async () => {

    try {

        const res = await axios.get(`${staff}/score_member/topics/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        topics.value = res.data
        

    } catch (error) {
        console.error("Error fetching topics")
    }

}

onMounted(async()=>{
    await Promise.all([fetchTopics(),fetchUser()])
})

</script>

<style scoped></style>