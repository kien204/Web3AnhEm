<template>
    <div class="w-full flex flex-col items-center p-6">
        <h2 class="text-3xl font-bold text-orange-600 mb-6">Chọn Thể Loại Truyện</h2>

        <div class="card">
            <div class="flex justify-center" v-for="item in allGenres" :key="item">
                <SelectButton v-model="selectedGenres" :options="item" multiple aria-labelledby="multiple" />
            </div>
        </div>
    </div>

    <!-- Nút xác nhận -->
    <div class="flex justify-center">
        <Button class="rounded-md text-lg font-semibold hover:bg-green-800 transition-all" @click="confirmSelection">🔍 Tìm Truyện</Button>
    </div>

    <!-- Danh sách truyện -->
    <div v-if="filteredStories.data" class="w-full max-w-7xl p-6 mt-6 rounded-md shadow-lg">
        <h3 class="text-2xl font-semibold">Kết quả tìm kiếm: &#128165;</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 overflow-hidden overflow-y-auto">
            <div v-for="(story, index) in filteredStories.data" :key="index" class="border-1 border-slate-200 rounded-md p-4 shadow-md transition-all hover:scale-105">
                <div class="w-full h-40 flex items-center justify-center overflow-hidden">
                    <img :src="story.coverImage" alt="Story Image" class="w-full h-full object-cover rounded-md" />
                </div>
                <h4 class="text-lg text-center font-bold mt-3">{{ story.storyName }}</h4>
                <p class="text-center">{{ story.description.length > 35 ? story.description.substr(0, 30) + ' ...' : story.description }}</p>

                <div class="flex justify-center mt-3">
                    <div class="flex gap-5">
                        <Button text raised label="Chi tiết" @click="pushRoute(story.id)" severity="info" />
                        <Button text raised severity="help" @click="pushView(story.id)" label="Xem ngay" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const route = useRouter();
const allGenres = ref([]);
const selectedGenres = ref([]);
const filteredStories = ref([]);
const url = ref('http://10.10.33.29:5041');

const fetchGenres = async () => {
    try {
        const response = await fetch(`${url.value}/api/Story/get-type`);
        const data = await response.json();
        for (let i = 0; i < data.data.length; i += 7) {
            allGenres.value.push(data.data.slice(i, i + 7));
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
    }
};

const confirmSelection = async () => {
    try {
        let uri = '';
        filteredStories.value = [];
        if (selectedGenres.value.length != 0) {
            uri = encodeURIComponent(selectedGenres.value.join(','));
        } else {
            return;
        }
        const response = await axios.get(`${url.value}/api/Story/filter-story/${uri}`);
        filteredStories.value = await response.data;
        console.log(filteredStories.value);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
    }
};

const pushRoute = (id) => {
    route.push(`/detail/${id}`);
};

const pushView = async (id) => {
    try {
        const response = await axios.get(`${url.value}/api/DetailStory/get-chapter/${id}`);
        let data = await response.data;
        route.push(`/view-story/${data.data[0].detailId}`);
    } catch (e) {
        console.log(e);
    }
};
onMounted(async () => {
    await fetchGenres();
});
</script>
