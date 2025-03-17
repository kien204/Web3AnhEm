<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const token = JSON.parse(localStorage.getItem('token'));
const url = 'http://10.15.99.193:5041/api';

// Reactive variables
const expandedRows = ref([]);
const chapterterData = ref([]);
const storyList = ref([]);
const typeDetail = ref([]);

// Form fields
const storyNameForm = ref('');
const storyCodeForm = ref('');
const storyAuthorForm = ref('');
const coverImageForm = ref('');
const descriptionForm = ref('');
const typeStoryForm = ref('');
const typeDetailStoryForm = ref([]);
const fileForm = ref('');
const sttNameForm = ref('');

// Dialog states
const dialogAddStory = ref(false);
const dialogEditStory = ref(false);
const dialogDeleteStory = ref(false);
const dialogaddChapter = ref(false);
const dialogEditChapter = ref(false);
const dialogdeleteChapter = ref(false);

// Cloud storage for editing/deleting
const cloudDeleteStory = ref({});
const cloudEditStory = ref({});
const clouddeleteChapter = ref({});
const cloudeditChapter = ref({});
const cloudCodeStory = ref('');

// Form errors
const errors = ref({
    storyNameForm: false,
    storyCodeForm: false,
    storyAuthorForm: false,
    coverImageForm: false,
    descriptionForm: false,
    typeStoryForm: false,
    typeDetailStoryForm: false,
    fileForm: false,
    sttNameForm: false
});

// Filters
const filtersStory = ref({
    global: { value: null, matchMode: 'contains' },
    storyName: { value: null, matchMode: 'startsWith' },
    storyCode: { value: null, matchMode: 'equals' }
});
const filterschapterter = ref({
    global: { value: null, matchMode: 'contains' },
    chapterterName: { value: null, matchMode: 'startsWith' },
    chapterterCode: { value: null, matchMode: 'equals' }
});

onMounted(() => getAllStory());

// API Calls
const getAllStory = async () => {
    try {
        const [stories, chapters, types] = await Promise.all([axios.get(`${url}/Story/getAll`), axios.get(`${url}/DetailStory/get-all-detailstory`), axios.get(`${url}/Story/get-type`)]);
        storyList.value = stories.data.data;
        chapterterData.value = chapters.data.data;
        typeDetail.value = types.data.data;
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy dữ liệu', life: 3000 });
    }
};

// Form Validation
const validateStoryForm = () => {
    errors.value = {
        storyNameForm: !storyNameForm.value,
        storyCodeForm: !storyCodeForm.value,
        storyAuthorForm: !storyAuthorForm.value,
        coverImageForm: !coverImageForm.value,
        descriptionForm: !descriptionForm.value,
        typeStoryForm: !typeStoryForm.value,
        typeDetailStoryForm: typeDetailStoryForm.value.length + AddTypeDetailStoryForm.value.length === 0
    };
    return !Object.values(errors.value).some(Boolean);
};

const validateEditStoryForm = () => {
    errors.value = {
        storyNameForm: !storyNameForm.value,
        storyAuthorForm: !storyAuthorForm.value,
        coverImageForm: !coverImageForm.value,
        descriptionForm: !descriptionForm.value,
        typeDetailStoryForm: typeDetailStoryForm.value.length === 0
    };
    return !Object.values(errors.value).some(Boolean);
};

const validateChapterForm = () => {
    errors.value = { fileForm: !fileForm.value, sttNameForm: !sttNameForm.value };
    return !Object.values(errors.value).some(Boolean);
};

// Reset Forms
const resetStoryForm = () => {
    storyNameForm.value = '';
    storyCodeForm.value = '';
    storyAuthorForm.value = '';
    coverImageForm.value = '';
    descriptionForm.value = '';
    typeStoryForm.value = '';
    typeDetailStoryForm.value = [];
    errors.value = Object.fromEntries(Object.keys(errors.value).map((key) => [key, false]));
};

const resetChapterForm = () => {
    fileForm.value = '';
    sttNameForm.value = '';
    errors.value = Object.fromEntries(Object.keys(errors.value).map((key) => [key, false]));
};

// Story CRUD
const addStory = async () => {
    if (!validateStoryForm()) return showError('Vui lòng nhập đầy đủ thông tin');
    if (storyList.value.some((story) => story.storyCode === storyCodeForm.value)) {
        return showError('Mã truyện đã tồn tại');
    }
    try {
        const newStory = {
            storyName: storyNameForm.value,
            storyCode: storyCodeForm.value,
            autho: storyAuthorForm.value,
            imgCover: coverImageForm.value,
            description: descriptionForm.value,
            typeStory: typeStoryForm.value,
            typeDetailStory: typeDetailStoryForm.value.join(',') + ',' + AddTypeDetailStoryForm.value
        };
        await axios.post(`${url}/Story/inserts`, newStory, { headers: { Authorization: `Bearer ${token}` } });
        await getAllStory();
        resetStoryForm();
        dialogAddStory.value = false;
        showSuccess('Thêm truyện thành công');
    } catch (e) {
        console.error('Lỗi thêm truyện:', e);
        showError('Không thể thêm truyện');
    }
};

const editStoryData = (story) => {
    cloudEditStory.value = story;
    dialogEditStory.value = true;
    storyNameForm.value = cloudEditStory.value.storyName;
    storyAuthorForm.value = cloudEditStory.value.storyAuthor;
    coverImageForm.value = cloudEditStory.value.coverImage;
    descriptionForm.value = cloudEditStory.value.description;
    typeDetailStoryForm.value = cloudEditStory.value.typeDetailStory.split(',').map((item) => item.trim()) || [];
};

const editStory = async () => {
    if (!validateEditStoryForm()) return showError('Vui lòng nhập đầy đủ thông tin');
    try {
        const updatedStory = {
            id: cloudEditStory.value.id,
            storyName: storyNameForm.value,
            coverImage: coverImageForm.value,
            description: descriptionForm.value,
            storyAuthor: storyAuthorForm.value,
            typeDetailStory: typeDetailStoryForm.value.join(',') + ',' + AddTypeDetailStoryForm.value
        };
        await axios.put(`${url}/Story/update-story`, updatedStory, { headers: { Authorization: `Bearer ${token}` } });
        resetStoryForm();
        dialogEditStory.value = false;
        showSuccess('Sửa truyện thành công');
    } catch (e) {
        console.error('Lỗi sửa truyện:', e);
        showError('Không thể sửa truyện');
    }
};

const deleteStoryData = (story) => {
    cloudDeleteStory.value = story;
    dialogDeleteStory.value = true;
};

const deleteStory = async () => {
    try {
        await axios.delete(`${url}/Story/delete-story/${cloudDeleteStory.value.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        storyList.value = storyList.value.filter((story) => story.id !== cloudDeleteStory.value.id);
        dialogDeleteStory.value = false;
        showSuccess(`Truyện ${cloudDeleteStory.value.storyName} đã được xóa`);
        cloudDeleteStory.value = {};
        await getAllStory();
    } catch (e) {
        console.error('Lỗi xóa truyện:', e);
        showError(`Không thể xóa truyện ${cloudDeleteStory.value.storyName}`);
    }
};

// Chapter CRUD
const addChapter = async () => {
    if (!validateChapterForm()) return showError('Vui lòng nhập đầy đủ thông tin');
    try {
        const formData = new FormData();
        formData.append('file', fileForm.value);
        await axios.post(`${url}/DetailStory/upload/${cloudCodeStory.value}/${sttNameForm.value}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        resetChapterForm();
        dialogaddChapter.value = false;
        await getAllStory();
        showSuccess('Thêm chương thành công');
    } catch (e) {
        console.error('Lỗi thêm chương:', e);
        showError('Không thể thêm chương');
    }
};

const editChapterData = (chapter) => {
    cloudeditChapter.value = chapter;
    dialogEditChapter.value = true;
    fileForm.value = chapter.file;
    sttNameForm.value = chapter.sttName;
};

const editChapter = async () => {
    if (!validateChapterForm()) return showError('Vui lòng nhập đầy đủ thông tin');
    try {
        const formData = new FormData();
        formData.append('file', fileForm.value);
        await axios.post(`${url}/DetailStory/upload/${cloudeditChapter.value.id}/${sttNameForm.value}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        resetChapterForm();
        dialogEditChapter.value = false;
        await getAllStory();
        showSuccess('Sửa chương thành công');
    } catch (e) {
        console.error('Lỗi sửa chương:', e);
        showError('Không thể sửa chương');
    }
};

const deleteChapterData = (chapter) => {
    clouddeleteChapter.value = chapter;
    dialogdeleteChapter.value = true;
};

const deleteChapter = async () => {
    try {
        await axios.delete(`${url}/DetailStory/delete-detailstory/${clouddeleteChapter.value.detailID}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        chapterterData.value = chapterterData.value.filter((chapter) => chapter.detailID !== clouddeleteChapter.value.detailID);
        dialogdeleteChapter.value = false;
        showSuccess(`Chương ${clouddeleteChapter.value.sttName} đã được xóa`);
        clouddeleteChapter.value = {};
    } catch (e) {
        console.error('Lỗi xóa chương:', e);
        showError(`Không thể xóa chương ${clouddeleteChapter.value.sttName}`);
    }
};

const openFile = (file) => {
    console.log(file);
    
    try {
        window.open(file, '_blank');
    } catch (error) {
        console.log('Loi khi mo file: ', error);
        showError('Lỗi khi mở file!');
    }
};

// Utilities
const showSuccess = (detail) => toast.add({ severity: 'success', summary: 'Thành công', detail, life: 3000 });
const showError = (detail) => toast.add({ severity: 'error', summary: 'Lỗi', detail, life: 3000 });

const onFileSelect = (event) => (fileForm.value = event.files[0]);
const getchaptertersForStory = (id) => chapterterData.value.filter((chapter) => chapter.storyID === id);
const checkTypeStory = (id) => storyList.value.find((story) => story.id === id)?.typeStory !== 'TT';
const codeChapterData = (id) => {
    cloudCodeStory.value = id;
    dialogaddChapter.value = true;
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Thêm truyện mới" icon="pi pi-plus" severity="success" class="mr-2" @click="dialogAddStory = true" />
                    <Button icon="pi pi-refresh" v-tooltip.top="'Làm mới'" rounded raised @click="getAllStory" />
                </template>
            </Toolbar>

            <DataTable
                :value="storyList"
                dataKey="storyCode"
                :paginator="true"
                :globalFilterFields="['storyName', 'storyCode']"
                :filters="filtersStory"
                :rows="10"
                v-model:expandedRows="expandedRows"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Hiển thị từ {first} đến {last} trong {totalRecords} câu truyện"
            >
                <template #header>
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filtersStory.global.value" placeholder="Nhập mã hoặc tên truyện" />
                    </IconField>
                </template>
                <Column expander style="width: 2rem" />
                <Column field="storyCode" header="Mã Truyện" />
                <Column field="storyName" header="Tên Truyện" />
                <Column field="storyAuthor" header="Tác Giả" />
                <Column header="Ảnh Bìa">
                    <template #body="slotProps">
                        <Image :src="slotProps.data.coverImage" :alt="slotProps.data.storyName" class="border-round" width="120" preview />
                    </template>
                </Column>
                <Column field="typeStory" header="Thể Loại" />
                <Column field="typeDetailStory" header="Chi Tiết Thể Loại" />
                <Column :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" v-tooltip.top="'Sửa truyện'" outlined rounded class="mr-2" @click="editStoryData(slotProps.data)" />
                        <Button icon="pi pi-trash" v-tooltip.top="'Xóa truyện'" outlined rounded severity="danger" @click="deleteStoryData(slotProps.data)" />
                    </template>
                </Column>

                <!-- template hiển thị các chương khi expandable -->
                <template #expansion="slotProps">
                    <div class="p-3">
                        <h5>Danh sách chương - {{ slotProps.data.storyName }}</h5>
                        <DataTable :value="getchaptertersForStory(slotProps.data.id)" responsiveLayout="scroll" :globalFilterFields="['sttName', 'detailID']" :filters="filterschapterter">
                            <template #header>
                                <IconField iconPosition="left">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filterschapterter.global.value" placeholder="Nhập mã hoặc tên chương" />
                                    <Button label="Thêm chương mới" icon="pi pi-plus" severity="success" class="ml-2" @click="codeChapterData(slotProps.data.id)" />
                                </IconField>
                            </template>
                            <Column field="detailID" header="Mã Chương" />
                            <Column field="sttName" header="Tên Chương" />

                            <Column :exportable="false" style="min-width: 8rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-eye" v-tooltip.top="'Xem trước'" outlined rounded class="mr-2" @click="openFile(slotProps.data.urlImg)" />
                                    <Button icon="pi pi-pencil" v-tooltip.top="'Sửa chương'" outlined rounded class="mr-2" @click="editChapterData(slotProps.data)" />
                                    <Button icon="pi pi-trash" v-tooltip.top="'Xóa chương'" outlined rounded severity="danger" @click="deleteChapterData(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </template>
            </DataTable>
        </div>

        <!-- dialog thêm truyện mới -->
        <Dialog v-model:visible="dialogAddStory" modal header="Thêm Truyện" :style="{ width: '45%' }" @hide="resetStoryForm">
            <div class="p-fluid">
                <div class="field">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" :class="{ 'p-invalid': errors.storyNameForm }" />
                </div>
                <div class="field">
                    <label for="storyCodeForm" class="text-lg">Mã Truyện</label>
                    <InputText id="storyCodeForm" v-model="storyCodeForm" class="w-full" :class="{ 'p-invalid': errors.storyCodeForm }" />
                </div>
                <div class="field">
                    <label for="storyAuthorForm" class="text-lg">Tác Giả</label>
                    <InputText id="storyAuthorForm" v-model="storyAuthorForm" class="w-full" :class="{ 'p-invalid': errors.storyAuthorForm }" />
                </div>
                <div class="field">
                    <label for="coverImage" class="text-lg">Ảnh Bìa</label>
                    <InputText id="coverImageForm" v-model="coverImageForm" class="w-full" :class="{ 'p-invalid': errors.coverImageForm }" />
                </div>
                <div class="field">
                    <label for="descriptionForm" class="text-lg">Mô Tả</label>
                    <Textarea id="descriptionForm" v-model="descriptionForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.descriptionForm }" />
                </div>
                <div class="field">
                    <label for="typeStoryForm" class="text-lg">Thể Loại</label>
                    <div class="flex align-items-center mb-2">
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTT" name="typeStory" value="TT" v-model="typeStoryForm" />
                        <label for="typeStoryTT" class="ml-2 mr-6">TT</label>
                        <RadioButton :class="{ 'p-invalid': errors.typeStoryForm }" inputId="typeStoryTC" name="typeStory" value="TC" v-model="typeStoryForm" />
                        <label for="typeStoryTC" class="ml-2">TC</label>
                    </div>
                </div>
                <div class="field">
                    <label for="typeDetail" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in typeDetail" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStoryForm }" v-model="typeDetailStoryForm" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                    <div class="field">
                        <label for="AddTypeDetailStoryForm" class="text-lg">Thêm Chi Tiết Thể Loại Mới</label>
                        <InputText id="AddTypeDetailStoryForm" class="w-full mb-5" />
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetStoryForm();
                                dialogAddStory = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="addStory" />
                </div>
            </div>
        </Dialog>

        <!-- dialog chỉnh sửa truyện -->
        <Dialog v-model:visible="dialogEditStory" modal header="Chỉnh sửa Truyện" :style="{ width: '45%' }" @hide="resetStoryForm">
            <div class="p-fluid">
                <div class="field" :class="{ 'p-invalid': errors.storyNameForm }">
                    <label for="storyNameForm" class="text-lg">Tên Truyện</label>
                    <InputText id="storyNameForm" v-model="storyNameForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.storyAuthorForm }">
                    <label for="storyAuthorForm" class="text-lg">Tác Giả</label>
                    <InputText id="storyAuthorForm" v-model="storyAuthorForm" class="w-full" />
                </div>
                <div class="field" :class="{ 'p-invalid': errors.coverImageForm }">
                    <label for="coverImageForm" class="text-lg">Ảnh Bìa</label>
                    <InputText id="coverImageForm" v-model="coverImageForm" class="w-full" />
                </div>
                <div class="field">
                    <label for="descriptionForm" class="text-lg">Mô Tả</label>
                    <Textarea id="descriptionForm" v-model="descriptionForm" rows="3" class="w-full" :class="{ 'p-invalid': errors.descriptionForm }" />
                </div>

                <div class="field">
                    <label for="typeDetail" class="text-lg">Chi Tiết Thể Loại</label>
                    <div class="flex flex-wrap">
                        <div v-for="item in typeDetail" :key="item" class="flex align-items-center mb-2 mr-4">
                            <Checkbox :class="{ 'p-invalid': errors.typeDetailStoryForm }" v-model="typeDetailStoryForm" :value="item" />
                            <label class="ml-2">{{ item }}</label>
                        </div>
                    </div>
                    <div class="field">
                        <label for="AddTypeDetailStoryForm" class="text-lg">Thêm Chi Tiết Thể Loại Mới</label>
                        <InputText id="AddTypeDetailStoryForm" class="w-full mb-5" />
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetStoryForm();
                                dialogEditStory = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="editStory" />
                </div>
            </div>
        </Dialog>

        <!-- dialog xác nhận xóa truyện -->
        <Dialog v-model:visible="dialogDeleteStory" :style="{ width: '450px' }" header="Xóa truyện" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="cloudDeleteStory"
                    >Bạn chắc chắn muốn xóa truyện <b>{{ cloudDeleteStory.storyName }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="dialogDeleteStory = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteStory" />
            </template>
        </Dialog>

        <!-- dialog thêm chương mới -->
        <Dialog v-model:visible="dialogaddChapter" modal header="Thêm chương" :style="{ width: '45%' }" @hide="resetChapterForm">
            <div class="p-fluid">
                <div class="field">
                    <label for="sttNameForm" class="text-lg">Chương</label>
                    <InputText id="sttNameForm" v-model="sttNameForm" class="w-full" :class="{ 'p-invalid': errors.sttNameForm }" />
                </div>

                <div class="mb-7 mt-7">
                    <FileUpload
                        id="fileForm"
                        name="tải file"
                        mode="basic"
                        :accept="checkTypeStory(cloudeditChapter.id) ? 'text/plain' : 'application/pdf'"
                        :chooseLabel="checkTypeStory(cloudeditChapter.id) ? 'Chọn tệp TXT' : 'Chọn tệp PDF'"
                        :maxFileSize="10000000"
                        @select="onFileSelect"
                        class="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetChapterForm();
                                dialogaddChapter = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="addChapter" />
                </div>
            </div>
        </Dialog>

        <!-- dialog chỉnh sửa chương -->
        <Dialog v-model:visible="dialogEditChapter" modal header="Chỉnh sửa Truyện" :style="{ width: '45%' }" @hide="resetChapterForm">
            <div class="p-fluid">
                <div class="field">
                    <label for="sttNameForm" class="text-lg">Chương</label>
                    <InputText id="sttNameForm" v-model="sttNameForm" class="w-full" :class="{ 'p-invalid': errors.sttNameForm }" />
                </div>

                <div class="mb-7 mt-7">
                    <FileUpload
                        id="fileForm"
                        name="tải file"
                        mode="basic"
                        :accept="checkTypeStory(cloudeditChapter.id) ? 'text/plain' : 'application/pdf'"
                        :chooseLabel="checkTypeStory(cloudeditChapter.id) ? 'Chọn tệp TXT' : 'Chọn tệp PDF'"
                        :maxFileSize="10000000"
                        @select="onFileSelect"
                        class="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="
                            () => {
                                resetChapterForm();
                                dialogaddChapter = false;
                            }
                        "
                    />
                    <Button type="button" label="Lưu" icon="pi pi-check" class="p-button-success" @click="editChapter" />
                </div>
            </div>
        </Dialog>

        <!-- dialog xác nhận xóa chương -->
        <Dialog v-model:visible="dialogdeleteChapter" :style="{ width: '450px' }" header="Xóa chương" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="clouddeleteChapter"
                    >Bạn chắc chắn muốn xóa chương <b>{{ clouddeleteChapter.sttName }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="dialogdeleteChapter = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteChapter" />
            </template>
        </Dialog>
    </div>
</template>