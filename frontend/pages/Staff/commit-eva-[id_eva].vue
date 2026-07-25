<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center">ผู้รับการประเมินผล</h1>
                    </v-card-title>
                    <v-card-text>
                        <p>ชื่อ-สกุล:{{ header.first_name }} {{ header.last_name }}</p>
                        <p>รอบการประเมินที่:{{ header.round_sys }} ปี:{{ header.year_sys }}</p>
                    </v-card-text>
                </v-card>
                <br>
                <v-card>
                    <v-card-title>
                        <h1 class="text-h5 text-center">เพิ่มกรรมการประเมิน</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row v-for="(c,index) in List" :key="c.id_commit">
                                <v-col md="6" cols="12">
                                    <v-select :label="`กรรมการประเมินคนที่:${index+1}`" v-model="c.id_member" :items="MEMBER(index).map((t)=>({title:`${t.fullname_commit}`,value:t.id_member}))"></v-select>
                                </v-col>
                                <v-col md="6" cols="12">
                                    <v-select :label="`ตำแหน่งกรรมการคนที่:${index+1}`" v-model="c.role" :items="ROLE(index)"></v-select>
                                </v-col>
                            </v-row>
                            <center>
                                <v-btn class="text-center m-1" color="primary" type="submit">บันทีก</v-btn>
                                <v-btn class="text-center m-1" color="#7d0c14" type="reset">ยกเลิก</v-btn>
                            </center>
                        </v-form>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">กรรมการประเมิน</th>
                                    <th class="border text-center">ตำแหน่งกรรมการ</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in List" :key="items.id_commit"> 
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ nameOf(items.id_member) }}</td>
                                    <td class="border text-center">{{ items.role }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn size="small" class="text-white ma-3" color="red" @click="del(items.id_commit)">ลบ</v-btn>
                                        </center>
                                    </td>
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

const error = ref<Record<string,string>>({})
const token = import.meta.client ? localStorage.getItem('token'):null
const dataResult = ref([])
const header = ref([])
const role = ['ประธาน','กรรมการ','เลขา']
const id_eva = useRoute().params.id_eva
const people = ref([])

const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''}
])


const fetch = async()=>{

    try {
        
        const res = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res.data
        const res2 = await axios.get(`${staff}/commit/member/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        people.value = res.data.pick
        const useData = res.data.picked
        if(useData.length === 0){
            List.value = [
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''}
            ]
        }else{

            List.value = useData.map((c)=>(
                {id_commit:c.id_commit,id_member:c.id_member,role:c.role}
            ))

            while(List.value.length < 3){
                List.value.push({id_commit:null,id_member:'',role:''})
            }
        }

    } catch (error) {
        console.error("Error fetching commit")
    }

}

const nameMap = computed(()=> Object.fromEntries(people.value.map((p)=>[p.fullname_commit,p.id_member])))
const nameOf = (id:number) => nameMap.value[id]

const MEMBER = (idx:number) =>{

    const picked = List.value.map((c,i) =>(i !== idx ? c.id_member : null))
    return people.value.filter((p)=> !picked.includes(p.id_member))

}

const ROLE = (idx:number) =>{

    const picked = List.value.map((c,i) =>(i !== idx ? c.role : null))
    return role.filter((p)=> !picked.includes(p))

}

const saveMember = async()=>{

    try {
        await axios.post(`${staff}/eva/save`,List.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    } catch (error) {
        console.error("Error commit",error)
    }

}

const del = async(id_commit:number)=>{

    try {
        
        await axios.delete(`${staff}/commit/delete/${id_commit}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()

    } catch (error) {
        console.error("Error delete commit",error)
    }

}

const go = (id_eva:number) =>{

    navigateTo({path:`/Staff/commit-eva-${id_eva}`})

}

onMounted(fetch)

</script>

<style scoped>

</style>