<template>
    <div class="w-full flex flex-col items-center gap-6">
        <!-- Chuyển chương -->
        <div class="fixed top-4 right-[5%] z-50 flex items-center gap-2">
            <button @click="previousChapter" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">⬅️ Trước</button>
            <select v-model="selectedChapter" @change="pushView(selectedChapter)" class="p-2 border rounded-lg">
                <option v-for="chapter in dataChapter" :key="chapter.detailId" :value="chapter.detailId">{{ chapter.chapter }}</option>
            </select>
            <button @click="nextChapter" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">➡️ Sau</button>
        </div>

        <!-- Hiển thị nội dung truyện -->
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
const dataChapter = ref([]);
const selectedChapter = ref(null);
const urlString = ref([]);
const dataContent = ref('');
const uri = ref('http://10.15.7.14');
const fetchComments = async (id) => {
    if (!id) return;
    try {
        const res = await axios.get(`${uri.value}:5041/api/comments/${id}`);
        comments.value = res.data;
    } catch (e) {
        console.error('Lỗi khi lấy bình luận:', e);
    }
};

const fetchChapters = async (storyID) => {
    try {
        const res = await axios.get(`${uri.value}:5041/api/DetailStory/get-chapter/${storyID}`);
        dataChapter.value = res.data.data;
        selectedChapter.value = pa.params.id;
    } catch (e) {
        console.error('Lỗi khi lấy danh sách chương:', e);
    }
};

const fetchStoryContent = async (id) => {
    try {
        const res = await axios.get(`${uri.value}:5041/api/DetailStory/get-detailstory/${id}`);
        if (res.data.data?.urlImg) {
            urlString.value = res.data.data.urlImg.trim().split(',');
        }
        dataContent.value = res.data.data?.content || '';
    } catch (e) {
        console.error('Lỗi khi lấy nội dung truyện:', e);
    }
};

const saveComment = async () => {
    if (!newComment.value.trim()) return;
    try {
        await axios.post(`${uri.value}:5041/api/comments`, {
            storyId: pa.params.id,
            text: newComment.value
        });
        newComment.value = '';
        fetchComments(pa.params.id);
    } catch (e) {
        console.error('Lỗi khi lưu bình luận:', e);
    }
};

const previousChapter = () => {
    const currentIndex = dataChapter.value.findIndex((chap) => chap.detailId === pa.params.id);
    if (currentIndex > 0) {
        pushView(dataChapter.value[currentIndex - 1].detailId);
    }
};

const nextChapter = () => {
    const currentIndex = dataChapter.value.findIndex((chap) => chap.detailId === pa.params.id);
    if (currentIndex < dataChapter.value.length - 1) {
        pushView(dataChapter.value[currentIndex + 1].detailId);
    }
};

const pushView = (id) => {
    if (id) {
        route.push(`/story/${id}`);
    }
};

onMounted(() => {
    fetchComments(pa.params.id);
    fetchChapters(pa.params.id);
    fetchStoryContent(pa.params.id);
});
</script>
