<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const truyenList = ref([]);
const newTruyen = ref({
    storyName: '',
    storyCode: '',
    storyAuthor: '',
    coverImage: '',
    description: '',
    typeStory: '',
    typeDetailStory: ''
});
const editTruyen = ref({
    id: '',
    storyName: '',
    storyCode: '',
    storyAuthor: '',
    coverImage: '',
    description: '',
    typeStory: '',
    typeDetailStory: ''
});
const deleteTruyenId = ref('');
const toast = useToast();
const apiUrl = 'http://10.15.169.9:5041/api/Story';
// const apiUrl = 'http://10.15.166.140:8081/api/products';

const show = (check, statu, content) => {
    toast.add({ severity: check, summary: statu, detail: content, life: 3000 });
};

const addTruyen = async () => {
    try {
        let token = JSON.parse(localStorage.getItem('token'));
        try {
            const res = await axios.post(`${apiUrl}/inserts`, datas.value, {
                headers: {
                    Authorization: `Bearer ${token}` // Đính kèm token
                }
            });
            console.log(res.data);
            newTruyen.value = {
                storyName: '',
                storyCode: '',
                storyAuthor: '',
                coverImage: '',
                description: '',
                typeStory: '',
                typeDetailStory: ''
            };
        } catch (e) {
            console.log(e);
        }
        show('success', 'Thành công', 'Thêm truyện thành công');
    } catch (error) {
        show('error', 'Lỗi', 'Có lỗi xảy ra khi thêm truyện');
        console.error('Error adding data:', error);
    }
};

const updateTruyen = async () => {
    try {
        await axios.put(`${apiUrl}/${editTruyen.value.id}`, editTruyen.value);
        editTruyen.value = {
            id: '',
            storyName: '',
            storyCode: '',
            storyAuthor: '',
            coverImage: '',
            description: '',
            typeStory: '',
            typeDetailStory: ''
        };
        show('success', 'Thành công', 'Sửa truyện thành công');
    } catch (error) {
        show('error', 'Lỗi', 'Có lỗi xảy ra khi sửa truyện');
        console.error('Error updating data:', error);
    }
};

const deleteTruyen = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa truyện này không?')) {
        try {
            await axios.delete(`${apiUrl}/delete-story/${deleteTruyenId.value}`);
            truyenList.value = truyenList.value.filter((truyen) => truyen.id !== parseInt(deleteTruyenId.value));
            deleteTruyenId.value = '';
            show('success', 'Thành công', 'Xóa truyện thành công');
        } catch (error) {
            show('error', 'Lỗi', 'Có lỗi xảy ra khi xóa truyện');
            console.error('Error deleting data:', error);
        }
    }
};
</script>

<template>
    <div class="p-4 surface-card shadow-2 border-round mx-auto" style="width: 70%">
        <h2 class="text-2xl font-bold mb-4 text-center">Thêm Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên Truyện:</label>
            <input v-model="newTruyen.storyName" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mã Truyện:</label>
            <input v-model="newTruyen.storyCode" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tác Giả:</label>
            <input v-model="newTruyen.storyAuthor" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Ảnh Bìa:</label>
            <input v-model="newTruyen.coverImage" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mô Tả:</label>
            <textarea v-model="newTruyen.description" rows="4" class="inputfield w-full"></textarea>
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Thể Loại:</label>
            <input v-model="newTruyen.typeStory" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Chi Tiết Thể Loại:</label>
            <input v-model="newTruyen.typeDetailStory" type="text" class="inputfield w-full" />
        </div>
        <div class="text-center">
            <button @click="addTruyen" class="p-button p-component p-button-success bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-800">Thêm</button>
        </div>

        <h2 class="text-2xl font-bold mt-20 mb-4 text-center">Sửa Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">ID:</label>
            <input v-model="editTruyen.id" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên Truyện:</label>
            <input v-model="editTruyen.storyName" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mã Truyện:</label>
            <input v-model="editTruyen.storyCode" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tác Giả:</label>
            <input v-model="editTruyen.storyAuthor" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Ảnh Bìa:</label>
            <input v-model="editTruyen.coverImage" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mô Tả:</label>
            <textarea v-model="editTruyen.description" rows="4" class="inputfield w-full"></textarea>
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Thể Loại:</label>
            <input v-model="editTruyen.typeStory" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Chi Tiết Thể Loại:</label>
            <input v-model="editTruyen.typeDetailStory" type="text" class="inputfield w-full" />
        </div>
        <div class="text-center">
            <button @click="updateTruyen" class="p-button p-component p-button-success bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-900">Sửa</button>
        </div>

        <h2 class="text-2xl font-bold mt-20 mb-4 text-center">Xóa Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">ID:</label>
            <input v-model="deleteTruyenId" type="text" class="inputfield w-full" />
        </div>
        <div class="text-center">
            <button @click="deleteTruyen" class="p-button p-component p-button-danger bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-800">Xóa</button>
        </div>
    </div>
</template>

<style scoped>
.inputfield {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;
}

.inputfield:focus {
    border-color: #007bff;
    outline: none;
}
</style>