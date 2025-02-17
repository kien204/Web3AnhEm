<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Tạo ref cho mảng chứa các đối tượng truyện
const truyenList = ref([]);
const apiUrl = 'http://10.15.89.56:5041/api/Story/getAll'; // Địa chỉ API của bạn

const getTruyen = async () => {
    try {
        const response = await axios.get(apiUrl);
        truyenList.value = response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    getTruyen();
});
</script>

<template>
    <div>
        <h2 class="text-2xl font-bold mt-20 mb-4 text-center">Danh sách truyện đã đăng</h2>
        <ul>
            <li v-for="truyen in truyenList" :key="truyen.id" class="p-2 border-round surface-border surface-card mb-2">
                <p>ID: {{ truyen.id }}</p>
                <p>Tên: {{ truyen.storyName }}</p>
                <p>Thể loại: {{ truyen.typeStory }}</p>
                <p>Mô tả: {{ truyen.description }}</p>
                <p>
                    File: <a :href="truyen.coverImage" target="_blank">{{ truyen.coverImage }}</a>
                </p>
                <img :src="truyen.coverImage" alt="">
            </li>
        </ul>
    </div>
</template>

<style scoped>
.p-2 {
    padding: 0.5rem;
}

.border-round {
    border-radius: 0.5rem;
}

.surface-border {
    border: 1px solid #ccc;
}

.surface-card {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mb-2 {
    margin-bottom: 0.5rem;
}
</style>