<template>
    <div class="w-full flex flex-col items-center gap-6">
        <!-- Chuyển chương -->
        <div class="fixed top-20 right-[5%] z-50 flex items-center gap-2">
            <Button type="button" icon="pi pi-ellipsis-v" @click="showTopBar" severity="danger" />

            <Dialog v-model:visible="vis" header="Chọn Chap" position="topright">
                <div class="flex gap-1">
                    <Button @click="previousChapter" :disabled="show.checkB" icon="pi pi-arrow-left" severity="danger" />
                    <Dropdown v-model="selectedChapter" :options="dataChapter" optionLabel="chapter" optionValue="detailId" @change="pushView(selectedChapter)" />
                    <Button @click="nextChapter" :disabled="show.checkN" icon="pi pi-arrow-right" severity="danger" />
                </div>
            </Dialog>
        </div>

        <div>
            <h1 class="text-center text-2xl text-indigo-950 font-medium">{{ dataChapter[dataChapter.findIndex((x) => x.detailId == selectedChapter)]?.chapter }}</h1>
        </div>

        <!-- Hiển thị nội dung truyện -->
        <div class="w-full max-w-6xl p-6">
            <div v-if="urlString.length > 0">
                <div v-for="img in urlString" :key="img" class="flex justify-center mb-4">
                    <img :src="img" alt="" class="w-full max-w-5xl rounded-lg shadow-lg border" />
                </div>
            </div>
            <div v-else>
                <div v-html="dataContent" class="p-6 card text-xl"></div>
            </div>
        </div>

        <div class="flex gap-1">
            <Button @click="previousChapter" :disabled="show.checkB" icon="pi pi-arrow-left" severity="danger" />
            <Dropdown v-model="selectedChapter" :options="dataChapter" optionLabel="chapter" optionValue="detailId" @change="pushView(selectedChapter)" class="w-64" />
            <Button @click="nextChapter" :disabled="show.checkN" icon="pi pi-arrow-right" severity="danger" />
            <Button @click="scrollToTop" icon="pi pi-arrow-up" severity="danger" />
        </div>

        <!-- Khu vực bình luận -->
        <div class="w-full max-w-6xl p-6 card mt-6">
            <div class="card flex flex-col gap-3" v-if="comments.length">
                <div v-for="item in comments" :key="item.commentID">
                    <Message severity="secondary" class="relative" :closable="false">
                        <div class="flex gap-4 items-center">
                            <img src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/anh-hai-3.jpg" class=":!h-12 !w-12 m-2 rounded-full" alt="" />
                            <span class="ml-2">{{ item.commentText }}</span>
                            <div class="absolute right-5">
                                <Rating v-model="item.ratting" readonly>
                                    <template #onicon>
                                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24" width="24" />
                                    </template>
                                    <template #officon>
                                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24" width="24" />
                                    </template>
                                </Rating>
                            </div>
                        </div>
                    </Message>
                </div>
            </div>

            <!-- Nhập bình luận -->
            <div class="mt-6 flex flex-col gap-6">
                <Rating v-model="payload.ratting">
                    <template #onicon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24" width="24" />
                    </template>
                    <template #officon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24" width="24" />
                    </template>
                </Rating>
                <div class="flex gap-6">
                    <InputText type="text" v-model="payload.comment" class="flex-1" placeholder="Nhập bình luận" />
                    <Button @click="saveComment" label="Gửi" severity="info" class="shrink-0" />
                </div>
            </div>
        </div>
    </div>
    <Toast />
</template>

<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const route = useRouter();
const pa = useRoute();
const comments = ref([]);
const dataChapter = ref([]);
const selectedChapter = ref();
const urlString = ref([]);
const dataContent = ref('');

const uri = ref('http://10.10.33.29:5041');
const vis = ref(false);

const show = ref({
    checkN: false,
    checkB: false
});

const payload = ref({
    id: pa.params.id,
    comment: '',
    ratting: 1
});

// Hàm lưu truyện vào localStorage (tự gọi API để lấy thông tin đầy đủ)
const saveStoryToLocalStorage = async (storyId) => {
    const maxItems = 20;
    const currentTime = new Date().toLocaleString();
    const visitedStories = JSON.parse(localStorage.getItem('visitedStories')) || [];

    const isExist = visitedStories.some((item) => item.id == storyId);
    if (!isExist) {
        try {
            const res = await axios.get(`${uri.value}/api/DetailStory/get-detailstory/${storyId}`);
            const data = res.data.data;

            const storyItem = {
                id: storyId,
                storyName: data?.sttName || 'Không rõ',
                image: urlString.value[0] || 'https://via.placeholder.com/100x150?text=No+Image',
                accessTime: currentTime
            };

            visitedStories.unshift(storyItem); // Thêm vào đầu danh sách

            if (visitedStories.length > maxItems) {
                visitedStories.pop(); // Xoá truyện cuối cùng
            }

            localStorage.setItem('visitedStories', JSON.stringify(visitedStories));
        } catch (error) {
            console.error('Lỗi khi lưu truyện vào localStorage:', error);
        }
    }
};

// Hiển thị thanh điều hướng trên cùng
const showTopBar = () => {
    vis.value = true;
};

// Cuộn lên đầu trang
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Ẩn thanh topBar khi cuộn
window.addEventListener('scroll', () => {
    vis.value = false;
});

// Lấy danh sách chương của truyện
const fetchChapters = async (storyID) => {
    try {
        const res = await axios.get(`${uri.value}/api/DetailStory/get-chapter/${storyID}`);
        dataChapter.value = res.data.data;
        selectedChapter.value = parseInt(pa.params.id);
        nextOrback(selectedChapter.value, 0);
    } catch (e) {
        console.error('Lỗi khi lấy danh sách chương:', e);
    }
};

// Lấy nội dung truyện và lưu vào lịch sử
const fetchStoryContent = async (id) => {
    try {
        const res = await axios.get(`${uri.value}/api/DetailStory/get-detailstory/${id}`);
        const storyData = res.data.data;

        if (storyData?.urlImg) {
            urlString.value = storyData.urlImg.trim().split(',');
        }

        dataContent.value = storyData?.content || '';
        fetchChapters(storyData.storyID);

        // Gọi hàm lưu vào lịch sử (hàm sẽ tự fetch thông tin chính xác)
        await saveStoryToLocalStorage(id);
    } catch (e) {
        console.error('Lỗi khi lấy nội dung truyện:', e);
    }
};

const fetchComments = async (id) => {
    if (!id) return;
    try {
        const res = await axios.get(`${uri.value}/api/Comment/get-all-comment?id=${id}`);
        comments.value = res.data.data ?? [];
    } catch (e) {
        console.error('Lỗi khi lấy bình luận:', e);
    }
};

const saveComment = async () => {
    payload.value.ratting < 1 ? (payload.value.ratting = 1) : '';
    payload.value.id = selectedChapter.value;
    if (!payload.value.comment.trim()) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không để chống ô comment', life: 2000 });
        return;
    }
    try {
        let res = await axios.post(`${uri.value}/api/Comment/insert-comment`, payload.value);
        if (res) {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đã thêm bình luận', life: 2000 });
        }
        fetchComments(pa.params.id);
        payload.value.comment = '';
        payload.value.ratting = 1;
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: e.Message, life: 2000 });
        console.error('Lỗi khi lưu bình luận:', e);
    }
};

const nextOrback = (id, kt = 0) => {
    let indx = dataChapter.value.findIndex((x) => x.detailId == id);
    if (indx === 0) {
        show.value.checkB = true;
    } else if (indx === dataChapter.value.length - 1) {
        show.value.checkN = true;
    } else {
        show.value.checkB = show.value.checkN = false;
    }

    if (kt === 0) {
        return;
    } else {
        if (kt === 1) {
            indx++;
            selectedChapter.value = dataChapter.value[indx].detailId;
            pushView(selectedChapter.value);
        } else if (kt === -1) {
            indx--;
            selectedChapter.value = dataChapter.value[indx].detailId;
            pushView(selectedChapter.value);
        }
    }
};

const previousChapter = () => {
    nextOrback(selectedChapter.value, -1);
};

const nextChapter = () => {
    nextOrback(selectedChapter.value, 1);
};

const pushView = (id) => {
    if (id) {
        route.push(`/view-story/${id}`);
    }
};

watch(
    () => pa.params.id,
    (newId) => {
        scrollToTop();
        fetchStoryContent(newId);
        fetchComments(newId);
    }
);

onMounted(() => {
    fetchStoryContent(pa.params.id);
    fetchComments(pa.params.id);
});
</script>