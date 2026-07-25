<template>
    <v-container>
        <v-sheet elevation="5" class="pa-3">
            <h1 class="text-center">Dashboard-Staff</h1>
            <v-card class="bg-white pa-3" elevation="5">
                <v-row>
                    <v-col v-for="b in box" :key="b" cols="12" md="4">
                        <v-card class="pa-2">
                            <v-card-title>
                                <h5 class="text-center text-h5">{{ b.title }}</h5>
                            </v-card-title>
                            <v-card-text>
                                <h5 class="text-center text-h5">{{ b.value }}</h5>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-for="b in box2" :key="b" cols="12" md="4">
                        <v-card class="pa-2">
                            <v-card-title>
                                <h5 class="text-center">{{ b.title }}</h5>
                            </v-card-title>
                            <v-card-text>
                                <h5 class="text-center">{{ b.value }}</h5>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-sheet>
        
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api } from '~/API/base';

const box = ref([])
const box2 = ref([])
const token = import.meta.client ? localStorage.getItem('token'):null

const fetch = async() => {

    try {
        
        const res = await axios.get(`${api}/dash/staff`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        box2.value = res.data.box2

    } catch (error) {
        console.error("error fetching box",error)
    }

}

onMounted(fetch)

</script>

<style scoped>

</style>