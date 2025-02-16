<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const truyenList = ref([]);
const newTruyen = ref({ ten: '', theLoai: '', moTa: '', file: null });
const editTruyen = ref({ id: '', ten: '', theLoai: '', moTa: '', file: null });
const deleteTruyenId = ref('');
const toast = useToast();

const show = (check, statu, content) => {
    toast.add({ severity: check, summary: statu, detail: content, life: 3000 });
};

const addTruyen = () => {
    const newId = truyenList.value.length + 1;
    truyenList.value.push({ id: newId, ...newTruyen.value });
    newTruyen.value = { ten: '', theLoai: '', moTa: '', file: null };
    show('success', 'Thành công', 'Thêm truyện thành công');
};

const updateTruyen = () => {
    const index = truyenList.value.findIndex((truyen) => truyen.id === parseInt(editTruyen.value.id));
    if (index !== -1) {
        truyenList.value[index] = { ...editTruyen.value };
        editTruyen.value = { id: '', ten: '', theLoai: '', moTa: '', file: null };
        show('success', 'Thành công', 'SửaSửa truyện thành công');  
    }
};

const deleteTruyen = () => {
    if (confirm('Bạn có chắc chắn muốn xóa truyện này không?')) {
        truyenList.value = truyenList.value.filter((truyen) => truyen.id !== parseInt(deleteTruyenId.value));
        deleteTruyenId.value = '';
    }
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
        <div class="text-center">
            <button @click="addTruyen" class="p-button p-component p-button-success bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-800">Thêm</button>
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