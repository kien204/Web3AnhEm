<template>
    <div class="w-full flex flex-col items-center gap-6">
        <!-- Hiển thị hình ảnh hoặc nội dung truyện -->
        <div class="w-full max-w-6xl p-6 bg-white shadow-2xl rounded-lg">
            <div v-if="urlString.length > 0">
                <div v-for="img in urlString" :key="img" class="flex justify-center mb-4">
                    <img :src="img" alt="" class="w-full max-w-5xl rounded-lg shadow-lg border" />
                </div>
            </div>
            <div v-else>
                <div v-html="dataContent" class="p-6 border rounded-lg"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const pa = useRoute();
const urlString = ref([]);
const dataContent = ref('');
const dataAll = ref({});

console.log('Đang xem truyện với ID:', pa.params.id);

const getAllDetail = async (id) => {
    try {
        const res = await axios.get(`http://10.10.33.29:5041/api/DetailStory/get-detailstory/${id}`);
        dataAll.value = res.data;
        if (dataAll.value.data?.urlImg) {
            urlString.value = dataAll.value.data.urlImg.trim().split(',');
        }
        dataContent.value = dataAll.value.data?.content || '';
    } catch (e) {
        console.error('Lỗi khi lấy dữ liệu:', e);
    }
};

onMounted(() => {
    getAllDetail(pa.params.id);
});

watch(
    () => pa.params.id,
    (newId) => {
        if (newId) getAllDetail(newId);
    },
    { immediate: true }
);
</script>

