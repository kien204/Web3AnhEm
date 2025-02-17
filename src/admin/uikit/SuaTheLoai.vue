<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();
const show = (check, statu, content) => {
    toast.add({ severity: check, summary: statu, detail: content, life: 3000 });
};
const visible = ref(false);
const theloai = ref(['hentai', 'bienthai', 'ngontinh', 'khoa hoc vien tuong', 'xuyen khong', 'truyen ma', 'truyen cuoi', 'truyen dam my', 'truyen ngan', 'truyen tinh cam', 'truyen tinh yeu']);
const newTruyen = ref({
    storyName: '',
    storyCode: '',
    storyAuthor: '',
    coverImage: '',
    description: '',
    typeStory: '',
    typeDetailStory: ''
});
const errors = ref({
    storyName: false,
    storyCode: false,
    storyAuthor: false,
    coverImage: false,
    description: false,
    typeStory: false,
    typeDetailStory: false
});

const validateForm = () => {
    errors.value.storyName = !newTruyen.value.storyName;
    errors.value.storyCode = !newTruyen.value.storyCode;
    errors.value.storyAuthor = !newTruyen.value.storyAuthor;
    errors.value.coverImage = !newTruyen.value.coverImage;
    errors.value.description = !newTruyen.value.description;
    errors.value.typeStory = !newTruyen.value.typeStory;
    errors.value.typeDetailStory = newTruyen.value.typeDetailStory.length === 0;

    return !Object.values(errors.value).includes(true);
};

const resetForm = () => {
    newTruyen.value = {
        storyName: '',
        storyCode: '',
        storyAuthor: '',
        coverImage: '',
        description: '',
        typeStory: '',
        typeDetailStory: ''
    };
    Object.keys(errors.value).forEach((key) => {
        errors.value[key] = false;
    });
};

const addTruyen = async () => {
    if (validateForm()) {
        try {
            // await axios.post(apiUrl, newTruyen.value);
            console.log('Data added:', newTruyen.value);
            resetForm();
            visible.value = false;
            show('success', 'Thành công', 'Thêm truyện thành công');
        } catch (error) {
            show('error', 'Lỗi', 'Có lỗi xảy ra khi thêm truyện');
            console.error('Error adding data:', error);
        }
    } else {
        show('error', 'Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    }
};
</script>

<template>
    <div class="card flex justify-content-center" >
        <Button label="Thêm Thể Loại" icon="pi pi-plus" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Thêm Thể Loại" :style="{ width: '45%' }" @hide="resetForm">
            <div class="p-fluid">
                <div class="field" :class="{ 'p-invalid': errors.storyName }">
                    <label for="storyName" class="text-lg">Tên Truyện</label>
                    <InputText id="storyName" v-model="newTruyen.storyName" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.storyCode }">
                    <label for="storyCode" class="text-lg">Mã Truyện</label>
                    <InputText id="storyCode" v-model="newTruyen.storyCode" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.storyAuthor }">
                    <label for="storyAuthor" class="text-lg">Tác Giả</label>
                    <InputText id="storyAuthor" v-model="newTruyen.storyAuthor" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.coverImage }">
                    <label for="coverImage" class="text-lg">Ảnh Bìa</label>
                    <InputText id="coverImage" v-model="newTruyen.coverImage" class="w-full" />
                </div>
                <div class="field" >
                    <label for="description" class="text-lg">Mô Tả</label>
                    <Textarea id="description" v-model="newTruyen.description" rows="3" class="w-full" :class="{ 'p-invalid': errors.description }"/>
                </div>
                <div class="field">
                    <label for="typeStory" class="text-lg">Thể Loại</label>
                    <div class="flex align-items-center mb-2">
                        <RadioButton :class="{ 'p-invalid': errors.typeStory }" inputId="typeStoryTT" name="typeStory" value="TT" v-model="newTruyen.typeStory" />
                        <label for="typeStoryTT" class="ml-2 mr-6">TT</label>
                        <RadioButton :class="{ 'p-invalid': errors.typeStory }" inputId="typeStoryTC" name="typeStory" value="TC" v-model="newTruyen.typeStory" />
                        <label for="typeStoryTC" class="ml-2">TC</label>
                    </div>
                </div>
                <div class="field">
                    <label for="typeDetailStory" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in theloai" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStory }" v-model="newTruyen.typeDetailStory" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Hủy"icon="pi pi-times" class="p-button-secondary" @click="() => {resetForm();visible = false;}"/>
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="addTruyen" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.p-invalid .p-inputtext,
.p-invalid .p-inputtextarea,
.p-invalid .p-dropdown,
.p-invalid .p-checkbox {
    border-color: red;
}
</style>
