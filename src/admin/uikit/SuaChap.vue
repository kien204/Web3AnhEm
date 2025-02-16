<script setup>
import { ref } from 'vue';

const truyenList = ref([]);
const newTruyen = ref({ ten: '', theLoai: '', moTa: '', file: null });
const editTruyen = ref({ id: '', ten: '', theLoai: '', moTa: '', file: null });
const deleteTruyenId = ref('');

const addTruyen = () => {
    const newId = truyenList.value.length + 1;
    truyenList.value.push({ id: newId, ...newTruyen.value });
    newTruyen.value = { ten: '', theLoai: '', moTa: '', file: null };
};

const updateTruyen = () => {
    const index = truyenList.value.findIndex((truyen) => truyen.id === parseInt(editTruyen.value.id));
    if (index !== -1) {
        truyenList.value[index] = { ...editTruyen.value };
        editTruyen.value = { id: '', ten: '', theLoai: '', moTa: '', file: null };
    }
};

const deleteTruyen = () => {
    truyenList.value = truyenList.value.filter((truyen) => truyen.id !== parseInt(deleteTruyenId.value));
    deleteTruyenId.value = '';
};

const handleFileChange = (event, truyen) => {
    const file = event.target.files[0];
    if (truyen === 'new') {
        newTruyen.value.file = file;
    } else if (truyen === 'edit') {
        editTruyen.value.file = file;
    }
};

const handleDrop = (event, truyen) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (truyen === 'new') {
        newTruyen.value.file = file;
        addTruyen();
    } else if (truyen === 'edit') {
        editTruyen.value.file = file;
        updateTruyen();
    }
};

const handleDragOver = (event) => {
    event.preventDefault();
};
</script>

<template>
    <div class="p-4 surface-card shadow-2 border-round mx-auto" style="width: 70%">
        <h2 class="text-2xl font-bold mb-4 text-center">Thêm Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên:</label>
            <input v-model="newTruyen.ten" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Thể Loại:</label>
            <input v-model="newTruyen.theLoai" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mô Tả:</label>
            <textarea v-model="newTruyen.moTa" rows="4" class="inputfield w-full"></textarea>
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">File:</label>
            <div class="dropzone" @drop="handleDrop($event, 'new')" @dragover="handleDragOver">
                <input type="file" @change="handleFileChange($event, 'new')" class="inputfield w-full" />
                <p>Kéo và thả file vào đây hoặc nhấp để chọn file</p>
                <p v-if="newTruyen.file">{{ newTruyen.file.name }}</p>
            </div>
        </div>
        <div class="text-center">
            <button @click="addTruyen" class="p-button p-component p-button-success">Thêm</button>
        </div>

        <h2 class="text-2xl font-bold mt-20 mb-4 text-center">Sửa Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">ID:</label>
            <input v-model="editTruyen.id" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên:</label>
            <input v-model="editTruyen.ten" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Thể Loại:</label>
            <input v-model="editTruyen.theLoai" type="text" class="inputfield w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mô Tả:</label>
            <textarea v-model="editTruyen.moTa" rows="4" class="inputfield w-full"></textarea>
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">File:</label>
            <div class="dropzone" @drop="handleDrop($event, 'edit')" @dragover="handleDragOver">
                <input type="file" @change="handleFileChange($event, 'edit')" class="inputfield w-full" />
                <p>Kéo và thả file vào đây hoặc nhấp để chọn file</p>
                <p v-if="editTruyen.file">{{ editTruyen.file.name }}</p>
            </div>
        </div>
        <div class="text-center">
            <button @click="updateTruyen" class="p-button p-component p-button-warning">Sửa</button>
        </div>

        <h2 class="text-2xl font-bold mt-20 mb-4 text-center">Xóa Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">ID:</label>
            <input v-model="deleteTruyenId" type="text" class="inputfield w-full" />
        </div>
        <div class="text-center">
            <button @click="deleteTruyen" class="p-button p-component p-button-danger">Xóa</button>
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

.dropzone {
    border: 2px dashed #ccc;
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s;
}

.dropzone:hover {
    border-color: #007bff;
}

.dropzone p {
    margin: 0;
    color: #666;
}
</style>