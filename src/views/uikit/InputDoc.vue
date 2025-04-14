<template>
    <div class="w-full max-w-6xl mx-auto p-6">
        <h1 class="text-center text-2xl font-bold mb-4">Truyện Hot</h1>

        <div v-if="hotStories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="story in hotStories" :key="story.id" class="card shadow-lg p-4 rounded-lg">
                <img :src="story.coverImage || 'https://via.placeholder.com/100x150?text=No+Image'" alt="Story Image" class="w-full h-48 object-cover rounded-lg mb-4" />
                <h2 class="text-xl font-semibold">{{ story.storyName }}</h2>
                <Button label="Xem ngay" icon="pi pi-book" @click="goToStory(story.id)" class="mt-4" />
            </div>
        </div>

        <div v-else>
            <p class="text-center text-gray-500">Không có truyện hot nào.</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const uri = ref('http://10.10.33.29:5041'); // API URL
const hotStories = ref([]); // Danh sách truyện hot

// Hàm lấy danh sách truyện hot từ API mới
const fetchHotStories = async () => {
    try {
        const res = await axios.get(`${uri.value}/api/Story/top-by-comments`);
        hotStories.value = res.data.data || [];
        console.log('Danh sách truyện hot:', hotStories.value);
        
    } catch (error) {
        console.error('Lỗi khi lấy danh sách truyện hot:', error);
    }
};

// Hàm chuyển hướng đến trang chi tiết truyện
const goToStory = async (id) => {
    try {
        const response = await axios.get(`${uri.value}/api/DetailStory/get-chapter/${id}`);
        let data = await response.data;
        router.push(`/view-story/${data.data[0].detailId}`);
    } catch (e) {
        console.log(e);
    }
};

// Gọi hàm khi component được mount
onMounted(() => {
    fetchHotStories();
});
</script>

<style scoped>
.card {
    border: 1px solid #e5e7eb;
    transition: transform 0.2s ease-in-out;
}
.card:hover {
    transform: translateY(-5px);
}
</style>
