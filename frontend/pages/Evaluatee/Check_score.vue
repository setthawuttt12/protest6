
<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h5 font-weight-bold">ตรวจสอบผลการประเมิน</h1>
            </v-col>
            <v-card class>
                <v-sheet class="pa-4">
                    <nuxt-link to="/Evaluatee/Score_member">
                        <v-btn color="blue">ตรวจสอบผลการประเมินตนเอง</v-btn>
                    </nuxt-link>&nbsp;&nbsp;
                    <nuxt-link to="/Evaluatee/Score_commit">
                        <v-btn color="success">ตรวจสอบผลการประเมินกรรมการ</v-btn>
                    </nuxt-link>&nbsp;&nbsp;
                </v-sheet>
            </v-card>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped></style>