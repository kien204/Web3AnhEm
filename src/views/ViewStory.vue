<template>
    <div class="w-full">
        <div v-if="urlString.length > 0" class="flex flex-col justify-center">
            <div v-for="img in urlString" :key="img" class="flex justify-center gap-1">
                <img :src="img" alt="" class="w-2/3" />
            </div>
        </div>
        <div v-else>
            <div v-html="dataContent" class="card"></div>
        </div>
    </div>
    <div class="fixed top-20 right-[5%]">
        <Button icon="pi pi-ellipsis-v" severity="danger" @click="toggle" />

        <OverlayPanel ref="op">
            <div class="card flex gap-0 items-center">
                <div>
                    <Button icon="pi pi-arrow-left" text raised severity="danger" @click="statu" />
                </div>
                <div>
                    <Dropdown v-model="chapters" optionValue="detailId" :options="dataChapter.data" optionLabel="chapter" class="w-full md:w-14rem" @change="pushView(chapters)" />
                </div>
                <div>
                    <Button icon="pi pi-arrow-right" text raised severity="danger" @click="statu" />
                </div>
            </div>
        </OverlayPanel>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRouter();
const pa = useRoute();
const chapters = ref();
const urlString = ref([]);
const dataContent = ref('');
const dataAll = ref({});
const dataChapter = ref({});
const disBack = ref(false);
const disNext = ref(false);
const op = ref();
const getAllDetail = async (id) => {
    try {
        const res = await axios.get(`http://10.15.250.41:5041/api/DetailStory/get-detailstory/${id}`);
        dataAll.value = res.data; // Không cần await với res.data
        // Kiểm tra nếu urlImg tồn tại và xử lý nó
        // console.log(dataAll.value);
        if (dataAll.value.data?.urlImg) {
            urlString.value = dataAll.value.data.urlImg.trim().split(',');
        }

        // Cập nhật nội dung nếu có
        dataContent.value = dataAll.value.data?.content || ''; // Sử dụng content nếu có

        if (dataAll.value.data) {
            const response = await axios.get(`http://10.15.250.41:5041/api/DetailStory/get-chapter/${dataAll.value.data?.storyID}`);
            dataChapter.value = response.data; // Không cần await với res.data
            chapters.value = dataAll.value.data?.detailID;
            let indx = findIndex(dataChapter.value.data, pa.params.id);
            statu(dataChapter.value.data, indx);
        }
    } catch (e) {
        console.error('Lỗi khi lấy dữ liệu:', e);
    }
};

// Gọi API khi component được tải
onMounted(() => {
    getAllDetail(pa.params.id); // Truyền ID muốn lấy
});
const toggle = (event) => {
    op.value.toggle(event);
};
const pushView = (data) => {
    console.log(data);
    route.push(`/view-story/${data}`);
};

watch(
    () => pa.params.id,
    (newId) => {
        if (newId) {
            getAllDetail(newId);
        }
    },
    { immediate: true }
);
const findIndex = (data, item) => {
    return data.findIndex((ite) => ite.detailId == item);
};
const statu = (data, ind) => {
    if (ind == 0) {
        disBack.value = true;
    } else if (data.length - 1 == ind) {
        disNext.value = true;
    } else {
        disBack.value = false;
        disNext.value = false;
    }
};
</script>

<style>
/* Thêm CSS nếu cần */
</style>
