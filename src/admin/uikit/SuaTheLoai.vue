<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const theLoaiList = ref([]);
const newTheLoai = ref({ ten: '' });
const editTheLoai = ref({ id: '', ten: '' });
const apiUrl = 'http://10.15.89.56:5041/api/Story'; // Địa chỉ API của bạn

const getTheLoai = async () => {
    try {
        const response = await axios.get(`${apiUrl}/getAll`);
        theLoaiList.value = response.data;
        console.log(theLoaiList.value);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const addTheLoai = async () => {
    try {
        await axios.post(apiUrl, newTheLoai.value);
        newTheLoai.value = { ten: '' };
        getTheLoai(); // Refresh the list
    } catch (error) {
        console.error('Error adding data:', error);
    }
};

const updateTheLoai = async () => {
    try {
        await axios.put(`${apiUrl}/${editTheLoai.value.id}`, editTheLoai.value);
        editTheLoai.value = { id: '', ten: '' };
        getTheLoai(); // Refresh the list
    } catch (error) {
        console.error('Error updating data:', error);
    }
};

onMounted(() => {
    getTheLoai();
});
</script>

<template>
    <div class="p-4 surface-card shadow-2 border-round mx-auto" style="width: 70%">
        <h2 class="text-2xl font-bold mb-4 text-center">Thêm Thể Loại</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên:</label>
            <input v-model="newTheLoai.ten" type="text" class="inputfield w-full" />
        </div>
        <div class="text-center">
            <button @click="addTheLoai" class="p-button p-component p-button-success">Thêm</button>
        </div>

        <h2 class="text-2xl font-bold mt-6 mb-4 text-center">Sửa Thể Loại</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">ID:</label>
            <input v-model="editTheLoai.id" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên:</label>
            <input v-model="editTheLoai.ten" type="text" class="inputfield w-full" />
        </div>
        <div class="text-center">
            <button @click="updateTheLoai" class="p-button p-component p-button-warning">Sửa</button>
        </div>

        <h2 class="text-2xl font-bold mt-6 mb-4 text-center">Danh Sách Thể Loại</h2>
        <ul class="list-none p-0 m-0">
            <li v-for="theLoai in theLoaiList" :key="theLoai.id" class="p-2 border-round surface-border surface-card mb-2">{{ theLoai.id }} - {{ theLoai.storyName }}</li>
        </ul>
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