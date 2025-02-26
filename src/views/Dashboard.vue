<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const route = useRouter();

const data = ref([]);
const dataTopTT = ref([]);
const dataTopTC = ref([]);
const layout = ref('grid');
const options = ref(['list', 'grid']);

const getAll = async () => {
    try {
        const response = await axios.get('http://10.15.169.9:5041/api/Story/getAll');
        data.value = await response.data;
    } catch (e) {
        console.log(e)
    }
}

const getTopTT = async () => {
    try {
        const response = await axios.get('http://10.15.169.9:5041/api/Story/get-top-view/10/TT');
        dataTopTT.value = await response.data;
        console.log(dataTopTT.value)
    } catch (e) {
        console.log(e)
    }
}

const getTopTC = async () => {
    try {
        const response = await axios.get('http://10.15.169.9:5041/api/Story/get-top-view/10/TC');
        dataTopTC.value = await response.data;
    } catch (e) {
        console.log(e)
    }
}

const pushRoute = (id) =>{
    route.push(`detail/${id}`)
}

onMounted(async () => {
    await getAll();
    await getTopTT();
    await getTopTC();
});
</script>
<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="card col-span-9">
            <DataView :value="data.data" :layout="layout" paginator :rows="6">
                <template #header>
                    <div class="flex justify-end">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>

                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col p-4 gap-3"
                                :class="{ 'border-top-1 surface-border': index !== 0 }">
                                <Card style=" overflow: hidden">
                                    <template #content>
                                        <div class="flex gap-10 justify-center">
                                            <div class="overflow-hidden w-48">
                                                <Image alt="user header" :src="item.coverImage" />
                                            </div>
                                            <div class="flex-1 flex items-center">
                                                <div>
                                                    <h1>{{ item.storyName }}</h1>
                                                    <p class="">{{ item.description.length > 35 ?
                                                        item.description.substr(0, 30) + " ..." : item.description }}
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="flex-1 flex items-center justify-end">
                                                <div>
                                                    <Button text raised label="Chi tiết" @click="pushRoute(item.id)" severity="info  " outlined
                                                        class="" /><br />
                                                    <Button text raised severity="help" label="Xem ngay"
                                                        class=" mt-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </Card>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-5">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-4">
                            <Card style="height: 400px; overflow: hidden">
                                <template #header>
                                    <div class="overflow-hidden w-auto h-72">
                                        <Image alt="user header" :src="item.coverImage" />
                                    </div>
                                </template>
                                <template #title>
                                    <h1>{{ item.storyName }}</h1>
                                </template>
                                <template #content>
                                    <p class="">{{ item.description.length > 35 ? item.description.substr(0, 30) + "..."
                                        : item.description }}</p>
                                </template>
                                <template #footer>
                                    <div class="flex gap-4 mt-1">
                                        <Button text raised label="Chi tiết" @click="pushRoute(item.id)" severity="info" outlined class="w-full" />
                                        <Button text raised label="Xem ngay" class="w-full" severity="help" />
                                    </div>
                                </template>
                            </Card>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <div class=" card col-span-3 bg-slate-700">
            <div class="h-1/2">
                <div>
                    <p class="text-xl font-bold text-white">Tóp Truyện Tranh &#129512; &#128685; &#128293;</p>
                </div>
                <Listbox :options="dataTopTT.data" optionLabel="storyName" class="w-full ">
                    <template #option="slotProps">
                        <div class="h-full">
                            <img :alt="slotProps.option.storyAuthor"
                                :src="slotProps.option.coverImage"/>
                            <div><p class="text-center">{{ slotProps.option.storyName }}</p></div>
                        </div>
                    </template>
                </Listbox>
            </div>
            <div class="h-1/2">
                <div>
                    <p class="text-xl font-bold text-white">Tóp Truyện Chữ &#129512; &#128685; &#128293;</p>
                </div>
                <Listbox :options="dataTopTC.data" optionLabel="storyName" class="w-full">
                    <template #option="slotProps">
                        <div class="">
                            <img :alt="slotProps.option.storyAuthor"
                                :src="slotProps.option.coverImage"/>
                            <div><p class="text-center">{{ slotProps.option.storyName }}</p></div>
                        </div>
                    </template>
                </Listbox>
            </div>
        </div>
    </div>
</template>

<style scoped></style>