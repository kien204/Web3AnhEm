<template>
    <div class="w-full max-w-6xl mx-auto p-6">
        <h1 class="text-center text-2xl font-bold mb-4">Lịch sử đọc</h1>

        <table class="w-full border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-200">
                    <th class="border p-3">Tên Truyện</th>
                    <th class="border p-3">Ảnh</th>
                    <th class="border p-3">Thời gian đọc</th>
                    <th class="border p-3">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in historyData" :key="item.id" class="text-center">
                    <td class="border p-3">{{ item.storyName }}</td>
                    <td class="border p-3">
                        <img :src="item.image" alt="Ảnh chương" class="w-20 h-28 object-cover mx-auto" />
                    </td>
                    <td class="border p-3">{{ item.accessTime }}</td>
                    <td class="border p-3">
                        <Button label="Đọc tiếp" icon="pi pi-book" @click="goToChapter(item.id)" severity="info" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const uri = ref('http://10.10.33.29:5041'); // Cấu hình API
const historyData = ref([]); // Dữ liệu lịch sử đọc

// Hàm lấy lịch sử đọc từ localStorage và gọi API để lấy thông tin chi tiết
const fetchHistory = async () => {
    try {
        // Lấy danh sách từ localStorage
        let history = JSON.parse(localStorage.getItem('visitedStories')) || [];
        historyData.value = history;
    } catch (error) {
        console.error('Lỗi khi lấy lịch sử đọc:', error);
    }
};

// Hàm chuyển hướng đến trang chi tiết chương
const goToChapter = (id) => {
    router.push(`/view-story/${id}`);
};

// Gọi hàm khi component được mount
onMounted(() => {
    fetchHistory();
});
</script>