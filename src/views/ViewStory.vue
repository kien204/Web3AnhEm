<template>
    <div>
        <div v-if="urlString.length > 0">
            <div v-for="img in urlString" :key="img">
                <img :src="img" alt="" />
            </div>
        </div>
        <div v-else>
            <div v-html="dataContent"></div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const urlString = ref([]);
const params = ref();
const dataContent = ref('');
const dataAll = ref({});

const getAllDetail = async (id) => {
    try {
        const res = await axios.get(`http://localhost:5041/api/DetailStory/get-detailstory/${id}`);
        dataAll.value = res.data; // Không cần await với res.data
        // Kiểm tra nếu urlImg tồn tại và xử lý nó
        if (dataAll.value.data?.urlImg) {
            urlString.value = dataAll.value.data.urlImg.trim().split(',');
        }
        // Cập nhật nội dung nếu có
        dataContent.value = dataAll.value.data?.content || ''; // Sử dụng content nếu có
    } catch (e) {
        console.error('Lỗi khi lấy dữ liệu:', e);
    }
};

// Gọi API khi component được tải
onMounted(() => {
    params.value = useRoute().params;
    getAllDetail(params.value.id); // Truyền ID muốn lấy
});
</script>

<style>
/* Thêm CSS nếu cần */
</style>
