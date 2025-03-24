<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const route = useRouter();

const data = ref([]);
const dataTopTT = ref([]);
const dataTopTC = ref([]);
const dataFillter = ref([]);
const searchKey = ref('');
const layout = ref('grid');
const options = ref(['list', 'grid']);
const uri = ref('10.15.7.14');
const value2 = ref(2);
const options2 = ref([
    { name: 'Truyện tranh', value: 1 },
    { name: 'All', value: 2 },
    { name: 'Truyện chữ', value: 3 }
]);
const getAll = async () => {
    try {
        const response = await axios.get(`http://${uri}:5041/api/Story/getAll`);
        data.value = await response.data;
    } catch (e) {
        console.log(e);
    }
};

const getTopTT = async () => {
    try {
        const response = await axios.get(`http://${uri}:5041/api/Story/get-top-view/10/TT`);
        dataTopTT.value = await response.data;
        console.log(dataTopTT.value);
    } catch (e) {
        console.log(e);
    }
};

const getTopTC = async () => {
    try {
        const response = await axios.get(`http://${uri}:5041/api/Story/get-top-view/10/TC`);
        dataTopTC.value = await response.data;
    } catch (e) {
        console.log(e);
    }
};

const pushView = async (id) => {
    try {
        const response = await axios.get(`http://${uri}:5041/api/DetailStory/get-chapter/${id}`);
        let data = await response.data;
        route.push(`view-story/${data.data[0].detailId}`);
    } catch (e) {
        console.log(e);
    }
};

const pushRoute = (id) => {
    route.push(`detail/${id}`);
};

const fillterData = (id) => {
    if (id == 2) {
        dataFillter.value = data.value;
    } else if (id == 1) {
        dataFillter.value = dataTopTT.value;
    } else {
        dataFillter.value = dataTopTC.value;
    }
};

const findStory = async (sk) => {
    if (sk == '') {
        searchKey.value = '';
        fillterData(value2.value);
    } else {
        try {
            let uri = encodeURIComponent(sk);
            const response = await axios.get(`http://${uri}:5041/api/Story/find-story/${uri}`);
            dataFillter.value = await response.data;
        } catch (e) {
            console.log(e);
        }
    }
};

const ClearFind = () => {
    searchKey.value = '';
    fillterData(value2.value);
    return;
};

onMounted(async () => {
    await getAll();
    await getTopTT();
    await getTopTC();
    fillterData(value2.value);
});
</script>
<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="card col-span-9">
            <div class="flex">
                <div class="">
                    <SelectButton v-model="value2" optionValue="value" :options="options2" optionLabel="name" aria-labelledby="multiple" @change="fillterData(value2)" />
                </div>
                <div class="flex-1"></div>
                <div class="flex-1">
                    <InputGroup>
                        <IconField>
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="searchKey" placeholder="Tìm kiếm" type="text" @input="findStory(searchKey)" />
                        </IconField>
                        <Button label="Clear" @click="ClearFind" iconPos="right" severity="danger" icon="pi pi-ban" />
                    </InputGroup>
                </div>
            </div>
            <DataView :value="dataFillter.data" :layout="layout" paginator :rows="6">
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
                            <div class="flex flex-col p-4 gap-3" :class="{ 'border-top-1 surface-border': index !== 0 }">
                                <Card style="overflow: hidden">
                                    <template #content>
                                        <div class="flex gap-10 justify-center">
                                            <div class="overflow-hidden w-48">
                                                <Image alt="user header" :src="item.coverImage" />
                                            </div>
                                            <div class="flex-1 flex items-center">
                                                <div>
                                                    <h1>{{ item.storyName }}</h1>
                                                    <p class="">{{ item.description.length > 35 ? item.description.substr(0, 30) + ' ...' : item.description }}</p>
                                                </div>
                                            </div>
                                            <div class="flex-1 flex items-center justify-end">
                                                <div>
                                                    <Button text raised label="Chi tiết" @click="pushRoute(item.id)" severity="info  " outlined class="" /><br />
                                                    <Button text raised severity="help" @click="pushView(item.id)" label="Xem ngay" class="mt-5" />
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
                                    <div class="overflow-hidden w-auto h-64">
                                        <img alt="user header" :src="item.coverImage" class="!h-full !w-auto" />
                                    </div>
                                </template>
                                <template #title>
                                    <h1>{{ item.storyName }}</h1>
                                </template>
                                <template #content>
                                    <p class="">{{ item.description.length > 35 ? item.description.substr(0, 30) + '...' : item.description }}</p>
                                </template>
                                <template #footer>
                                    <div class="flex gap-4 mt-1">
                                        <Button text raised label="Chi tiết" @click="pushRoute(item.id)" severity="info" outlined class="w-full" />
                                        <Button text raised @click="pushView(item.id)" label="Xem ngay" class="w-full" severity="help" />
                                    </div>
                                </template>
                            </Card>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <div class="col-span-3">
            <Card>
                <template #title>
                    <p>Danh sách top</p>
                </template>
                <template #content>
                    <div class="">
                        <div class="h-1/2">
                            <div>
                                <p class="text-xl font-bold">Tóp Truyện Tranh &#129512; &#128685; &#128293;</p>
                            </div>
                            <div class="h-5/6 bg-white border border-solid border-slate-200 rounded-md overflow-hidden overflow-y-auto">
                                <div class="m-3 hover:shadow-md hover:rounded-md" v-for="item in dataTopTT.data" :key="item">
                                    <img :alt="item.storyAuthor" :src="item.coverImage" class="rounded-t-md" />
                                    <div>
                                        <p class="text-center">{{ item.storyName }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="h-1/2">
                            <div>
                                <p class="text-xl font-bold">Tóp Truyện Chữ &#129512; &#128685; &#128293;</p>
                            </div>
                            <div class="h-5/6 bg-white border border-solid border-slate-200 rounded-md overflow-hidden overflow-y-auto">
                                <div class="m-3 hover:shadow-md hover:rounded-md" v-for="item in dataTopTC.data" :key="item">
                                    <img :alt="item.storyAuthor" :src="item.coverImage" class="rounded-t-md" />
                                    <div>
                                        <p class="text-center">{{ item.storyName }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped></style>