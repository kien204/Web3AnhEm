<template>
    <div class="w-full flex flex-col items-center gap-6">
        <!-- Hiển thị hình ảnh hoặc nội dung truyện -->
        <div class="w-full max-w-6xl p-6 bg-white shadow-2xl rounded-lg overflow-hidden">
            <div class="overflow-y-auto max-h-[85vh] p-4 border rounded-lg">
                <div v-if="urlString.length > 0">
                    <div v-for="img in urlString" :key="img" class="flex justify-center mb-4">
                        <img :src="img" alt="" class="w-full max-w-5xl rounded-lg shadow-lg border" />
                    </div>
                </div>
                <div v-else>
                    <div v-html="dataContent" class="max-h-[85vh] overflow-y-auto p-6 border rounded-lg"></div>
                </div>
            </div>
        </div>

        <!-- Khu vực bình luận -->
        <div class="w-full max-w-6xl p-6 border rounded-lg shadow-2xl bg-gray-100 mt-6">
            <h3 class="text-3xl font-bold text-gray-900 mb-6">💬 Bình luận</h3>
            <div v-for="(comment, index) in comments" :key="comment.id" class="comment-item p-4 bg-white rounded-lg shadow-md mb-4 border">
                <div class="flex items-start gap-4">
                    <img src="https://ui-avatars.com/api/?name=User" alt="Avatar" class="w-12 h-12 rounded-full shadow-md" />
                    <div class="flex-1">
                        <p v-if="editingIndex !== index" class="text-gray-800 font-medium text-lg">{{ comment.text }}</p>
                        <input v-else v-model="editText" class="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <div class="flex gap-4 mt-3">
                            <button v-if="editingIndex === index" @click="updateComment(comment.id)" class="text-green-500 hover:text-green-700">💾 Lưu</button>
                            <button v-if="editingIndex !== index" @click="editComment(index, comment.text)" class="text-blue-500 hover:text-blue-700">✏️ Sửa</button>
                            <button @click="deleteComment(comment.id)" class="text-red-500 hover:text-red-700">🗑️ Xóa</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nhập bình luận -->
            <div class="mt-6 flex items-center gap-6">
                <input v-model="newComment" placeholder="Nhập bình luận của bạn..." class="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-lg" />
                <button @click="saveComment" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all text-lg">Gửi</button>
            </div>
        </div>
    </div>

    <!-- Chuyển chương -->
    <div class="fixed top-20 right-[5%]">
        <Button icon="pi pi-ellipsis-v" severity="danger" @click="toggle" />
        <OverlayPanel ref="op">
            <div class="card flex gap-0 items-center">
                <div>
                    <Button icon="pi pi-arrow-left" text raised severity="danger" @click="previousChapter" />
                </div>
                <div>
                    <Dropdown v-model="chapters" optionValue="detailId" :options="dataChapter.data" optionLabel="chapter" class="w-full md:w-14rem" @change="pushView(chapters)" />
                </div>
                <div>
                    <Button icon="pi pi-arrow-right" text raised severity="danger" @click="nextChapter" />
                </div>
            </div>
        </OverlayPanel>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRouter();
const pa = useRoute();
const comments = ref([]);
const newComment = ref('');
const editingIndex = ref(null);
const editText = ref('');
const urlString = ref([]);
const dataContent = ref('');
const dataAll = ref({});
const dataChapter = ref({});
const chapters = ref(null);

const getAllDetail = async (id) => {
    if (!id) return;
    try {
        const res = await axios.get(`http://10.15.99.193:5041/api/DetailStory/get-detailstory/${id}`);
        dataAll.value = res.data;
        urlString.value = dataAll.value.data?.urlImg?.trim().split(',') || [];
        dataContent.value = dataAll.value.data?.content || '';
        fetchComments(id);
    } catch (e) {
        console.error('Lỗi khi lấy dữ liệu:', e);
    }
};

const fetchComments = async (id) => {
    if (!id) return;
    try {
        const res = await axios.get(`http://10.15.99.193:5041/api/comments/${id}`);
        comments.value = res.data;
    } catch (e) {
        console.error('Lỗi khi lấy bình luận:', e);
    }
};

const previousChapter = () => {
    const index = dataChapter.value.data.findIndex((chap) => chap.detailId === pa.params.id);
    if (index > 0) {
        route.push(`/story/${dataChapter.value.data[index - 1].detailId}`);
    }
};

const nextChapter = () => {
    const index = dataChapter.value.data.findIndex((chap) => chap.detailId === pa.params.id);
    if (index < dataChapter.value.data.length - 1) {
        route.push(`/story/${dataChapter.value.data[index + 1].detailId}`);
    }
};

const pushView = (chapterId) => {
    if (chapterId) {
        route.push(`/story/${chapterId}`);
    }
};

onMounted(() => {
    getAllDetail(pa.params.id);
});
</script>

<style>
.comment-item {
    transition: all 0.3s ease-in-out;
}

.comment-item:hover {
    background-color: #f1f5f9;
    transform: scale(1.02);
}
</style>
