<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-h5 text-center">สถานะการประเมินของกรรมการประเมิน</h1>
                    </v-card-title>
                    <v-card-text >
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">กรรมการประเมิน</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_commit"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-center text-white" size="small" :color="bg(items.status_commit)">{{ items.status_commit === 'y' ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน'  }}</v-btn>
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
        
        const res = await axios.get(`${staff}/status/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error fetching eva")
    }

}

const bg = (status_commit:string)=>{
    if(status_commit === 'n')return 'error'
    else if(status_commit === 'y')return 'success'
}


const go = (id_eva:number) =>{

    navigateTo({path:`/Staff/commit-status-${id_eva}`})

}

onMounted(fetch)

</script>

<style scoped>

</style>