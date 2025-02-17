<script setup>
import { ref } from 'vue';


const truyenList = ref([]);
const newTruyen = ref({ ten: '', theLoai: '', moTa: '', file: null });
const editTruyen = ref({ id: '', ten: '', theLoai: '', moTa: '', file: null });
const deleteTruyenId = ref('');

const addTruyen = () => {
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
</script>

<template>
    <div class="p-4 surface-card shadow-2 border-round mx-auto" style="width: 70%">
        <h2 class="text-2xl font-bold mb-4 text-center">Thêm Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên:</label>
            <InputText v-model="newTruyen.ten" class="w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Thể Loại:</label>
            <InputText v-model="newTruyen.theLoai" class="w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mô Tả:</label>
            <Textarea v-model="newTruyen.moTa" rows="4" class="w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">File:</label>
            <div class="dropzone">
                <FileUpload mode="basic" @select="handleFileChange($event, 'new')" class="w-full" />
            </div>
        </div>
        <div class="text-center">
            <Button @click="addTruyen" label="Thêm" class="p-button-success" />
        </div>

        <h2 class="text-2xl font-bold mt-20 mb-4 text-center">Sửa Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">ID:</label>
            <InputText v-model="editTruyen.id" class="w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Tên:</label>
            <InputText v-model="editTruyen.ten" class="w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Thể Loại:</label>
            <InputText v-model="editTruyen.theLoai" class="w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">Mô Tả:</label>
            <Textarea v-model="editTruyen.moTa" rows="4" class="w-full" />
        </div>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">File:</label>
            <div class="dropzone">
                <FileUpload mode="basic" @select="handleFileChange($event, 'edit')" class="w-full" />
            </div>
        </div>
        <div class="text-center">
            <Button @click="updateTruyen" label="Sửa" class="p-button-info" />
        </div>

        <h2 class="text-2xl font-bold mt-20 mb-4 text-center">Xóa Truyện</h2>
        <div class="field mb-4">
            <label class="block text-900 font-medium mb-2">ID:</label>
            <InputText v-model="deleteTruyenId" class="w-full" />
        </div>
        <div class="text-center">
            <Button @click="deleteTruyen" label="Xóa" class="p-button-danger" />
        </div>
    </div>
</template>

<style scoped>

</style>